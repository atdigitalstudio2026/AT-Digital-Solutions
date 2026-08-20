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

declare global {
  interface Window {
    google?: any;
  }
}

/**
 * Sign In using Google Identity Services (GIS)
 * Direct Google OAuth popup that verifies the user's Google account and syncs to Firestore
 */
export async function loginWithGoogleGIS(): Promise<User> {
  return new Promise((resolve, reject) => {
    const attemptGIS = (retries = 3) => {
      if (typeof window !== 'undefined' && window.google?.accounts?.oauth2) {
        try {
          const client = window.google.accounts.oauth2.initTokenClient({
            client_id: firebaseConfig.oAuthClientId,
            scope: 'email profile openid',
            prompt: 'select_account',
            callback: async (tokenResponse: any) => {
              if (tokenResponse.error) {
                if (tokenResponse.error === 'access_denied') {
                  reject(new Error('Akses login Google dibatalkan oleh pengguna.'));
                } else {
                  reject(new Error(tokenResponse.error_description || tokenResponse.error));
                }
                return;
              }
              if (!tokenResponse.access_token) {
                reject(new Error('Tidak menerima token otentikasi dari Google.'));
                return;
              }

              try {
                // Fetch verified profile from official Google OAuth UserInfo endpoint
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`
                  }
                });

                if (!res.ok) {
                  throw new Error('Gagal mengambil data profil Google.');
                }

                const gProfile = await res.json();
                const uid = `google_${gProfile.sub}`;

                // Sync with Firestore database
                const userRef = doc(db, 'users', uid);
                let appUser: User;

                try {
                  const userSnap = await getDoc(userRef);
                  if (userSnap.exists()) {
                    const data = userSnap.data();
                    appUser = {
                      id: uid,
                      name: gProfile.name || data.name || 'Pengguna Google',
                      email: gProfile.email || data.email || '',
                      avatar: gProfile.picture || data.avatar,
                      joinedDate: data.joinedDate || new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
                      company: data.company || 'Personal / Bisnis'
                    };
                    await setDoc(userRef, {
                      ...appUser,
                      lastLoginAt: new Date().toISOString()
                    }, { merge: true });
                  } else {
                    appUser = {
                      id: uid,
                      name: gProfile.name || 'Pengguna Google',
                      email: gProfile.email || '',
                      avatar: gProfile.picture || undefined,
                      joinedDate: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
                      company: 'Personal / Bisnis'
                    };
                    await setDoc(userRef, {
                      ...appUser,
                      createdAt: new Date().toISOString(),
                      lastLoginAt: new Date().toISOString()
                    });
                  }
                } catch (dbErr) {
                  console.warn('Firestore sync warning (falling back to client state):', dbErr);
                  appUser = {
                    id: uid,
                    name: gProfile.name || 'Pengguna Google',
                    email: gProfile.email || '',
                    avatar: gProfile.picture || undefined,
                    joinedDate: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
                    company: 'Personal / Bisnis'
                  };
                }

                // Persist session
                localStorage.setItem('at_digital_user', JSON.stringify(appUser));
                resolve(appUser);
              } catch (err: any) {
                reject(err);
              }
            }
          });

          client.requestAccessToken();
        } catch (err) {
          reject(err);
        }
      } else if (retries > 0) {
        setTimeout(() => attemptGIS(retries - 1), 600);
      } else {
        reject(new Error('Google Identity Services belum siap. Silakan coba kembali atau gunakan Email & Kata Sandi.'));
      }
    };

    attemptGIS();
  });
}

/**
 * Sign In with real Google Account
 */
export async function loginWithGoogle(): Promise<User> {
  // First attempt Google Identity Services (GIS)
  try {
    return await loginWithGoogleGIS();
  } catch (gisError: any) {
    console.warn('GIS login failed, trying Firebase popup fallback:', gisError);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = await syncUserProfile(result.user);
      return user;
    } catch (fbError: any) {
      console.error('Firebase Auth popup error:', fbError);
      if (fbError.code === 'auth/unauthorized-domain') {
        throw new Error('Domain ini belum diotorisasi di Firebase Auth Console. Silakan login langsung menggunakan Email & Kata Sandi di bawah ini.');
      }
      throw fbError;
    }
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
