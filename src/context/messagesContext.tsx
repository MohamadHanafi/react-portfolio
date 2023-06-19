import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";
import { MessageInterface } from "../interface";
import axios from "axios";

interface Props {
  children: ReactNode;
}

type MessagesContextType = {
  messages: MessageInterface[];
  setMessages: Dispatch<SetStateAction<MessageInterface[]>>;
  typedMessage: string;
  setTypedMessage: Dispatch<SetStateAction<string>>;
  audioFile: HTMLAudioElement | null;
  setAudioFile: Dispatch<SetStateAction<HTMLAudioElement | null>>;
  getAllMessages: (userId: string) => Promise<MessageInterface[]>;
  sendMessage: (message: MessageInterface) => Promise<boolean>;
};

export const MessagesContext = createContext<MessagesContextType>({
  messages: [],
  setMessages: () => {},
  typedMessage: "",
  setTypedMessage: () => {},
  audioFile: null,
  setAudioFile: () => {},
  getAllMessages: async () => [],
  sendMessage: async () => true,
});

const MessagesContextProvider = ({ children }: Props) => {
  // todo: the messages will be coming from the server
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [typedMessage, setTypedMessage] = useState("");
  const [audioFile, setAudioFile] = useState<HTMLAudioElement | null>(null);

  // this is a mock function to add a message to the chat
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         createdAt: new Date(),
  //         message: "Hello there",
  //         sender: "admin",
  //         id: Math.floor(Math.random() * 1000),
  //         state: "received",
  //         type: "text",
  //       },
  //     ]);
  //   }, 100000);

  //   const timeout = setTimeout(() => {
  //     clearInterval(interval);
  //   }, 100000);

  //   return () => {
  //     clearInterval(interval);
  //     clearTimeout(timeout);
  //   };
  // }, []);

  return (
    <MessagesContext.Provider
      value={{
        messages,
        setMessages,
        typedMessage,
        setTypedMessage,
        audioFile,
        setAudioFile,
        getAllMessages,
        sendMessage,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export default MessagesContextProvider;

export interface getAllMessagesResponse {
  messages: MessageInterface[];
}

async function getAllMessages(userId: string): Promise<MessageInterface[]> {
  const response = await axios.get<getAllMessagesResponse>(
    `${process.env.REACT_APP_SERVER_URL}/messages/${userId}?order=createdAt=asc`
  );
  const { data } = response;
  return data.messages;
}

async function sendMessage(message: MessageInterface) {
  try {
    const response = await axios.post<boolean>(
      `${process.env.REACT_APP_SERVER_URL}/messages`,
      message
    );
    const { data } = response;
    return data;
  } catch (error) {
    return false;
  }
}
