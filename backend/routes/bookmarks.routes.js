import express from 'express';
import { verifyToken } from "../middleware/auth.middleware.js";
import { addBookmark, getBookmarks, isBookmarked } from "../controllers/bookmarks.controller.js";

const router = express.Router();

router.route("/")
    .get(getBookmarks)
    .post(verifyToken, addBookmark);

router.get("/:id", verifyToken, isBookmarked);

export default router;