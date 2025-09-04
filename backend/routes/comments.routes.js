import express from 'express';
import { addComment, getComments } from "../controllers/comments.controller.js";
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/", verifyToken, addComment);
router.get("/", getComments);


export default router;