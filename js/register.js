import { 
  registerWithEmail, 
  loginWithGoogle, 
  getFriendlyErrorMessage, 
  redirectIfAuthenticated 
} from "./auth.js";

// Redirect jika sudah login
redirectIfAuthenticated('dashboard.html');

// DOM Elements
const registerForm = document.getElementById('registerForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const submitBtn = document.getElementById('submitBtn');
const googleBtn = document.getElementById('googleBtn');
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
    if (googleBtn) googleBtn.disabled = true;
    nameInput.disabled = true;
    emailInput.disabled = true;
    passwordInput.disabled = true;
    confirmPasswordInput.disabled = true;
  } else {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    if (googleBtn) googleBtn.disabled = false;
    nameInput.disabled = false;
    emailInput.disabled = false;
    passwordInput.disabled = false;
    confirmPasswordInput.disabled = false;
  }
}

// Handle Form Submit
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAlerts();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  // Validasi Input
  if (!name) {
    showError('Nama lengkap wajib diisi.');
    return;
  }
  if (!email || !email.includes('@')) {
    showError('Masukkan alamat email yang valid.');
    return;
  }
  if (!password || password.length < 8) {
    showError('Kata sandi minimal harus 8 karakter.');
    return;
  }
  if (password !== confirmPassword) {
    showError('Konfirmasi kata sandi tidak cocok.');
    return;
  }

  setLoading(true);

  try {
    await registerWithEmail(name, email, password);
    showSuccess('Pendaftaran akun berhasil! Tautan verifikasi telah dikirim.');
    
    setTimeout(() => {
      window.location.href = 'verify-email.html';
    }, 800);
  } catch (error) {
    console.error('Register error:', error);
    const friendlyMsg = getFriendlyErrorMessage(error.code) || error.message;
    showError(friendlyMsg);
    setLoading(false);
  }
});

// Handle Google Sign In
if (googleBtn) {
  googleBtn.addEventListener('click', async () => {
    clearAlerts();
    setLoading(true);

    try {
      await loginWithGoogle();
      showSuccess('Akun Google terhubung! Mengalihkan...');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 600);
    } catch (error) {
      console.error('Google register error:', error);
      const friendlyMsg = getFriendlyErrorMessage(error.code) || error.message;
      showError(friendlyMsg);
      setLoading(false);
    }
  });
}
