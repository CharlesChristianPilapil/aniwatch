import { type ReactNode, useEffect, useState } from "react";
import baseWsUrl from "../utils/constants/baseWsUrl";
import { createContext } from "react";

type WebSocketContextType = {
    socket: WebSocket | null;
    sendMessage: <T = unknown>(message: T) => void;
};

const WebSocketContext = createContext<WebSocketContextType>({ 
    socket: null, 
    sendMessage: () => {} 
});

const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    const sendMessage = <T = unknown>(message: T) => {
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        }
    };

    useEffect(() => {
        const socket = new WebSocket(baseWsUrl);

        socket.onopen = () => console.log("✅ Socket Connected");
        socket.onclose = () => console.log("❌ Socket Disconnected");

        setSocket(socket);

        return () => socket.close();
    }, []);

    return (
        <WebSocketContext.Provider value={{ socket, sendMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export { WebSocketProvider, WebSocketContext };