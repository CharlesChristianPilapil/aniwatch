import url from "url";

const viewers = {};
const connections = new Map();

const  broadcastCount = (channel, wss) => {
    const count = viewers[channel]
        ? viewers[channel].size
        : 0;

    const payload = JSON.stringify({
        type: "join",
        action: "watching",
        channel,
        payload: { count },
    });

    wss.clients.forEach((client) => {
        const conn = connections.get(client);
        if (client.readyState === client.OPEN && conn?.channel === channel) {
            client.send(payload);
        }
    });
}

const joinSocket = (ws, req, wss) => {
    const { query } = url.parse(req.url, true);
    const { clientId } = query;

    if (!clientId) {
        ws.close();
        return;
    }

    ws.clientId = clientId;

    ws.on("message", (msg) => {
        try {
            const data = JSON.parse(msg.toString());

            if (data.type !== "join") return;

            switch (data.action) {
                case "watching": 
                    const channel = data.channel;
                    if (!channel) return;

                    const prev = connections.get(ws);
                    const prevChannel = prev?.channel;

                    if (prevChannel && viewers[prevChannel]) {
                        const prevCount = viewers[prevChannel].get(clientId) || 0;

                        if (prevCount > 1) {
                            viewers[prevChannel].set(clientId, prevCount - 1);
                        } else {
                            viewers[prevChannel].delete(clientId);
                            if (viewers[prevChannel].size === 0) {
                                delete viewers[prevChannel];
                            }
                        }

                        broadcastCount(prevChannel, wss);
                    }

                    connections.set(ws, { clientId, channel });
                    if (!viewers[channel]) viewers[channel] = new Map();

                    const count = viewers[channel].get(clientId) || 0;
                    viewers[channel].set(clientId, count + 1);
            
                    broadcastCount(channel, wss);

                    break;
                default: console.log("Unknown join action.");
            }
        } catch (err) {
            console.error("Invalid JSON received:", err);
        }
    });

    ws.on("close", () => {
        const conn = connections.get(ws);
        if (conn) {
            const { clientId, channel } = conn;

            if (viewers[channel]) {
                const prevCount = viewers[channel].get(clientId) || 0;
                if (prevCount > 1) {
                    viewers[channel].set(clientId, prevCount - 1);
                } else {
                    viewers[channel].delete(clientId);
                    if (viewers[channel].size === 0) {
                        delete viewers[channel];
                    }
                }
            }

            broadcastCount(channel, wss);
            connections.delete(ws);
        }
    });
};

export default joinSocket;