import express from "express";
import {
    register,
    login,
    logout,
    verify,
    resendVerification,
} from "../controllers/auth-controllers/auth.controller.js";
import { 
    resendResetRequestCode, 
    resetPassword, 
    resetPasswordRequest, 
    verifyPasswordReset 
} from "../controllers/auth-controllers/reset-password.controller.js";
import { refreshSession, session } from "../controllers/auth-controllers/session.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/verify", verify);
router.post("/resend", resendVerification);
router.post("/logout", verifyToken, logout);

router.get("/session", verifyToken, session);
router.get("/refresh", refreshSession);

router.post("/reset-password/request", resetPasswordRequest);
router.post("/reset-password/verify", verifyPasswordReset);
router.post("/reset-password/resend-code", resendResetRequestCode);
router.post("/reset-password/reset", resetPassword);

export default router;
