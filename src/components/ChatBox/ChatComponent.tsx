import { useEffect, useRef, useState } from "react";
import chatBG from "../../assets/7331541.jpg";
import ChatInputInterface from "./ChatInputInterface";
import ChatInterface from "./ChatInterface";
import { MessageInterface } from "./interface";

interface Props {
  messages: MessageInterface[];
  state: "close" | "open";
}

const ChatComponent = ({ messages, state }: Props) => {
  const [showToast, setShowToast] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state === "open") {
      ref.current?.focus();
    }
  }, [state, ref]);

  useEffect(() => {
    if (messages.length) {
      setShowToast(true);
      const timeout = setTimeout(() => {
        setShowToast(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [messages]);

  // if the state is close, it will render a small toast component
  if (state === "close") {
    if (showToast) {
      return (
        <div
          style={{
            maxWidth: "90%",
          }}
          className="typing bg-green-500  text-white font-semibold text-sm p-2 rounded-lg h-10 overflow-hidden"
        >
          <p
            className="overflow-hidden"
            style={{ textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {messages[messages.length - 1].message}
          </p>
        </div>
      );
    }
    return null;
  }

  return (
    <div
      style={{
        backgroundImage: `url(${chatBG})`,
        backgroundSize: "cover",
        boxShadow: "0px 0px 12px 0px rgba(22, 101, 52, 1)",
      }}
      className="h-72 w-60 rounded-md p-2 flex flex-col items-center"
    >
      <ChatInterface messages={messages} />
      <ChatInputInterface ref={ref} />
    </div>
  );
};

export default ChatComponent;
