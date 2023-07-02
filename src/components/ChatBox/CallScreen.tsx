import { PhoneIcon } from "@heroicons/react/solid";
import IconButton from "../shared/IconButton";
import avatarBg from "../../assets/chat-img.png";
import { CallContext, callStateEnum } from "../../context/callContext";
import { useContext, useEffect, useRef } from "react";
import { formatTime } from "../../helperes";
import AudioVisualizer from "./AudioVisualizer";

const CallScreen = () => {
  const { callState, endCall, callTimer, peer } = useContext(CallContext);
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (!peer || callState !== callStateEnum.CONNECTED) {
      return;
    }
    if (audioRef.current) {
      audioRef.current!.srcObject = peer.remoteStream;
    }
  }, [peer, callState, audioRef]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-between text-white">
      <div className="flex flex-col items-center gap-5 mt-2">
        <span className="text-sm ">
          {callState !== callStateEnum.CONNECTED
            ? callState
            : formatTime(callTimer)}
        </span>
        <div className="flex flex-col items-center gap-2">
          <div
            id="avatar"
            className="rounded-full h-20 w-20 border-4 border-white bg-cover bg-center"
            style={{
              backgroundImage: `url(${avatarBg})`,
            }}
          ></div>
          <span className="text-sm text-white">Mohamad</span>
        </div>
      </div>
      {callState === callStateEnum.CONNECTED && peer ? (
        <div className="flex w-full items-center justify-center">
          <audio ref={audioRef} autoPlay className="w-full" />
          {peer.remoteStream.active && (
            <div className="h-4">
              <AudioVisualizer stream={peer.remoteStream} recordingTime={0} />
            </div>
          )}
        </div>
      ) : null}
      <div className="mb-2">
        <IconButton
          size="sm"
          icon={<PhoneIcon className="w-4 h-4" />}
          color="danger"
          onClick={endCall}
        />
      </div>
    </div>
  );
};

export default CallScreen;
