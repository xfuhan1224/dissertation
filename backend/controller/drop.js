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

export const getCollectionById = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const collectionId = req.params.id; // 获取URL中的ID参数
    const q = `SELECT c.*, l.name AS creatorName
    FROM collections AS c
    JOIN login AS l ON l.id = c.userId
    WHERE c.id = ?;
    `;

    db.query(q, [collectionId], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length > 0) {
        return res.status(200).json(data[0]); // 返回单个collection的数据
      } else {
        return res.status(404).json("Collection not found");
      }
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

    const qCheckRevoked = "SELECT * FROM RevocationList WHERE userId = ?";
    db.query(qCheckRevoked, [userInfo.id], (err, revocationData) => {
      if (err) {
        console.error("Error querying the RevocationList:", err);
        return res.status(500).json("Internal server error");
      }
      if (revocationData.length > 0) {
        return res.status(403).json("This account has been revoked.");
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
  });
};

export const deleteCollection = (req, res) => {
  console.log("Delete request received for collection with ID:", req.params.id);
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const qCheckRevoked = "SELECT * FROM RevocationList WHERE userId = ?";
    db.query(qCheckRevoked, [userInfo.id], (err, revocationData) => {
      if (err) {
        console.error("Error querying the RevocationList:", err);
        return res.status(500).json("Internal server error");
      }
      if (revocationData.length > 0) {
        return res.status(403).json("This account has been revoked.");
      }

      const q = "DELETE FROM collections WHERE `id`=? AND `userId` = ?";

      const values = [req.params.id, userInfo.id];

      db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows > 0)
          return res.status(200).json("Collection has been deleted.");
        return res.status(403).json("You can delete only your collection");
      });
    });
  });
};
