import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBS5KeW_ozPtI3JiVICFtoDAZC49VZExHk",
  authDomain: "gas-shop-1cf72.firebaseapp.com",
  projectId: "gas-shop-1cf72",
  storageBucket: "gas-shop-1cf72.firebasestorage.app",
  messagingSenderId: "197240030937",
  appId: "1:197240030937:web:80fae47a6fdc73fb7ba0c8"
};

export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore 
export const db = getFirestore(app);

// Note: I temporarily turned OFF the offline database feature. 
// When testing on the SAME computer in two different tabs, the offline storage "locks" 
// to the first tab, pretending the second tab is offline. 
