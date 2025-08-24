import express from 'express';
import { getCurrentUser, getUserInfo, removeAvatar, resendUserUpdateVerification, updateAvatar, updateEmail, updateProfile, userUpdateRequestVerification } from '../controllers/users.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { uploadMiddleware } from '../middleware/upload.middleware.js';

const router = express.Router();

router.get("/me", verifyToken, getCurrentUser);
router.get("/:username", getUserInfo);
router.post(
    "/update-avatar", 
    verifyToken, 
    uploadMiddleware("avatars").single("avatar_image"), 
    updateAvatar
);
router.delete("/remove-avatar", verifyToken, removeAvatar);
router.patch("/update-profile", verifyToken, updateProfile);

router.post("/update/email", verifyToken, updateEmail);
router.post("/update/verify", verifyToken, userUpdateRequestVerification);
router.post("/update/verify/resend", verifyToken, resendUserUpdateVerification);

export default router;