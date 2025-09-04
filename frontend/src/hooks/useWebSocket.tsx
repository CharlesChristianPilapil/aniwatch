import { useCallback, useContext } from "react"
import { WebSocketContext } from "../context/WebSocketProvider";

const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) throw new Error("useWebSocket must be used within a WebSocketProvider");

    const { socket, sendMessage } = context;

    const addSocketListener = useCallback(
        <T,>(handler: (data: T) => void) => {
            if (!socket) return () => {};

            const listener = (event: MessageEvent) => {
                try {
                    const data = JSON.parse(event.data);
                    handler(data);
                } catch (error) {
                    console.error("Invalid message from server", error);
                }
            }

            socket.addEventListener("message", listener);
            return () => socket.removeEventListener("message", listener);
        },
        [socket]
    );

    return { socket, sendMessage, addSocketListener };
};

export default useWebSocket;