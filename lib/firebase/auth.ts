import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../../firebase.config';

// Helper for typed errors
const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};

// Check if a user is an admin
export const checkIsAdmin = async (email: string | null): Promise<boolean> => {
  if (!auth || !auth.currentUser || !email || !db) return false;
  try {
    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      return data.role === 'admin';
    }
    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string, name: string) => {
  if (!auth || !db) return { success: false, error: "Authentication service not initialized. Please check configuration." };
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with name
    await updateProfile(user, { displayName: name });
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: name,
      email: email,
      role: 'user', // Default role
      savedProperties: [],
      createdAt: new Date().toISOString()
    });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  if (!auth) return { success: false, error: "Authentication service not initialized." };
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  if (!auth || !db || !googleProvider) return { success: false, error: "Authentication service not initialized." };
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user document exists
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    // If new user, create document
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: user.displayName || 'User',
        email: user.email,
        role: 'user', // Default role
        savedProperties: [],
        createdAt: new Date().toISOString()
      });
    }
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};

// Sign out
export const logOut = async () => {
  if (!auth) return { success: false, error: "Not initialized" };
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};

// Send password reset email
export const resetPassword = async (email: string) => {
  if (!auth) return { success: false, error: "Not initialized" };
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};

// Update user profile name
export const updateUserName = async (user: User, newName: string) => {
  if (!db) return { success: false, error: "Database not connected" };
  try {
    await updateProfile(user, { displayName: newName });
    await setDoc(doc(db, 'users', user.uid), { name: newName }, { merge: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};

// Update user password
export const updateUserPassword = async (user: User, newPassword: string) => {
  try {
    await updatePassword(user, newPassword);
    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};