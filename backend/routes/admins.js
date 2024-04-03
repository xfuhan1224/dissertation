import express from "express";
import { adminLogin, adminRegister, adminLogout } from "../controller/admin.js";

const router = express.Router();

router.post("/adminRegister", adminRegister);
router.post("/adminLogin", adminLogin);
router.post("/adminLogout", adminLogout);

export default router;
