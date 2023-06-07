import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { MessageInterface } from "../components/ChatBox/interface";
import { mockMessages } from "../mock-data";

interface Props {
  children: ReactNode;
}

type MessagesContextType = {
  messages: MessageInterface[];
  setMessages: Dispatch<SetStateAction<MessageInterface[]>>;
  typedMessage: string;
  setTypedMessage: Dispatch<SetStateAction<string>>;
};

export const MessagesContext = createContext<MessagesContextType>({
  messages: [],
  setMessages: () => {},
  typedMessage: "",
  setTypedMessage: () => {},
});

const MessagesContextProvider = ({ children }: Props) => {
  // todo: the messages will be coming from the server
  const [messages, setMessages] = useState<MessageInterface[]>(mockMessages);
  const [typedMessage, setTypedMessage] = useState("");

  // this is a mock function to add a message to the chat
  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prev) => [
        ...prev,
        {
          createdAt: new Date(),
          message: "Hello there",
          sender: "admin",
          id: Math.floor(Math.random() * 1000),
          state: "received",
        },
      ]);
    }, 100000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 100000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <MessagesContext.Provider
      value={{ messages, setMessages, typedMessage, setTypedMessage }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export default MessagesContextProvider;
