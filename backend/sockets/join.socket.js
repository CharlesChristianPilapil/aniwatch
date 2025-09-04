const viewers = {};

const  broadcastCount = (channel, wss) => {
    const count = viewers[channel]?.size || 0;
    const payload = JSON.stringify({
        type: "join",
        action: "watching",
        channel,
        payload: { count },
    });

    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(payload);
        }
    });
}

const joinSocket = (ws, wss) => {
    let currentChannel = null;
    ws.on("message", (msg) => {
        try {
            const data = JSON.parse(msg.toString());

            if (data.type !== "join") return;

            switch (data.action) {
                case "watching": 
                    const channel = data.channel;

                    if (currentChannel && viewers[currentChannel]) {
                        viewers[currentChannel].delete(ws);
                        broadcastCount(currentChannel, wss);
                    }

                    currentChannel = channel;

                    if (!viewers[channel]) {
                        viewers[channel] = new Set();
                    }

                    viewers[channel].add(ws);

                    broadcastCount(channel, wss);
                    break;
                default: console.log("Unknown join action.");
            }
        } catch (err) {
            console.error("Invalid JSON received:", err);
        }
    });

    ws.on("close", () => {
        if (currentChannel && viewers[currentChannel]) {
            viewers[currentChannel].delete(ws);
            broadcastCount(currentChannel, wss);
        }
    });
};

export default joinSocket;