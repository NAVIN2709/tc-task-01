// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD22mwfvP_53AMz1TPZdrykV7iIvkt9Ztc",
  authDomain: "lostaf-9ae65.firebaseapp.com",
  projectId: "lostaf-9ae65",
  storageBucket: "lostaf-9ae65.firebasestorage.app",
  messagingSenderId: "149505286043",
  appId: "1:149505286043:web:1f2bbcc55bbc1d7a1d4b3e",
  measurementId: "G-VHD2L8Z13R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);
export { db, auth };