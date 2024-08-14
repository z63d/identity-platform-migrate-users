import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

dotenv.config();

const apiKey = process.env.API_KEY || "";
const authDomain = process.env.AUTH_DOMAIN || "";
const userEmail = process.env.EMAIL_ID || "";
const userPassword = process.env.PASSWORD || "";

console.log("apiKey, authDomain, userEmail, userPassword");
console.log(apiKey, authDomain, userEmail, userPassword);

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app, {});

async function signIn(userEmail, userPassword) {
  const email = userEmail;
  const password = userPassword;
  await signInWithEmailAndPassword(auth, email, password)
    .then((res) => console.log(res))
    .catch((error) => console.error(error.code));
}

signIn(userEmail, userPassword);
