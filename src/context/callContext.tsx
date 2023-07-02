import { PropsWithChildren, createContext, useEffect, useState } from "react";
import Peer from "webrtc-helper-library";
import { useSocket } from "../hooks/useSocket";
import { SocketCallEnum, SocketChannelsEnum } from "../interface";
import axios from "axios";

type CallContextType = {
  iceServers: RTCIceServer[];
  getLocalStream: () => Promise<MediaStream | undefined>;
  initCall: (id: string) => void;
  endCall: () => void;
  callState: callStateEnum | undefined;
  setCallState: React.Dispatch<React.SetStateAction<callStateEnum | undefined>>;
  callTimer: number;
  peer: Peer | null;
};

export enum callStateEnum {
  REQUESTING_PERMISSION = "requesting permission",
  CALLING = "calling",
  RINGING = "ringing",
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
  ENDED = "ended",
}

const defaultState = {
  iceServers: [
    { urls: ["stun:fr-turn1.xirsys.com"] },
    {
      username:
        "30BffhN7GX0pvnzKWqAyMZ3-uQ4SWgS8FqFZNSv1FDimejO-GPXTWZzzwi9gU-qAAAAAAGSSpUVtb2hkaGFuYWZpMTIy",
      credential: "6aaf5ffa-1004-11ee-a2b8-0242ac120004",
      urls: [
        "turn:fr-turn1.xirsys.com:80?transport=udp",
        "turn:fr-turn1.xirsys.com:3478?transport=udp",
        "turn:fr-turn1.xirsys.com:80?transport=tcp",
        "turn:fr-turn1.xirsys.com:3478?transport=tcp",
        "turns:fr-turn1.xirsys.com:443?transport=tcp",
        "turns:fr-turn1.xirsys.com:5349?transport=tcp",
      ],
    },
  ],
  getLocalStream: async () => undefined,
  initCall: async () => {},
  endCall: async () => {},
  callState: undefined,
  setCallState: () => {},
  callTimer: 0,
  peer: null,
};

enum errorEnums {
  "permissions" = "permissions",
}

export const CallContext = createContext<CallContextType>(defaultState);

export default function CallProvider({ children }: PropsWithChildren) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [errors, setErrors] = useState<Record<errorEnums, string>>();
  const [adminId, setAdminId] = useState<string>("");

  const [callTimer, setCallTimer] = useState<number>(0);

  const [peer, setPeer] = useState<Peer | null>(null);
  const [iceCandidates, setIceCandidates] = useState<RTCIceCandidate[]>([]);
  const [isOfferSent, setIsOfferSent] = useState(false);
  const [isAnswerReceived, setIsAnswerReceived] = useState(false);

  const [callState, setCallState] = useState<callStateEnum>();

  const { addListener, isConnected, removeListener, socket } = useSocket(
    process.env.REACT_APP_SOCKET_URL ||
      "https://express-portfolio9-0a28ad87d535.herokuapp.com"
  );

  const getLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      setErrors({
        [errorEnums.permissions]: "Microphone permissions not granted",
      });
    }
  };

  useEffect(() => {
    if (!isAnswerReceived || !adminId || !iceCandidates.length) {
      return;
    }
    iceCandidates.forEach((candidate) => {
      socket?.emit(SocketChannelsEnum.CALL, {
        event: SocketCallEnum.ICE_CANDIDATE,
        payload: { candidate, callerId: adminId },
      });
    });
  }, [isAnswerReceived, iceCandidates, adminId]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (callState === callStateEnum.CONNECTED) {
      timeout = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    }
    if (callState === callStateEnum.ENDED) {
      setIsOfferSent(false);
      timeout = setTimeout(() => {
        setCallState(undefined);
      }, 2000);
    }
    return () => {
      clearTimeout(timeout);
      clearInterval(timeout);
    };
  }, [callState]);

  useEffect(() => {
    if (!isConnected) {
      return () => console.warn("The socket is not connected");
    }
    if (!isOfferSent) {
      return;
    }
    // we need two listeners: one for the answer and one for the ice candidate
    addListener({
      channelName: SocketChannelsEnum.CALL,
      callBack: async (data) => {
        if (!data) {
          console.info("No data received from the socket");
          return;
        }
        switch (data?.event) {
          case SocketCallEnum.RINGING:
            setCallState(callStateEnum.RINGING);
            break;
          case SocketCallEnum.END_CALL:
            endCall();
            break;
          case SocketCallEnum.ANSWER:
            peer!.handleAnswer(data.payload.answer);
            setIsAnswerReceived(true);
            setCallState(callStateEnum.CONNECTED);
            break;
          case SocketCallEnum.ICE_CANDIDATE:
            peer!.addIceCandidate([data.payload.candidate]);
            break;
          default:
            console.info("unknown event", data);
            break;
        }
      },
    });
    return () => {
      removeListener(SocketChannelsEnum.CALL);
    };
  }, [isOfferSent, isConnected]);

  useEffect(() => {
    getAdminId().then((id) => setAdminId(id));
  }, [isOfferSent]);

  const initCall = async (id: string) => {
    setCallState(callStateEnum.REQUESTING_PERMISSION);
    const stream = await getLocalStream();
    if (!stream) {
      setCallState(undefined);
      return;
    }
    setCallState(callStateEnum.CALLING);
    const peer = new Peer({
      initiator: true,
      localStream: stream,
      config: {
        iceServers: defaultState.iceServers,
      },
      enableDebugMode: true,
      onIceCandidateHandler: (event) => {
        if (!event.candidate) {
          return;
        }
        setIceCandidates((prev) => [...prev, event.candidate!]);
      },
      onConnectionStateChangeHandler: () => {
        console.log("[WebRTC][connection state]", peer.peer.connectionState);
      },
    });
    setPeer(peer);
    // will post a call request through notification
    // first create offer
    const offer = await peer.handleOffer();
    // then the offer in a notification to the phone
    await postNotification(offer, id);
    // set the socket to listen for an answer
    setIsOfferSent(true);
  };

  const endCall = async () => {
    // stop the audio stream
    localStream?.getTracks().forEach((track) => track.stop());
    await peer?.peer.close();
    setPeer(null);
    setLocalStream(null);
    setCallState(callStateEnum.ENDED);
    setIsOfferSent(false);
    setIsAnswerReceived(false);
    setCallTimer(0);
    setIceCandidates([]);

    // emit an event to the server to end the call
    socket?.emit(SocketChannelsEnum.CALL, {
      event: SocketCallEnum.END_CALL,
      payload: { callerId: adminId, userId: localStorage.getItem("id") },
    });
  };

  // will be used to handle the events coming from the socket

  return (
    <CallContext.Provider
      value={{
        ...defaultState,
        getLocalStream,
        initCall,
        endCall,
        callState,
        setCallState,
        callTimer,
        peer,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}

async function postNotification(offer: RTCSessionDescriptionInit, id: string) {
  try {
    await axios.post(`${process.env.REACT_APP_SERVER_URL}/notifications/call`, {
      offer,
      id,
    });
  } catch (error) {
    console.error(error);
  }
}

async function getAdminId() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/notifications/adminId`
    );
    const { data } = response;
    return data.id;
  } catch (error) {
    console.error(error);
  }
}
