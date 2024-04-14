import crypto from "crypto";

export function signData(data, privateKey) {
  const signer = crypto.createSign("SHA256");
  signer.update(data);
  signer.end();
  const signature = signer.sign(privateKey, "base64");
  return signature;
}

export function verifySignature(data, publicKey, signature) {
  const verifier = crypto.createVerify("SHA256");
  verifier.update(data);
  verifier.end();
  return verifier.verify(publicKey, signature, "base64");
}
