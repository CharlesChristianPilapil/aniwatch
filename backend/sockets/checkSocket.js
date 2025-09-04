export const checkSocket = (ws, wss) => {
    ws.on("message", (msg) => {
        try {
            const data = JSON.parse(msg.toString());
            const message = data.payload.message;

            if (data.type !== "checkSocket") return;
            
            wss.clients.forEach((client) => {
                if (client.readyState === client.OPEN) {                    
                    client.send(JSON.stringify({
                        channel: data.channel,
                        type: data.type,
                        payload: `Server received: ${message}`
                    })); 
                }
            });
        } catch (err) {
            console.error("Invalid JSON in checkSocket:", err);
        }
    });
};

export default checkSocket;