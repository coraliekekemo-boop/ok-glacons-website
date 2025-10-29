import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAC9kURND6qSj4Ny6jrcUJROSvQ1rU-Qao",
  authDomain: "ok-glacons-website.firebaseapp.com",
  projectId: "ok-glacons-website",
  storageBucket: "ok-glacons-website.firebasestorage.app",
  messagingSenderId: "575203589809",
  appId: "1:575203589809:web:82f9ef950df1a870656c90"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

