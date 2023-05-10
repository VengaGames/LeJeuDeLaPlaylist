import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
  const socket = useRef();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_BACKEND_ENDPOINT, {
      transports: ["websocket"],
      upgrade: false,
    });

    socket.current.on("connect", () => {
      setIsConnected(true);
    });

    socket.current.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.current.off("connect");
      socket.current.off("disconnect");
    };
  }, []);

  return { socket: socket.current, isConnected } || {};
};

export default useSocket;
