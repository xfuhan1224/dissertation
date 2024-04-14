import { signData } from "./signatureService.js";

export async function sendSignedRequest(url, method, data, privateKey) {
  const dataString = JSON.stringify(data);
  const signature = signData(dataString, privateKey);

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Signature: signature,
      },
      body: dataString,
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error sending signed request:", error);
    throw error;
  }
}
