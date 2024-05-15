import express from "express";
import {
  purchaseCollections,
  getPurchasedItem,
} from "../controller/purchase.js";

const router = express.Router();

router.get("/get", getPurchasedItem);
router.post("/buy", purchaseCollections);

export default router;
