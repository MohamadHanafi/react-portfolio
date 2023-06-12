import { useEffect, useState } from "react";
import { MessageInterface } from "./interface";
import AudioPlayer from "./AudioPlayer";

interface Props {
  message: MessageInterface;
  showTriangle?: boolean;
  trianglePosition?: "left" | "right";
}

const Message = ({
  message: { sender, message, createdAt, state, type },
  showTriangle = false,
  trianglePosition,
}: Props) => {
  const [file, setFile] = useState<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (type !== "audio") return;

    const convertSrcToAudioFile = (src: string) => {
      const audioFile = new Audio(src);
      return audioFile;
    };

    const audioFile = convertSrcToAudioFile(message);
    setFile(audioFile);
  }, [message, type]);

  return (
    <div
      style={{
        maxWidth: `${type === "text" ? "90%" : "70%"}`,
      }}
      className={`text-xs py-1 px-2.5 rounded-md relative ${senderToClass[sender]}`}
    >
      {type === "text" ? message : file && <AudioPlayer audioFile={file} />}
      {showTriangle && trianglePosition && (
        <Triangle position={trianglePosition} />
      )}
    </div>
  );
};

const senderToClass: Record<MessageInterface["sender"], string> = {
  admin: "bg-gray-500 text-white text-opacity-60 self-start",
  user: "bg-green-500 text-white text-opacity-90 self-end",
};

const Triangle = ({ position }: { position: "left" | "right" }) => {
  return (
    <div
      style={{
        borderTop:
          position === "left"
            ? "12px solid rgb(107, 114, 128)"
            : "12px solid rgb(16, 185, 129)",
        borderLeft: position === "left" ? "16px solid transparent" : undefined,
        borderRight:
          position === "right" ? "16px solid transparent" : undefined,
      }}
      className={`w-0 h-0 absolute top-0 ${
        position === "left" ? "-left-1.5" : "-right-1.5"
      }`}
    ></div>
  );
};

export default Message;
