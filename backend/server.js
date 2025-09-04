import express from "express";
import http from "http";
import cors from "cors";
import { initWebSocket } from "./sockets/index.js";

import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import animeRoutes from "./routes/anime.routes.js";
import bookmarkRoutes from "./routes/bookmarks.routes.js";
import commentRoutes from "./routes/comments.routes.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/error.js";


import "./cron/cleanMFA.js";
import "./cron/cleanLoginAttempts.js";
const PORT = process.env.PORT || 8000;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({origin: IS_PRODUCTION ? "https://cc-anistream.vercel.app" : "http://localhost:5173",
        credentials: true,
    })
);
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/anime", animeRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/comments", commentRoutes);

app.get("/", (_req, res) => {
    res.send("Welcome to AniStream API.");
});

app.use(errorHandler);
app.use(notFound);

initWebSocket(server);
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));