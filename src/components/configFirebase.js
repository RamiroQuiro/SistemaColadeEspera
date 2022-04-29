// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrcujz0dMUDxPAjQ3tVw9xanYLSHcnJ8g",
  authDomain: "sistema01-66d78.firebaseapp.com",
  projectId: "sistema01-66d78",
  storageBucket: "sistema01-66d78.appspot.com",
  messagingSenderId: "833151200811",
  appId: "1:833151200811:web:8a6bbc3c3a07ed75db046e",
  measurementId: "G-D4L43KRFM1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);