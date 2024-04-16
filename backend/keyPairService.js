import crypto from "crypto";
import forge from "node-forge";

export function generateKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  return { publicKey, privateKey };
}

export function generateCSR(publicKeyPem, privateKeyPem, subjectAttributes) {
  const csr = forge.pki.createCertificationRequest(); 
  csr.publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  csr.setSubject(subjectAttributes);

  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  csr.sign(privateKey, forge.md.sha256.create());

  return forge.pki.certificationRequestToPem(csr);
}
