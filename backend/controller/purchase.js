import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getPurchasedItem = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q =
      "SELECT id AS collectedId, `desc` AS collectedName, img AS collectedImg, price AS collectedPrice FROM collections WHERE sold_to = ?";
    db.query(q, [userInfo.id], (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json(err);
      }
      return res.status(200).json(data);
    });
  });
};

export const purchaseCollections = (req, res) => {
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

      const { CollectionId } = req.body;
      const userId = userInfo.id;

      const qCheckExists =
        "SELECT * FROM collections WHERE id = ? AND sold_to IS NULL";
      db.query(qCheckExists, [CollectionId], (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        }
        if (results.length === 0) {
          return res
            .status(409)
            .json({ success: false, message: "Item has already been sold" });
        }

        // Process the purchase
        const qBuy = "UPDATE collections SET sold_to = ? WHERE id = ?";
        db.query(qBuy, [userId, CollectionId], (error, data) => {
          if (error) {
            console.error("Purchase error:", error);
            return res
              .status(500)
              .json({ success: false, message: "Failed to purchase" });
          }
          return res
            .status(200)
            .json({ success: true, message: "Item has been purchased" });
        });
      });
    });
  });
};
