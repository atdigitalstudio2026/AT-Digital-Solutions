import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { User, Transaction } from '../types';

// Initialize Firebase App singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Format Firebase Auth User to App User model and sync to Firestore
 */
export async function syncUserProfile(fbUser: FirebaseUser, extraData?: { company?: string }): Promise<User> {
  const userRef = doc(db, 'users', fbUser.uid);
  const userSnap = await getDoc(userRef);

  let appUser: User;

  if (userSnap.exists()) {
    const data = userSnap.data();
    appUser = {
      id: fbUser.uid,
      name: fbUser.displayName || data.name || fbUser.email?.split('@')[0] || 'Pengguna AT',
      email: fbUser.email || data.email || '',
      avatar: fbUser.photoURL || data.avatar,
      joinedDate: data.joinedDate || new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
      company: extraData?.company || data.company || 'Personal / Bisnis'
    };
    // Update last active
    await setDoc(userRef, {
      ...appUser,
      lastLoginAt: new Date().toISOString()
    }, { merge: true });
  } else {
    appUser = {
      id: fbUser.uid,
      name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Pengguna AT',
      email: fbUser.email || '',
      avatar: fbUser.photoURL || undefined,
      joinedDate: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
      company: extraData?.company || 'Personal / Bisnis'
    };
    await setDoc(userRef, {
      ...appUser,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    });
  }

  return appUser;
}

/**
 * Sign In with real Google Account popup
 */
export async function loginWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = await syncUserProfile(result.user);
  return user;
}

/**
 * Sign In with Email and Password
 */
export async function loginWithEmail(email: string, pass: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
  const user = await syncUserProfile(result.user);
  return user;
}

/**
 * Register with Email, Password & Name
 */
export async function registerWithEmail(name: string, email: string, pass: string, company?: string): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  if (name.trim()) {
    await updateProfile(result.user, { displayName: name.trim() });
  }
  const user = await syncUserProfile(result.user, { company });
  return user;
}

/**
 * Reset password via official Firebase email
 */
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Log out from Firebase session
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Save user transaction to Firestore
 */
export async function saveUserTransaction(userId: string, tx: Transaction, purchasedIds: string[]): Promise<void> {
  try {
    const txRef = doc(db, 'users', userId, 'transactions', tx.id);
    await setDoc(txRef, tx);

    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      purchasedProductIds: purchasedIds,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error('Failed to save transaction to Firestore:', err);
  }
}

/**
 * Fetch user transactions from Firestore
 */
export async function fetchUserTransactions(userId: string): Promise<{ transactions: Transaction[], purchasedProductIds: string[] }> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    const purchasedProductIds: string[] = userSnap.exists() && userSnap.data().purchasedProductIds ? userSnap.data().purchasedProductIds : [];

    const txCol = collection(db, 'users', userId, 'transactions');
    const txSnap = await getDocs(txCol);
    const transactions: Transaction[] = [];

    txSnap.forEach(docSnap => {
      transactions.push(docSnap.data() as Transaction);
    });

    return { transactions, purchasedProductIds };
  } catch (err) {
    console.error('Failed to load user transactions:', err);
    return { transactions: [], purchasedProductIds: [] };
  }
}
