import { WebSocketServer } from "ws";
import commentsSocket from "./comments.socket.js";
import joinSocket from "./join.socket.js";
import { v4 as uuidv4 } from 'uuid';

const DEBUG = process.env.NODE_ENV !== "production";

export const initWebSocket = (server) => {
    const wss = new WebSocketServer({ server, path: '/ws' });

    wss.on("connection", (ws) => {
        ws.id = uuidv4();

        if (DEBUG) console.log("Client connected");

        commentsSocket(ws, wss);
        joinSocket(ws, wss);

        ws.on("close", () => {
            if (DEBUG) console.log("Client disconnected");
        });
    });

    return wss;
};