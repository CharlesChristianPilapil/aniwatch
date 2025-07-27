import express from 'express';
import { register, login, logout, verify } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/verify", verify);
router.post("/logout", logout);

export default router;