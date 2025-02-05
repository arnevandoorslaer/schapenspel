import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot, collection, deleteDoc } from 'firebase/firestore';


// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBZDFFt8ZGUPndRyxB2HkADYX-DWEpoXAk',
  authDomain: 'schapenspel-a59fb.firebaseapp.com',
  projectId: 'schapenspel-a59fb',
  storageBucket: 'schapenspel-a59fb.firebasestorage.app',
  messagingSenderId: '621458268820',
  appId: '1:621458268820:web:04aabe121ef4ec1ef70a81',
  name: 'schapenspel',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();

// Get Firestore instance
const db = getFirestore(app);

export { db, auth, GoogleAuthProvider, doc, getDoc, setDoc, updateDoc, onSnapshot, collection, getAuth, signInWithPopup, onAuthStateChanged, signOut, getFirestore, deleteDoc };