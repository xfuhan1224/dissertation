import express from "express";
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import likeRoutes from './routes/likes.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import dropRoutes from './routes/drops.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


const app = express();
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true, 
};
  
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// 使用用户路由
app.use('/backend/users', userRoutes);
app.use('/backend/auth', authRoutes);
app.use('/backend/posts', postRoutes);
app.use('/backend/comments', commentRoutes);
app.use('/backend/likes', likeRoutes);
app.use('/backend/drops', dropRoutes);


app.listen(8081, ()=> {
    console.log("listening");
});
