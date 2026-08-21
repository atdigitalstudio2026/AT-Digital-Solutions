import { 
  auth 
} from "./firebase-config.js";
import { 
  resendVerificationEmail, 
  logout, 
  getFriendlyErrorMessage 
} from "./auth.js";
import { 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// DOM Elements
const userEmailText = document.getElementById('userEmailText');
const resendBtn = document.getElementById('resendBtn');
const checkVerifiedBtn = document.getElementById('checkVerifiedBtn');
const logoutBtn = document.getElementById('logoutBtn');
const alertError = document.getElementById('alertError');
const alertSuccess = document.getElementById('alertSuccess');

function showError(msg) {
  alertSuccess.classList.remove('show');
  alertError.textContent = msg;
  alertError.classList.add('show');
}

function showSuccess(msg) {
  alertError.classList.remove('show');
  alertSuccess.textContent = msg;
  alertSuccess.classList.add('show');
}

function clearAlerts() {
  alertError.classList.remove('show');
  alertSuccess.classList.remove('show');
}

// Cek Auth State
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  // Jika sudah terverifikasi -> langsung redirect ke dashboard
  if (user.emailVerified) {
    window.location.href = 'dashboard.html';
    return;
  }

  if (userEmailText) {
    userEmailText.textContent = user.email || 'Email Anda';
  }
});

// Kirim Ulang Email Verifikasi
if (resendBtn) {
  resendBtn.addEventListener('click', async () => {
    clearAlerts();
    resendBtn.classList.add('loading');
    resendBtn.disabled = true;

    try {
      await resendVerificationEmail();
      showSuccess('Tautan verifikasi baru telah dikirimkan ke email Anda.');
    } catch (error) {
      console.error('Resend verification error:', error);
      const friendlyMsg = getFriendlyErrorMessage(error.code) || error.message;
      showError(friendlyMsg);
    } finally {
      resendBtn.classList.remove('loading');
      // Cooldown timer sebelum boleh kirim ulang
      setTimeout(() => {
        resendBtn.disabled = false;
      }, 5000);
    }
  });
}

// Cek Apakah Sudah Verifikasi
if (checkVerifiedBtn) {
  checkVerifiedBtn.addEventListener('click', async () => {
    clearAlerts();
    checkVerifiedBtn.classList.add('loading');
    checkVerifiedBtn.disabled = true;

    try {
      if (!auth.currentUser) {
        window.location.href = 'login.html';
        return;
      }

      // Reload data user dari Firebase Auth server
      await auth.currentUser.reload();
      const updatedUser = auth.currentUser;

      if (updatedUser.emailVerified) {
        showSuccess('Email berhasil diverifikasi! Mengalihkan ke dashboard...');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 800);
      } else {
        showError('Email Anda belum diverifikasi. Silakan periksa inbox / spam email Anda dan klik link verifikasi.');
        checkVerifiedBtn.classList.remove('loading');
        checkVerifiedBtn.disabled = false;
      }
    } catch (error) {
      console.error('Check verification error:', error);
      showError('Gagal memeriksa status verifikasi: ' + error.message);
      checkVerifiedBtn.classList.remove('loading');
      checkVerifiedBtn.disabled = false;
    }
  });
}

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    await logout();
    window.location.href = 'login.html';
  });
}
