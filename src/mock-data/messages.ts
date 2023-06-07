import { MessageInterface } from "../components/ChatBox/interface";
export const mockMessages: MessageInterface[] = [
  {
    id: 1,
    message: "Hello, My name is Mohamad!",
    createdAt: new Date(),
    state: "sent",
    sender: "admin",
  },
  {
    id: 2,
    message: "how can I help you?",
    createdAt: new Date(),
    state: "sent",
    sender: "admin",
  },
  {
    id: 3,
    message: "Hello Mohamad! How are you?",
    createdAt: new Date(),
    state: "read",
    sender: "user",
  },
  {
    id: 4,
    message: "I want to know more about your products",
    createdAt: new Date(),
    state: "received",
    sender: "user",
  },
  {
    id: 5,
    message: "Can you please tell me more about your products?",
    createdAt: new Date(),
    state: "sent",
    sender: "user",
  },
];
