import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBy0Vmlwp8WsnT0aMGVVgLPqzRg43EIoyo",
  authDomain: "mychat-3cb59.firebaseapp.com",
  projectId: "mychat-3cb59",
  storageBucket: "mychat-3cb59.firebasestorage.app",
  messagingSenderId: "550468090346",
  appId: "1:550468090346:web:00c2337ed604fba88bda93",
  measurementId: "G-CW71LLBJ0X"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile };