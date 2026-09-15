import { createContext, useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  useEffect(() => {
    if (!user) return;
    const socket = io("/", { path: "/socket.io", withCredentials: true });
    socket.emit(user.role === "admin" ? "join:admin" : "join:customer", user.id);
    return () => socket.disconnect();
  }, [user]);
  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
}
export const useSocket = () => useContext(SocketContext);