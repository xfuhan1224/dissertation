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

const CA_CSR_SIGN_URL = "http://localhost:8081/backend/ca/sign-csr";

export async function requestCASignatureWithCSR(csrPem, privateKey) {
  try {
    const data = { csr: csrPem };
    const signedCertificateResponse = await sendSignedRequest(
      CA_CSR_SIGN_URL,
      "POST",
      data,
      privateKey 
    );

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
