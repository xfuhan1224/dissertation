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
    return res.status(401).json({ success: false, message: "Not logged in" });
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Token is not valid" });
    }

    const qCheckRevoked = "SELECT * FROM RevocationList WHERE userId = ?";
    db.query(qCheckRevoked, [userInfo.id], (err, revocationData) => {
      if (err) {
        console.error("Error querying the RevocationList:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
      if (revocationData.length > 0) {
        return res
          .status(403)
          .json({ success: false, message: "This account has been revoked." });
      }

      const { collectionId } = req.body;
      const userId = userInfo.id;

      const qCheckExists =
        "SELECT * FROM cart WHERE userId = ? AND collectionId = ?";
      db.query(qCheckExists, [userId, collectionId], (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        }
        if (results.length > 0) {
          return res
            .status(409)
            .json({ success: false, message: "Item already in cart" });
        }

        const qAdd = "INSERT INTO cart (userId, collectionId) VALUES (?, ?)";
        db.query(qAdd, [userId, collectionId], (error, data) => {
          if (error) {
            console.error("Database error during add to cart:", error);
            return res
              .status(500)
              .json({ success: false, message: "Failed to add item to cart" });
          }
          return res
            .status(200)
            .json({ success: true, message: "Item has been added to cart" });
        });
      });
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

      const q = "DELETE FROM cart WHERE `id`=? AND `userId` = ?";
      const values = [req.params.id, userInfo.id];
      db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows > 0)
          return res.status(200).json("Collection has been deleted.");
        return res.status(403).json("You can delete only from your cart");
      });
    });
  });
};
