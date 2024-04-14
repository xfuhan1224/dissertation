import { sendSignedRequest } from "./signedRequestService.js";
// const CA_SIGN_URL = "http://localhost:8081/backend/ca/sign";

// export async function requestCASignature(userPublicKey, privateKey) {
//   try {
//     const data = { publicKey: userPublicKey };
//     const signedResponse = await sendSignedRequest(
//       CA_SIGN_URL,
//       "POST",
//       data,
//       privateKey
//     );

//     if (signedResponse.signedPublicKey) {
//       return signedResponse.signedPublicKey;
//     } else {
//       throw new Error("CA did not return a signed public key");
//     }
//   } catch (error) {
//     console.error("Error requesting CA signature:", error);
//     throw error;
//   }
// }

// 这是处理CSR的新URL，指向您的新路由
const CA_CSR_SIGN_URL = "http://localhost:8081/backend/ca/sign-csr";

export async function requestCASignatureWithCSR(csrPem, privateKey) {
  try {
    // 将CSR作为请求数据
    const data = { csr: csrPem };
    // 使用sendSignedRequest发送CSR。根据您的实际情况调整这个函数的实现，
    // 确保它可以发送CSR并接收签名证书。
    const signedCertificateResponse = await sendSignedRequest(
      CA_CSR_SIGN_URL,
      "POST",
      data,
      privateKey // 注意，这里使用管理员的私钥进行签名，确保请求的安全性
    );

    // 根据您的server.js中的逻辑，返回的应该是一个包含签名证书的对象
    if (signedCertificateResponse.certificate) {
      return signedCertificateResponse.certificate;
    } else {
      throw new Error("CA did not return a signed certificate");
    }
  } catch (error) {
    console.error("Error requesting CA signature with CSR:", error);
    throw error;
  }
}
