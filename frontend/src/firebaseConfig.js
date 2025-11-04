import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyBd-XYXkg5XL9-dgqXWR8kKhWD3TLzq5Vo",
//   authDomain: "tea-buddy.firebaseapp.com",
//   projectId: "tea-buddy",
//   storageBucket: "tea-buddy.firebasestorage.app",
//   messagingSenderId: "411392140747",
//   appId: "1:411392140747:web:2e7e8d2166172901d2024e",
//   measurementId: "G-GSE7PPB4M6"
// };
const firebaseConfig = {
  apiKey: "AIzaSyDKS_q3GzZei0NgMm6ZA_w9I8LIQYKhU90",
  authDomain: "tea-buddy-2f0b7.firebaseapp.com",
  projectId: "tea-buddy-2f0b7",
  storageBucket: "tea-buddy-2f0b7.firebasestorage.app",
  messagingSenderId: "159350143339",
  appId: "1:159350143339:web:a501d11c365deabec8342e",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { RecaptchaVerifier, signInWithPhoneNumber };

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBd-XYXkg5XL9-dgqXWR8kKhWD3TLzq5Vo",
//   authDomain: "tea-buddy.firebaseapp.com",
//   projectId: "tea-buddy",
//   storageBucket: "tea-buddy.firebasestorage.app",
//   messagingSenderId: "411392140747",
//   appId: "1:411392140747:web:2e7e8d2166172901d2024e",
//   measurementId: "G-GSE7PPB4M6"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDKS_q3GzZei0NgMm6ZA_w9I8LIQYKhU90",
//   authDomain: "tea-buddy-2f0b7.firebaseapp.com",
//   projectId: "tea-buddy-2f0b7",
//   storageBucket: "tea-buddy-2f0b7.firebasestorage.app",
//   messagingSenderId: "159350143339",
//   appId: "1:159350143339:web:a501d11c365deabec8342e"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
