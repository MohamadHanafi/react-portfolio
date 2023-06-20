import { useContext, useEffect, useRef, useState } from "react";
import chatBG from "../../assets/7331541.jpg";
import ChatInputInterface from "./ChatInputInterface";
import ChatInterface from "./ChatInterface";
import { useSocket } from "../../hooks/useSocket";
import { MessagesContext } from "../../context/messagesContext";
import { MessageInterface, socketChatEnum } from "../../interface";
import { SocketChannelsEnum } from "../../interface";

interface Props {
  messages: MessageInterface[];
  state: "close" | "open";
}

const ChatComponent = ({ messages, state }: Props) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const ref = useRef<HTMLInputElement>(null);

  const { addListener, isConnected, removeListener } = useSocket(
    "https://express-portfolio9-0a28ad87d535.herokuapp.com"
  );

  const { setMessages } = useContext(MessagesContext);

  useEffect(() => {
    if (isConnected) {
      addListener({
        channelName: SocketChannelsEnum.CHAT,
        callBack: (data) => {
          console.log(data);
          if (data?.event === socketChatEnum.NEW_MESSAGE) {
            setToastMessage((data?.payload as MessageInterface).message);
            setMessages((prev) => [
              ...prev,
              {
                message: data?.payload.message,
                sender: "admin",
                createdAt: new Date(),
                state: "received",
                type: "text",
              },
            ]);
            setShowToast(true);
            setTimeout(() => {
              setShowToast(false);
            }, 2000);
          }
        },
      });
    }
    return () => {
      removeListener("chat");
    };
  }, [isConnected]);

  useEffect(() => {
    if (state === "open") {
      ref.current?.focus();
    }
  }, [state, ref]);

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
            {toastMessage}
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
