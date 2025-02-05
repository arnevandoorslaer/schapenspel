import { GoogleAuthProvider, deleteDoc, doc, getAuth, getFirestore, onAuthStateChanged, setDoc, signInWithPopup, signOut } from "../firebase";

// Set up Google Auth provider
const provider = new GoogleAuthProvider();
const auth = getAuth();

// Handle Google login
const db = getFirestore(); // Initialize Firestore

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log(user)
    // Save user data to Firebase (in the 'users' collection)
    const userRef = doc(db, 'users', user.uid); 
    await setDoc(userRef, {
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      uid: user.uid,
    });

    return user;
  } catch (error) {
    console.error('Error during Google sign-in', error);
    throw new Error('Login failed');
  }
};

// Check if a user is logged in (subscribe to auth state changes)
export const observeAuthState = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Log out the current user
export const signOutUser = async () => {
  try {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await signOut(auth);
    await deleteDoc(userRef);
  
  
  } catch (error) {
    console.error('Error during sign-out:', error);
  }
};

export const getCurrentUser = (): any => {
  return auth.currentUser;
};