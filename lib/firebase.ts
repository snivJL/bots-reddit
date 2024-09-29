// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCP3A2iw58F1ca8lx2JyvBzs4vmxkOuIwg",
  authDomain: "reddit-ai-f6f7d.firebaseapp.com",
  projectId: "reddit-ai-f6f7d",
  storageBucket: "reddit-ai-f6f7d.appspot.com",
  messagingSenderId: "193628874535",
  appId: "1:193628874535:web:2705962b76817c800feb02",
  measurementId: "G-DWQJH47XK6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
