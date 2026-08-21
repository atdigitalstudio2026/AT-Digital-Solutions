import { 
  auth, 
  db 
} from "./firebase-config.js";
import { 
  logout, 
  requireAuth 
} from "./auth.js";
import { 
  doc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// DOM Elements
const userNameElement = document.getElementById('userName');
const userEmailElement = document.getElementById('userEmail');
const userRoleElement = document.getElementById('userRole');
const userStatusElement = document.getElementById('userStatus');
const userUidElement = document.getElementById('userUid');
const userAvatarElement = document.getElementById('userAvatar');
const navUserName = document.getElementById('navUserName');
const verifiedBadge = document.getElementById('verifiedBadge');
const logoutBtn = document.getElementById('logoutBtn');
const returnToAppBtn = document.getElementById('returnToAppBtn');

// Proteksi Halaman Dashboard dengan onAuthStateChanged
requireAuth(async (user) => {
  // Update info dasar dari Firebase Auth
  const displayName = user.displayName || user.email?.split('@')[0] || 'Pengguna';
  const email = user.email || '-';
  
  if (navUserName) navUserName.textContent = displayName;
  if (userNameElement) userNameElement.textContent = displayName;
  if (userEmailElement) userEmailElement.textContent = email;
  if (userUidElement) userUidElement.textContent = user.uid;

  if (userAvatarElement) {
    if (user.photoURL) {
      userAvatarElement.src = user.photoURL;
      userAvatarElement.style.display = 'block';
    } else {
      userAvatarElement.textContent = displayName.charAt(0).toUpperCase();
    }
  }

  if (verifiedBadge) {
    if (user.emailVerified) {
      verifiedBadge.className = 'badge-verified';
      verifiedBadge.textContent = '✓ Terverifikasi';
    } else {
      verifiedBadge.className = 'badge-unverified';
      verifiedBadge.textContent = '⚠ Belum Verifikasi';
    }
  }

  // Ambil profil data lengkap dari Firestore collection `users/{uid}`
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const profile = userDocSnap.data();
      if (userRoleElement) userRoleElement.textContent = profile.role || 'user';
      if (userStatusElement) userStatusElement.textContent = profile.status || 'active';
    }
  } catch (err) {
    console.warn('Gagal memuat profil Firestore:', err);
  }
}, true); // requireVerification = true

// Handle Logout
if (logoutBtn) {
  logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await logout();
      window.location.href = 'login.html';
    } catch (err) {
      console.error('Logout error:', err);
      window.location.href = 'login.html';
    }
  });
}

// Return to Main App
if (returnToAppBtn) {
  returnToAppBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'index.html';
  });
}
