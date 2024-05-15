import express from "express";
import {
  getCollections,
  addCollection,
  deleteCollection,
  getCollectionById,
  getCollectionsByUserId,
} from "../controller/drop.js";
import { upload } from "../multerConfig.js";

const router = express.Router();

router.get("/", getCollections);
router.post("/", upload.single("img"), addCollection);
router.delete("/:id", deleteCollection);
router.get("/:id", getCollectionById);
router.get("/collections/user/:userId", getCollectionsByUserId);

export default router;
