import { db } from "../connect.js";

export const revokeCertificate = (req, res) => {
  console.log(req.body);
  const { userId } = req.body;
  console.log(`Revoking certificate for user ID: ${userId}`);

  const query = "SELECT certificate FROM login WHERE id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(`Error querying the database for user ID: ${userId}`, err);
      return res.status(500).json({
        message: "Error accessing the database.",
      });
    }

    if (results.length === 0) {
      console.log(`User or certificate not found for user ID: ${userId}`);
      return res
        .status(404)
        .json({ message: "User or certificate not found." });
    }

    const certificateSerial = results[0].certificate;
    console.log(
      `Found certificate serial: ${certificateSerial} for user ID: ${userId}`
    );

    const revocationDate = new Date();
    const insertQuery =
      "INSERT INTO RevocationList (userId, certificateSerial, revocationDate) VALUES (?, ?, ?)";
    db.query(
      insertQuery,
      [userId, certificateSerial, revocationDate],
      (err, result) => {
        if (err) {
          console.error(
            `Error inserting into RevocationList for user ID: ${userId}`,
            err
          );
          return res.status(500).json({
            message: "Failed to update the revocation list.",
          });
        }
        console.log(`Certificate successfully revoked for user ID: ${userId}`);
        res.json({ message: "Certificate successfully revoked" });
      }
    );
  });
};
