import express from "express";
import { revokeCertificate } from "../controller/revoke.js";

const router = express.Router();

router.post("/revokeCertificate", revokeCertificate);

export default router;
