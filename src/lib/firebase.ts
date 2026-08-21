import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
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
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { User, Transaction } from '../types';

// Initialize Firebase App singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Format and map friendly error message for Firebase Auth errors
 */
export function getFriendlyErrorMessage(errorCode: string, rawMessage = ''): string {
  const combined = (errorCode + ' ' + rawMessage).toLowerCase();

  if (combined.includes('origin_mismatch') || combined.includes('origin mismatch') || combined.includes('redirect_uri_mismatch')) {
    return 'Origin website belum terdaftar pada Google OAuth Client. Periksa Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client IDs → Authorized JavaScript origins.';
  }

  switch (errorCode) {
    case 'auth/unauthorized-domain':
      return 'Domain website ini belum diizinkan di Firebase Authentication. Periksa Firebase Console → Authentication → Settings → Authorized domains.';
    case 'auth/operation-not-allowed':
      return 'Metode login ini belum diaktifkan. Periksa Firebase Console → Authentication → Sign-in method → Aktifkan Google / Email.';
    case 'auth/popup-closed-by-user':
      return 'Jendela login Google ditutup sebelum proses selesai.';
    case 'auth/popup-blocked':
      return 'Popup login diblokir oleh browser. Harap izinkan popup pada browser Anda.';
    case 'auth/cancelled-popup-request':
      return 'Permintaan login Google dibatalkan karena ada popup lain yang terbuka.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email atau kata sandi yang Anda masukkan salah.';
    case 'auth/email-already-in-use':
      return 'Alamat email ini sudah terdaftar. Silakan masuk menggunakan akun tersebut.';
    case 'auth/weak-password':
      return 'Kata sandi terlalu lemah. Gunakan minimal 8 karakter.';
    case 'auth/invalid-email':
      return 'Format alamat email tidak valid.';
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan gagal. Silakan coba beberapa saat lagi.';
    case 'auth/network-request-failed':
      return 'Koneksi jaringan terputus. Periksa koneksi internet Anda.';
    default:
      return rawMessage || 'Terjadi kesalahan saat autentikasi. Silakan coba lagi.';
  }
}

/**
 * Format Firebase Auth User to App User model and sync to Firestore
 * Dokumen disimpan pada users/{user.uid}
 * Password TIDAK PERNAH disimpan di Firestore.
 */
export async function syncUserProfile(fbUser: FirebaseUser, extraData?: { company?: string }): Promise<User> {
  const userRef = doc(db, 'users', fbUser.uid);
  
  let appUser: User;

  try {
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const existingData = userSnap.data();
      appUser = {
        id: fbUser.uid,
        name: fbUser.displayName || existingData.displayName || existingData.name || (fbUser.email ? fbUser.email.split('@')[0] : 'Pengguna AT'),
        email: fbUser.email || existingData.email || '',
        avatar: fbUser.photoURL || existingData.photoURL || existingData.avatar,
        joinedDate: existingData.joinedDate || new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
        company: extraData?.company || existingData.company || 'Personal / Bisnis'
      };
      
      // Update lastLoginAt dan updatedAt tanpa menimpa role
      await setDoc(userRef, {
        email: fbUser.email || '',
        displayName: appUser.name,
        photoURL: fbUser.photoURL || '',
        company: appUser.company,
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
    } else {
      // Buat dokumen baru dengan schema standar
      appUser = {
        id: fbUser.uid,
        name: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Pengguna AT'),
        email: fbUser.email || '',
        avatar: fbUser.photoURL || undefined,
        joinedDate: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
        company: extraData?.company || 'Personal / Bisnis'
      };

      await setDoc(userRef, {
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName: appUser.name,
        photoURL: fbUser.photoURL || '',
        role: 'user',
        status: 'active',
        company: appUser.company,
        joinedDate: appUser.joinedDate,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      });
    }
  } catch (err) {
    console.warn('Firestore sync warning:', err);
    appUser = {
      id: fbUser.uid,
      name: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Pengguna AT'),
      email: fbUser.email || '',
      avatar: fbUser.photoURL || undefined,
      joinedDate: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
      company: extraData?.company || 'Personal / Bisnis'
    };
  }

  return appUser;
}

/**
 * Sign In with official Firebase GoogleAuthProvider and signInWithPopup
 */
export async function loginWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = await syncUserProfile(result.user);
    return user;
  } catch (fbError: any) {
    console.error('Firebase Google Sign-In error:', fbError);
    throw fbError;
  }
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
  // Send email verification
  try {
    await sendEmailVerification(result.user);
  } catch (verErr) {
    console.warn('Email verification send warning:', verErr);
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
      updatedAt: serverTimestamp()
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
