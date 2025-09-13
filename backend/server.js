import http from "http";
import { initWebSocket } from "./sockets/index.js";
import app from "./app.js"

const PORT = process.env.PORT || 8000;


const server = http.createServer(app);

initWebSocket(server);
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));