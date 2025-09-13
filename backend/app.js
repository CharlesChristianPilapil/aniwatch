import express from "express";
import cors from "cors";

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

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const FRONTEND_ORIGIN = IS_PRODUCTION ? "https://cc-anistream.vercel.app" : "http://localhost:5173";

const app = express();

app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: FRONTEND_ORIGIN,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/anime", animeRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/comments", commentRoutes);

app.get("/", (_req, res) => res.send("Welcome to AniStream API."));

app.use(errorHandler);
app.use(notFound);

export default app;