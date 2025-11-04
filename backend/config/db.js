import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;

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
