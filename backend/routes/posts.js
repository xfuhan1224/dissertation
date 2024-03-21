import express from "express";
import { getPosts, addPost, deletePost } from '../controller/post.js';
import { upload } from '../multerConfig.js'

const router = express.Router();

router.get('/', getPosts);
router.post('/', upload.single('img'), addPost);
router.delete("/:id", deletePost);

export default router; 