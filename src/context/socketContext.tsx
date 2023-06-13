import { createContext, useState } from "react";
import { Socket } from "socket.io-client";

type socketContextType = {
  socket?: Socket | null;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
  isConnected?: boolean;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
};

export const socketContext = createContext<socketContextType>({
  setSocket: () => {},
  setIsConnected: () => {},
});

export default function SocketContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  return (
    <socketContext.Provider
      value={{ socket, setSocket, isConnected, setIsConnected }}
    >
      {children}
    </socketContext.Provider>
  );
}
