import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getCollections = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `SELECT c.*, l.id AS userId, l.name FROM collections AS c JOIN login AS l on (l.id = c.userId)`;
    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addCollection = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json("Not Logged in");
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid");
    }
    if (!req.file) {
      return res.status(400).json("No file uploaded.");
    }

    const imgPath = req.file.path;
    const q =
      "INSERT INTO collections (`desc`, `img`, `price`, `userId`) VALUES (?, ?, ?, ?)";

    const values = [req.body.desc, imgPath, req.body.price, userInfo.id];

    try {
      db.query(q, values, (error, data) => {
        if (error) {
          console.error(error);
          return res
            .status(500)
            .json("Failed to add the collection due to an internal error.");
        }
        return res.status(200).json("Collection has been created");
      });
    } catch (error) {
      // 这个catch可能捕获db.query执行之前的任何异常
      console.error(error); // 记录异常详情以便调试
      return res.status(500).json("An unexpected error occurred.");
    }
  });
};

export const deleteCollection = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM collections WHERE `id`=? AND `userId` = ?";

    const values = [req.params.id, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0)
        return res.status(200).json("Collection has been deleted.");
      return res.status(403).json("You can delete only your collection");
    });
  });
};