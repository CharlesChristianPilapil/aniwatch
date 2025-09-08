import express from 'express';
import { addComment, getComments, getReplies } from "../controllers/comments.controller.js";
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/", verifyToken, addComment);
router.get("/", getComments);
router.get("/replies", getReplies);


export default router;