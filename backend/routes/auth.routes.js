import express from "express";
import {
    register,
    login,
    logout,
    verify,
    session,
    resendVerification,
    resetPasswordRequest,
    verifyPasswordReset,
    resetPassword,
    resendResetRequestCode,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/verify", verify);
router.post("/resend", resendVerification);
router.post("/logout", verifyToken, logout);
router.get("/session", verifyToken, session);

router.post("/reset-password/request", resetPasswordRequest);
router.post("/reset-password/verify", verifyPasswordReset);
router.post("/reset-password/resend-code", resendResetRequestCode);
router.post("/reset-password/reset", resetPassword);

export default router;
