import { db } from '../connect.js';
import moment from 'moment';
import jwt from 'jsonwebtoken';


export const getPosts =(req, res)=> {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not Logged in")

    jwt.verify(token, "secretkey", (err, userInfo)=> {
     if(err) return res.status(403).json("Token is not valid")
    
     const q = `SELECT p.*, l.id AS userId, name FROM posts as p JOIN login AS l ON (l.id = p.userId) WHERE p.userId = ?`;

    
     db.query(q, [userInfo.id], (err,data)=>{
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    })
})
}

export const addPost = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not Logged in");

    jwt.verify(token, "secretkey", (err, userInfo)=> {
    if(err) return res.status(403).json("Token is not valid")
    
      
    const q = "INSERT INTO posts (`desc`, `createdAt`, `userId`) VALUES (?, ?, ?)";

    const values = [
        req.body.desc,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        userInfo.id
    ]
    db.query(q, values, (err, data) => { // 使用参数化查询
        if (err) return res.status(500).json(err);
        return res.status(200).json("Post has been created");
    });
})
};