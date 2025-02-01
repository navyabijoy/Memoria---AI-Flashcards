// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'; 

const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: "new-memoria.firebaseapp.com",
  projectId: "new-memoria",
  storageBucket: "new-memoria.firebasestorage.app",
  messagingSenderId: "744763281305",
  appId: "1:744763281305:web:85322243bd0968ef850d08",
  measurementId: "G-60W2TB1TZD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);



export {db};
