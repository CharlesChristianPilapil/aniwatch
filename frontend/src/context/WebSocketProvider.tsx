import { type ReactNode, useEffect, useState } from "react";
import baseWsUrl from "../utils/constants/baseWsUrl";
import { createContext } from "react";
import { v4 as uuidv4 } from "uuid";

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

    const getClientId = () => {
        let id = localStorage.getItem("anistream_client_id");
        if (!id) {
            id = uuidv4();
            localStorage.setItem("anistream_client_id", id);
        }

        return id;
    };

    const clientId = getClientId();

    useEffect(() => {
        const socket = new WebSocket(`${baseWsUrl}?clientId=${clientId}`);

        socket.onopen = () => console.log("✅ Socket Connected");
        socket.onclose = () => console.log("❌ Socket Disconnected");

        setSocket(socket);

        return () => socket.close();
    }, [clientId]);

    return (
        <WebSocketContext.Provider value={{ socket, sendMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export { WebSocketProvider, WebSocketContext };