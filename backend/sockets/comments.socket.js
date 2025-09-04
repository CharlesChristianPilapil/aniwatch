const commentsSocket = (ws, wss) => {
    ws.on("message", (msg) => {
        try {
            const data = JSON.parse(msg.toString());

            if (data.type !== "anime_episode_comment") return;

            const broadCast = (payload, excludeSender = false) => {
                wss.clients.forEach((client) => {
                    if (client.readyState === client.OPEN) {
                        if (excludeSender && client === ws) return;
                        client.send(
                            JSON.stringify({
                                type: data.type,
                                action: data.action,
                                channel: data.channel,
                                payload,
                            })
                        );
                    };
                });
            };

            switch (data.action) {
                case "post_comment": 
                    broadCast(data.payload);
                    break;
                case "typing":
                    const payload = { message: `${ws.id} is typing...`, isTyping: data.payload.isTyping, }
                    broadCast(payload, true);
                    break;
                default: console.log("Unknown command.");
            }
        } catch (err) {
            console.error("Invalid JSON received:", err);
        }
    });
};

export default commentsSocket;