import express from "express";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import authRoutes from "./routes/auth.js";
import dropRoutes from "./routes/drops.js";
import adminRoutes from "./routes/admins.js";
import revokeRoutes from "./routes/revokes.js";
import cartRoutes from "./routes/carts.js";
import purchaseRoutes from "./routes/purchases.js";
import { upload, uploadProfilePic } from "./multerConfig.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
// import { signData } from "./signatureService.js";
import { getAdminPrivateKey } from "./controller/admin.js";
import cors from "cors";
import forge from "node-forge";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/profilePics", express.static("profilePics"));

app.post(
  "/backend/profilePics",
  uploadProfilePic.single("profilePic"),
  (req, res) => {
    res.send({
      filePath: req.file.path,
    });
  }
);

app.use("/backend/auth", authRoutes);
app.use("/backend/posts", postRoutes);
app.use("/backend/comments", commentRoutes);
app.use("/backend/likes", likeRoutes);
app.use("/backend/drops", dropRoutes);
app.use("/backend/admins", adminRoutes);
app.use("/backend/revokes", revokeRoutes);
app.use("/backend/carts", cartRoutes);
app.use("/backend/purchases", purchaseRoutes);

// app.post("/backend/ca/sign", async (req, res) => {
//   try {
//     const userPublicKey = req.body.publicKey;
//     const adminPrivateKey = await getAdminPrivateKey("xfuhan@outlook.com");
//     const signedPublicKey = signData(userPublicKey, adminPrivateKey);
//     res.json({ signedPublicKey });
//   } catch (error) {
//     console.error("Error during signature process:", error);
//     res.status(500).json({ message: "Failed to sign the public key" });
//   }
// });

app.post("/backend/ca/sign-csr", async (req, res) => {
  try {
    const csrPem = req.body.csr;

    const adminPrivateKeyPem = await getAdminPrivateKey("xfuhan@outlook.com");
    const adminPrivateKey = forge.pki.privateKeyFromPem(adminPrivateKeyPem);

    const csr = forge.pki.certificationRequestFromPem(csrPem);
    if (!csr.verify()) {
      throw new Error("CSR Validation Failed");
    }

    const cert = forge.pki.createCertificate();
    cert.serialNumber = "01";
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(
      cert.validity.notBefore.getFullYear() + 1
    ); // 证书有效期1年
    cert.setSubject(csr.subject.attributes);
    cert.publicKey = csr.publicKey;

    cert.sign(adminPrivateKey, forge.md.sha256.create());

    const signedCertPem = forge.pki.certificateToPem(cert);
    res.json({ certificate: signedCertPem });
  } catch (error) {
    console.error("Error during CSR signature process:", error);
    res.status(500).json({ message: "Failed to sign CSR" });
  }
});

app.listen(8081, () => {
  console.log("listening");
});
