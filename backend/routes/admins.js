import express from "express";
import {
  adminLogin,
  adminRegister,
  adminLogout,
  getUsersList,
} from "../controller/admin.js";

const router = express.Router();

router.post("/adminRegister", adminRegister);
router.post("/adminLogin", adminLogin);
router.post("/adminLogout", adminLogout);
router.get("/adminGetInfo", getUsersList);

export default router;
