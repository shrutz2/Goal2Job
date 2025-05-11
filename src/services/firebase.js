
// src/services/firebase.js - FIXED
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtPjrIO2GsOjJ5zEJy1GB9IzEX4AEqe3Q",
  authDomain: "jobapp-1c7b2.firebaseapp.com",
  projectId: "jobapp-1c7b2",
  storageBucket: "jobapp-1c7b2.appspot.com",
  messagingSenderId: "967322045908",
  appId: "1:967322045908:web:ac1b27088e5edc784b1a41",
  measurementId: "G-78HVMW76B4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };