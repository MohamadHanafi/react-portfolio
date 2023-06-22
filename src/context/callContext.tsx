import { PropsWithChildren, createContext, useState } from "react";
import Peer from "webrtc-helper-library";

type CallContextType = {
  iceServers: RTCIceServer[];
  getLocalStream: () => Promise<MediaStream | undefined>;
  initCall: () => void;
};

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
};

enum errorEnums {
  "permissions" = "permissions",
}

export const CallContext = createContext<CallContextType>(defaultState);

export default function CallProvider({
  children,
}: PropsWithChildren<typeof CallProvider>) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [errors, setErrors] = useState<Record<errorEnums, string>>();

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

  const initCall = async () => {
    const stream = await getLocalStream();
    if (!stream) {
      return;
    }
    const peer = new Peer({
      initiator: true,
      localStream: stream,
      config: {
        iceServers: defaultState.iceServers,
      },
      enableDebugMode: true,
    });
  };

  return (
    <CallContext.Provider value={{ ...defaultState, getLocalStream }}>
      {children}
    </CallContext.Provider>
  );
}
