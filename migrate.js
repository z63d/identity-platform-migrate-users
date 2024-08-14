import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

const algorithm = process.env.ALGORITHM || "";
const base64SignerKey = process.env.BASE64_SIGNER_KEY || "";
const base64SaltSeparator = process.env.BASE64_SALT_SEPARATOR || "";
const rounds = process.env.ROUNDS || "";
const memCost = process.env.MEM_COST || "";

const sourceApp = admin.initializeApp(
  {
    credential: admin.credential.cert("source-project-service-account.json"),
  },
  "source-app",
);

const targetApp = admin.initializeApp(
  {
    credential: admin.credential.cert("target-project-service-account.json"),
  },
  "target-app",
);

const authFrom = sourceApp.auth();
const authTo = targetApp.auth();

function migrateUsers(userImportOptions, nextPageToken) {
  let pageToken;
  authFrom
    .listUsers(1000, nextPageToken)
    .then((listUsersResult) => {
      const users = [];
      // biome-ignore lint/complexity/noForEach: <explanation>
      listUsersResult.users.forEach((user) => {
        const modifiedUser = user.toJSON();
        // Convert to bytes.
        if (user.passwordHash) {
          // modifiedUser.passwordHash = Buffer.from(user.passwordHash, "base64");
          // modifiedUser.passwordSalt = Buffer.from(user.passwordSalt, "base64");
          modifiedUser.passwordHash = Buffer.from(user.passwordHash, "base64");
          modifiedUser.passwordSalt = Buffer.from(user.passwordSalt, "base64");
        }
        // Delete tenant ID if available. This will be set automatically.
        // biome-ignore lint/performance/noDelete: <explanation>
        delete modifiedUser.tenantId;
        users.push(modifiedUser);
      });
      // Save next page token.
      pageToken = listUsersResult.pageToken;
      // Upload current chunk.
      return authTo.importUsers(users, userImportOptions);
    })
    .then((results) => {
      // biome-ignore lint/complexity/noForEach: <explanation>
      results.errors.forEach((indexedError) => {
        console.log(`Error importing user ${indexedError.index}`);
      });
      // Continue if there is another page.
      if (pageToken) {
        migrateUsers(userImportOptions, pageToken);
      }
    })
    .catch((error) => {
      console.log("Error importing users:", error);
    });
}
const userImportOptions = {
  hash: {
    algorithm: algorithm,
    // The following parameters can be obtained from the "Users" page in the
    // Cloud console. The key must be a byte buffer.
    key: Buffer.from(base64SignerKey, "base64"),
    saltSeparator: Buffer.from(base64SaltSeparator, "base64"),
    rounds: rounds,
    memoryCost: memCost,
  },
};

migrateUsers(userImportOptions);
