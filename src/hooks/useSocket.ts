import { useState, useEffect, useContext, useMemo } from "react";
import io from "socket.io-client";
import { socketContext } from "../context/socketContext";
import { SocketChannelsEnum } from "../interface/socket-channel.enum";

export const useSocket = (url: string) => {
  const { setSocket, socket, setIsConnected, isConnected } =
    useContext(socketContext);
  const [listeners, setListeners] = useState<SocketListener[]>([]);

  interface SocketData {
    event: string;
    payload: any;
  }

  type SocketListener = {
    channelName: SocketChannelsEnum;
    callBack: (data?: SocketData) => void;
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("connect_error", (err: any) => {
      console.error("connect_error", err);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket]);

  useEffect(() => {
    if (!isConnected) return;

    listeners.forEach((listener) => {
      socket?.on(listener.channelName, listener.callBack);
    });
    return () => {
      listeners.forEach((listener) => {
        socket?.off(listener.channelName, listener.callBack);
      });
    };
  }, [listeners, isConnected]);

  const connectSocket = useMemo(
    () => (id: string) => {
      if (isConnected) {
        return;
      } else {
        const socketTemp = io(url, {
          transports: ["websocket"],
          auth: {
            id,
          },
        });
        setSocket(socketTemp);
      }
    },
    [isConnected]
  );

  const addListener = (listener: SocketListener) => {
    setListeners([...listeners, listener]);
  };

  const removeListener = (channelName: string) => {
    setListeners(
      listeners.filter(
        (listenerItem) => listenerItem.channelName !== channelName
      )
    );
  };

  return {
    socket,
    connectSocket,
    addListener,
    removeListener,
    isConnected,
  };
};
