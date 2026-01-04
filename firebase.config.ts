import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCnATA8Aoz9a9jA2GNPWpcfcagt0clzu3Q",
  authDomain: "lofton-9c7f1.firebaseapp.com",
  projectId: "lofton-9c7f1",
  storageBucket: "lofton-9c7f1.firebasestorage.app",
  messagingSenderId: "886711502160",
  appId: "1:886711502160:web:b94884445d5da2bf745855",
  measurementId: "G-1WWEW8LKR1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;