export interface MessageInterface {
  _id?: string;
  message: string;
  createdAt?: Date;
  state: "pending" | "sent" | "received" | "read" | "failed";
  sender: "user" | "admin";
  type: "text" | "audio";
  userId?: string;
}
