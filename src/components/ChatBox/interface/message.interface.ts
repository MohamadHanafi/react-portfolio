export interface MessageInterface {
  id: number;
  message: string;
  createdAt: Date;
  state: "pending" | "sent" | "received" | "read";
  sender: "user" | "admin";
}
