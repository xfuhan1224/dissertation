import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateKeyPair } from "../keyPairService.js";

export const adminRegister = (req, res) => {
  const q = "SELECT * FROM admin WHERE adminname = ?";
  db.query(q, [req.body.name], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) {
      return res.status(409).json("Admin already exists");
    } else {
      const { publicKey, privateKey } = generateKeyPair();

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);
      const q1 =
        "INSERT INTO admin (`adminname`, `adminemail`, `adminpassword`, `publicKey`, `privateKey`) VALUES (?, ?, ?, ?, ?)";
      db.query(
        q1,
        [req.body.name, req.body.email, hashedPassword, publicKey, privateKey],
        (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json("Admin has been created.");
        }
      );
    }
  });
};

export function getAdminPrivateKey(adminEmail) {
  return new Promise((resolve, reject) => {
    const query = "SELECT privateKey FROM admin WHERE adminemail = ?";
    db.query(query, [adminEmail], (err, results) => {
      if (err) {
        reject(err);
      } else if (results.length > 0) {
        resolve(results[0].privateKey);
      } else {
        reject(new Error("Admin not found"));
      }
    });
  });
}

export const adminLogin = (req, res) => {
  const q = "SELECT * FROM admin WHERE adminemail = ?";
  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found");

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].adminpassword
    );
    if (!checkPassword)
      return res.status(400).json("Wrong password or username");

    const token = jwt.sign({ id: data[0].id }, "secretkey");

    const { adminpassword, ...others } = data[0];
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};

export const adminLogout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(20)
    .json("User has been logged out");
};

export const getUsersList = (req, res) => {
  const q = "SELECT `id`, `name`, `email` FROM login";
  db.query(q, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).json("Internal server error");
    }
    res.status(200).json(data);
  });
};
