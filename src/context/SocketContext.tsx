// SocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext"; // your existing auth context

type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType>({ socket: null });
export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth(); // logged in user
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (user) {
      //  connect socket after login
      const s = io(import.meta.env.VITE_BACKEND_URL, {
        withCredentials: true,
        transports: ["websocket", "polling"],
      });

      s.on("connect", () => {
        console.log("Connected to socket:", s.id);
        // tell backend this userId is online
        s.emit("join", user.userId);
      });

      setSocket(s);

      // cleanup on unmount or logout
      return () => {
        s.disconnect();
        setSocket(null);
        console.log(" Socket disconnected");
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
