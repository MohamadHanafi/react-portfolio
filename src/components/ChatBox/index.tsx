import { useContext, useState } from "react";
import ChatButton from "./ChatButton";
import { MessagesContext } from "../../context/messagesContext";
import ChatComponent from "./ChatComponent";

const ChatBox = () => {
  // the chat toast is to be added dynamically
  // the messages will be coming from context
  const [chatComponentState, setChatComponentState] = useState<
    "open" | "close"
  >("close");

  const { messages } = useContext(MessagesContext);

  return (
    <div
      style={{ maxWidth: "90%" }}
      className="chat-box fixed bottom-4 left-3 flex items-end justify-items-center gap-2 z-50"
    >
      <ChatButton onClick={setChatComponentState} />
      <ChatComponent messages={messages} state={chatComponentState} />
    </div>
  );
};

export default ChatBox;
