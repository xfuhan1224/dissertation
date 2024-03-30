import { db } from "../connect.js";
import moment from "moment";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `SELECT p.*, l.id AS userId, l.name FROM posts AS p JOIN login AS l ON (l.id = p.userId)`;

    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  console.log(req.body);
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => { 
    if (err) return res.status(403).json("Token is not valid");
    if (!req.file) return res.status(400).json("No file uploaded.");

    const imgPath = req.file.path;
    const q =
      "INSERT INTO posts (`desc`, `img`, `createdAt`, `userId`) VALUES (?, ?, ?, ?)";

    const values = [
      req.body.desc,
      imgPath,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];
    db.query(q, values, (err, data) => {
      // 使用参数化查询
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM posts WHERE `id`=? AND `userId` = ?";

    const values = [req.params.id, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0)
        return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post");
    });
  });
};
