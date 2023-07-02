import { useContext, useEffect, useState } from "react";
import ChatButton from "./ChatButton";
import { MessagesContext } from "../../context/messagesContext";
import ChatComponent from "./ChatComponent";
import { useSocket } from "../../hooks/useSocket";

import { v4 as uuid } from "uuid";

const ChatBox = () => {
  // the chat toast is to be added dynamically
  // the messages will be coming from context
  const [chatComponentState, setChatComponentState] = useState<
    "open" | "close"
  >("close");
  const [userId, setUserId] = useState<string>(
    localStorage.getItem("id") || ""
  );

  const { messages, getAllMessages, setMessages } = useContext(MessagesContext);

  const { connectSocket, removeListener, isConnected } = useSocket(
    process.env.REACT_APP_SOCKET_URL ||
      "https://express-portfolio9-0a28ad87d535.herokuapp.com"
  );

  useEffect(() => {
    if (!userId) {
      let id = uuid();
      localStorage.setItem("id", id);
      setUserId(id);
    }

    if (!isConnected && userId) {
      connectSocket(userId);
    }

    return () => {
      removeListener("chat");
    };
  }, [isConnected, userId]);

  useEffect(() => {
    if (userId) {
      getAllMessages(userId).then((response) => setMessages(response));
    }
  }, [userId]);

  useEffect(() => {}, [messages]);

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
