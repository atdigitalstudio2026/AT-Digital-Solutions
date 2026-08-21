import { 
  loginWithEmail, 
  loginWithGoogle, 
  getFriendlyErrorMessage, 
  redirectIfAuthenticated 
} from "./auth.js";

// Redirect jika sudah login
redirectIfAuthenticated('dashboard.html');

// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberMeCheckbox = document.getElementById('rememberMe');
const submitBtn = document.getElementById('submitBtn');
const googleBtn = document.getElementById('googleBtn');
const togglePasswordBtn = document.getElementById('togglePassword');
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

function setLoading(isLoading) {
  if (isLoading) {
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    googleBtn.disabled = true;
    emailInput.disabled = true;
    passwordInput.disabled = true;
  } else {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    googleBtn.disabled = false;
    emailInput.disabled = false;
    passwordInput.disabled = false;
  }
}

// Toggle Password Visibility
if (togglePasswordBtn) {
  togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Sembunyikan password' : 'Lihat password');
    togglePasswordBtn.innerHTML = isPassword 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  });
}

// Handle Form Submit
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAlerts();

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const rememberMe = rememberMeCheckbox ? rememberMeCheckbox.checked : true;

  if (!email || !password) {
    showError('Mohon isi email dan kata sandi Anda.');
    return;
  }

  setLoading(true);

  try {
    const user = await loginWithEmail(email, password, rememberMe);
    showSuccess('Berhasil masuk! Mengalihkan ke dashboard...');
    
    setTimeout(() => {
      if (user.emailVerified) {
        window.location.href = 'dashboard.html';
      } else {
        window.location.href = 'verify-email.html';
      }
    }, 600);
  } catch (error) {
    console.error('Login error:', error);
    const friendlyMsg = getFriendlyErrorMessage(error.code || '', error.message || '');
    showError(friendlyMsg);
    setLoading(false);
  }
});

// Handle Google Sign In
googleBtn.addEventListener('click', async () => {
  clearAlerts();
  setLoading(true);

  try {
    const user = await loginWithGoogle();
    showSuccess('Login Google berhasil! Mengalihkan...');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 600);
  } catch (error) {
    console.error('Google login error:', error);
    const friendlyMsg = getFriendlyErrorMessage(error.code || '', error.message || '');
    showError(friendlyMsg);
    setLoading(false);
  }
});
