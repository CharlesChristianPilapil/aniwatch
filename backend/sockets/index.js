import { WebSocketServer } from "ws";
import commentsSocket from "./comments.socket.js";
import joinSocket from "./join.socket.js";

const DEBUG = process.env.NODE_ENV !== "production";

export const initWebSocket = (server) => {
    const wss = new WebSocketServer({ server, path: '/ws' });

    wss.on("connection", (ws, req) => {
        if (DEBUG) console.log("Client connected");

        commentsSocket(ws, wss);
        joinSocket(ws, req, wss);

        ws.on("close", () => {
            if (DEBUG) console.log("Client disconnected");
        });
    });

    return wss;
};