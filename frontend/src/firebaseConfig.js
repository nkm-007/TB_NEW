import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBd-XYXkg5XL9-dgqXWR8kKhWD3TLzq5Vo",
  authDomain: "tea-buddy.firebaseapp.com",
  projectId: "tea-buddy",
  storageBucket: "tea-buddy.firebasestorage.app",
  messagingSenderId: "411392140747",
  appId: "1:411392140747:web:2e7e8d2166172901d2024e",
  measurementId: "G-GSE7PPB4M6"
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