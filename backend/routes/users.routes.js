import express from 'express';
import { getCurrentUser, getUserInfo } from '../controllers/users.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/me", verifyToken, getCurrentUser);
router.get("/:username", getUserInfo);

export default router;