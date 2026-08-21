import { 
  auth, 
  db 
} from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Google Auth Provider Setup
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Terjemahkan error code Firebase Authentication ke pesan bahasa Indonesia yang mudah dipahami
 */
export function getFriendlyErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email atau kata sandi yang Anda masukkan salah.';
    case 'auth/email-already-in-use':
      return 'Alamat email ini sudah terdaftar. Silakan masuk.';
    case 'auth/weak-password':
      return 'Kata sandi terlalu lemah. Gunakan minimal 8 karakter dengan kombinasi huruf dan angka.';
    case 'auth/invalid-email':
      return 'Format alamat email tidak valid.';
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan gagal. Akses ditangguhkan sementara demi keamanan. Silakan coba lagi nanti.';
    case 'auth/user-disabled':
      return 'Akun ini telah dinonaktifkan oleh administrator.';
    case 'auth/popup-closed-by-user':
      return 'Jendela login Google ditutup sebelum proses selesai.';
    case 'auth/popup-blocked':
      return 'Popup login diblokir oleh browser. Izinkan popup untuk melanjutkan.';
    case 'auth/network-request-failed':
      return 'Koneksi jaringan terputus. Periksa koneksi internet Anda.';
    case 'auth/unauthorized-domain':
      return 'Domain aplikasi ini belum diotorisasi di Firebase Console (Authentication > Settings > Authorized domains).';
    case 'auth/requires-recent-login':
      return 'Operasi ini memerlukan login ulang untuk verifikasi keamanan.';
    default:
      return 'Terjadi kesalahan sistem. Silakan coba lagi nanti.';
  }
}

/**
 * Simpan / Sinkronkan profil user di Firestore (Collection: users/{uid})
 * JANGAN menyimpan password ke Firestore.
 */
export async function syncUserToFirestore(user, additionalData = {}) {
  if (!user || !user.uid) return null;
  const userRef = doc(db, 'users', user.uid);

  try {
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      // Update lastLoginAt dan field non-kritis
      await setDoc(userRef, {
        displayName: user.displayName || userSnap.data().displayName || additionalData.displayName || user.email?.split('@')[0],
        email: user.email,
        photoURL: user.photoURL || userSnap.data().photoURL || null,
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      return { id: user.uid, ...userSnap.data(), email: user.email, displayName: user.displayName || userSnap.data().displayName };
    } else {
      // Buat dokumen pengguna baru
      const newUserProfile = {
        uid: user.uid,
        displayName: user.displayName || additionalData.displayName || user.email?.split('@')[0] || 'Pengguna Baru',
        email: user.email,
        photoURL: user.photoURL || null,
        role: "user",
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      };
      await setDoc(userRef, newUserProfile);
      return { id: user.uid, ...newUserProfile };
    }
  } catch (err) {
    console.error('Gagal menyinkronkan data profil ke Firestore:', err);
    return {
      uid: user.uid,
      displayName: user.displayName || user.email?.split('@')[0],
      email: user.email
    };
  }
}

/**
 * Register user baru dengan Email dan Password
 */
export async function registerWithEmail(fullName, email, password) {
  // Validasi input
  if (!fullName || fullName.trim().length === 0) {
    throw new Error('Nama lengkap wajib diisi.');
  }
  if (!email || !email.includes('@')) {
    throw new Error('Alamat email tidak valid.');
  }
  if (!password || password.length < 8) {
    throw new Error('Kata sandi minimal 8 karakter.');
  }

  // Buat akun di Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const user = userCredential.user;

  // Update Display Name di Firebase Auth Profile
  await updateProfile(user, {
    displayName: fullName.trim()
  });

  // Kirim email verifikasi
  await sendEmailVerification(user);

  // Simpan profil awal ke Firestore users/{uid}
  await syncUserToFirestore(user, { displayName: fullName.trim() });

  return user;
}

/**
 * Login dengan Email dan Password
 */
export async function loginWithEmail(email, password, rememberMe = true) {
  if (!email || !password) {
    throw new Error('Email dan kata sandi wajib diisi.');
  }

  // Atur Session Persistence
  const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
  await setPersistence(auth, persistence);

  // Otentikasi dengan Firebase Auth
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  const user = userCredential.user;

  // Sinkronkan ke Firestore
  await syncUserToFirestore(user);

  return user;
}

/**
 * Login / Register dengan Google OAuth
 */
export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  await syncUserToFirestore(user);
  return user;
}

/**
 * Kirim email verifikasi ke pengguna saat ini
 */
export async function resendVerificationEmail() {
  if (!auth.currentUser) {
    throw new Error('Tidak ada pengguna yang sedang aktif.');
  }
  await sendEmailVerification(auth.currentUser);
}

/**
 * Kirim tautan reset kata sandi
 */
export async function sendPasswordReset(email) {
  if (!email || !email.includes('@')) {
    throw new Error('Masukkan alamat email yang valid.');
  }
  await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Keluar / Sign Out dari Firebase Session
 */
export async function logout() {
  await signOut(auth);
}

/**
 * Proteksi Halaman (Auth Guard)
 * Callback dipanggil ketika user sudah terautentikasi dan terverifikasi
 */
export function requireAuth(onAuthenticated, requireVerification = false) {
  return onAuthStateChanged(auth, (user) => {
    if (!user) {
      // Belum login -> redirect ke login.html
      window.location.href = 'login.html';
      return;
    }

    if (requireVerification && !user.emailVerified) {
      // Email belum diverifikasi -> redirect ke verify-email.html
      window.location.href = 'verify-email.html';
      return;
    }

    if (typeof onAuthenticated === 'function') {
      onAuthenticated(user);
    }
  });
}

/**
 * Redirect jika user sudah login (misal di halaman login / register)
 */
export function redirectIfAuthenticated(destination = 'dashboard.html') {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      if (user.emailVerified) {
        window.location.href = destination;
      } else {
        window.location.href = 'verify-email.html';
      }
    }
  });
}
