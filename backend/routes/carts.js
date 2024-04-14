import express from "express";
import { getCart, addToCart, deleteFromCart } from "../controller/cart.js";

const router = express.Router();

router.get("/get", getCart);
router.post("/add", addToCart);
router.delete("/:id", deleteFromCart);

export default router;
