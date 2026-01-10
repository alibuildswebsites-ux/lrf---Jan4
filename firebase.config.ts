import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

// Validation check for production readiness
const missingVars = requiredEnvVars.filter(key => !import.meta.env[key]);

let app: FirebaseApp | undefined;
let auth: Auth;
let db: Firestore;
let googleProvider: GoogleAuthProvider;

if (missingVars.length > 0) {
  // CRITICAL: Prevent app crash by NOT initializing Firebase if config is missing.
  // This shifts the failure from a Module Evaluation Error (White Screen) to a 
  // Runtime Error (caught by GlobalErrorBoundary).
  console.error(
    `CRITICAL CONFIGURATION ERROR: Missing required Firebase environment variables: ${missingVars.join(', ')}. ` +
    `The application cannot connect to the database. Please configure environment variables in your deployment settings (e.g., Vercel).`
  );
  
  // Export null/mock values cast to expected types to satisfy TypeScript
  // while ensuring the app bundle loads successfully.
  app = undefined;
  auth = null as unknown as Auth;
  db = null as unknown as Firestore;
  googleProvider = null as unknown as GoogleAuthProvider;
} else {
  try {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
    };

    // Initialize Firebase
    app = initializeApp(firebaseConfig);

    // Initialize services
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();

    // Add provider settings for better UX
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    // Fallback to prevent crash if init fails despite vars being present
    auth = null as unknown as Auth;
    db = null as unknown as Firestore;
    googleProvider = null as unknown as GoogleAuthProvider;
  }
}

export { auth, db, googleProvider };
export default app;