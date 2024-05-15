import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = (req, res) => {
  const q = "SELECT userId FROM likes WHERE postId = ?";

  db.query(q, [req.query.postId], (err, data) => {
    // 使用参数化查询
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((like) => like.userId));
  });
};

export const addLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");
    const qCheckRevoked = "SELECT * FROM RevocationList WHERE userId = ?";
    db.query(qCheckRevoked, [userInfo.id], (err, revocationData) => {
      if (err) {
        console.error("Error querying the RevocationList:", err);
        return res.status(500).json("Internal server error");
      }
      if (revocationData.length > 0) {
        return res.status(403).json("This account has been revoked.");
      }

      const q = "INSERT INTO likes (`userId`, `postId`) VALUES (?, ?)";

      const values = [userInfo.id, req.body.postId];
      db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Post has been liked");
      });
    });
  });
};

export const deleteLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");
    const qCheckRevoked = "SELECT * FROM RevocationList WHERE userId = ?";
    db.query(qCheckRevoked, [userInfo.id], (err, revocationData) => {
      if (err) {
        console.error("Error querying the RevocationList:", err);
        return res.status(500).json("Internal server error");
      }
      if (revocationData.length > 0) {
        return res.status(403).json("This account has been revoked.");
      }

      const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";

      db.query(q, [userInfo.id, req.body.postId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Like has been deleted");
      });
    });
  });
};
