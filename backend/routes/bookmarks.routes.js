import express from 'express';
import { verifyToken } from "../middleware/auth.middleware.js";
import { addBookmark, getBookmarks, isBookmarked, updateBookmark } from "../controllers/bookmarks.controller.js";

const router = express.Router();

router.route("/")
    .get(getBookmarks)
    .post(verifyToken, addBookmark);

router.route("/:id")
    .get(verifyToken, isBookmarked)
    .put(verifyToken, updateBookmark);

export default router;