// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'; 

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "memoria-flashcards.firebaseapp.com",
  projectId: "memoria-flashcards",
  storageBucket: "memoria-flashcards.appspot.com",
  messagingSenderId: "267446881259",
  appId: "1:267446881259:web:4c28cfa7d58574c76d67ae",
  measurementId: "G-2YVSL2KTV9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);



export {db};
