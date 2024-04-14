import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getCart = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `SELECT c.id AS cartId, c.userId, c.collectionId, col.desc AS collectionName, col.img AS collectionImg, col.price AS collectionPrice FROM cart c JOIN collections col ON c.collectionId = col.id WHERE c.userId = ?;`;
    db.query(q, [userInfo.id], (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json(err);
      }
      return res.status(200).json(data);
    });
  });
};

export const addToCart = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json("Not Logged in");
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid");
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

      const q = "INSERT INTO cart (userId, collectionId) VALUES (?, ?)";
      const values = [userInfo.id, req.body.collectionId];
      try {
        db.query(q, values, (error, data) => {
          if (error) {
            console.error(error);
            return res
              .status(500)
              .json("Failed to add to cart due to an internal error.");
          }
          return res.status(200).json("Item has been added to cart");
        });
      } catch (error) {
        // 这个catch可能捕获db.query执行之前的任何异常
        console.error(error); // 记录异常详情以便调试
        return res.status(500).json("An unexpected error occurred.");
      }
    });
  });
};

export const deleteFromCart = (req, res) => {
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

      const q = "DELETE FROM cart WHERE id = ? AND userId = ?";
      const values = [req.body.cartId, req.body.userId];
      db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows > 0)
          return res.status(200).json("Collection has been deleted.");
        return res.status(403).json("You can delete only from your cart");
      });
    });
  });
};
