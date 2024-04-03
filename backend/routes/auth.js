import express from "express";
import { login, register, logout, getUserInfo } from "../controller/auth.js";
import { uploadProfilePic } from "../multerConfig.js";

const router = express.Router();

router.post("/register", uploadProfilePic.single("profilePic"), register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/userInfo", getUserInfo);

export default router;
