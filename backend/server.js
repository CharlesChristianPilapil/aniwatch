import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import animeRoutes from "./routes/anime.routes.js";
import bookmarkRoutes from "./routes/bookmarks.routes.js";
// import postsRoutes from './routes/posts.js';
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/error.js";
import "./cron/cleanMFA.js";
import "./cron/cleanLoginAttempts.js";
const PORT = process.env.PORT || 5000;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: IS_PRODUCTION
            ? "https://cc-aniwatch.vercel.app"
            : "http://localhost:5173",
        credentials: true,
    })
);
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/anime", animeRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to AniWatch API.");
});

app.use(errorHandler);
app.use(notFound);

app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
