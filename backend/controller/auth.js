import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateKeyPair } from "../keyPairService.js";
import { generateCSR } from "../keyPairService.js";
// import { requestCASignature } from "../caService.js";
import { requestCASignatureWithCSR } from "../caService.js";

export const register = async (req, res) => {
  const q = "SELECT * FROM login WHERE email = ?";
  db.query(q, [req.body.email], async (err, data) => {
    if (err) {
      console.error("Error querying the database: ", err);
      return res.status(500).json(err);
    }
    if (data.length) {
      return res.status(409).json("User already exists");
    } else {
      const { publicKey, privateKey } = generateKeyPair();
      const salt = bcrypt.genSaltSync(10);
      if (!req.body.password) {
        return res.status(400).send("No password provided");
      }
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);

      const subjectAttributes = [
        { name: "commonName", value: req.body.name },
        { name: "emailAddress", value: req.body.email },
      ];

      try {
        const csrPem = generateCSR(publicKey, privateKey, subjectAttributes);
        const signedCertificatePem = await requestCASignatureWithCSR(
          csrPem,
          privateKey
        );

        const q1 =
          "INSERT INTO login (`profilePic`, `name`, `email`, `password`, `joinedAt`, `isRevoked`, `publicKey`, `certificate`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const imgPath = req.file ? req.file.path : "";
        const joinedAt = new Date().toISOString().slice(0, 10);
        const isRevoked = 0;
        db.query(
          q1,
          [
            imgPath,
            req.body.name,
            req.body.email,
            hashedPassword,
            joinedAt,
            isRevoked,
            publicKey,
            signedCertificatePem, // 存储签名证书
          ],
          (err, data) => {
            if (err) {
              console.error("Error inserting new user: ", err);
              return res.status(500).json(err);
            }
            return res.status(200).json({
              message: "User has been created.",
              publicKey: publicKey, // 返回公钥
              certificate: signedCertificatePem, // 返回签名证书
            });
          }
        );
      } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Error during registration process" });
      }
    }
  });
};

export const login = (req, res) => {
  const q = "SELECT * FROM login WHERE email = ?";
  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found");
    if (data[0].isRevoked) return res.status(403).json("Account is revoked");

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    if (!checkPassword)
      return res.status(400).json("Wrong password or username");
    const token = jwt.sign({ id: data[0].id }, "secretkey");
    const { password, ...others } = data[0];
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(20)
    .json("User has been logged out");
};

export const getUserInfo = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json("Not Logged in");
  }

  // 使用jwt.verify来验证token并获取userInfo
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid");
    }

    const userId = userInfo.id;
    const q =
      "SELECT `name`, `email`, `profilePic`, `joinedAt`, `isRevoked` FROM login WHERE id = ?";
    db.query(q, [userId], (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json("Internal server error");
      }
      if (data.length === 0) {
        return res.status(404).json("User not found");
      }
      if (data[0].isRevoked) {
        return res.status(403).json("Account is revoked");
      }

      res.status(200).json(data[0]);
    });
  });
};
