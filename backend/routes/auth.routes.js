import express from "express";
import {
    register,
    login,
    logout,
    verify,
    session,
    resendVerification,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/verify", verify);
router.post("/resend", resendVerification);
router.post("/logout", logout);
router.get("/session", verifyToken, session);

export default router;
