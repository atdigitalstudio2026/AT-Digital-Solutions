import { 
  sendPasswordReset, 
  getFriendlyErrorMessage 
} from "./auth.js";

// DOM Elements
const forgotForm = document.getElementById('forgotForm');
const emailInput = document.getElementById('email');
const submitBtn = document.getElementById('submitBtn');
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
    emailInput.disabled = true;
  } else {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    emailInput.disabled = false;
  }
}

forgotForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAlerts();

  const email = emailInput.value.trim();
  if (!email || !email.includes('@')) {
    showError('Mohon masukkan alamat email yang valid.');
    return;
  }

  setLoading(true);

  try {
    await sendPasswordReset(email);
    showSuccess('Link reset password telah dikirim ke email Anda. Silakan periksa kotak masuk atau spam email Anda.');
    setLoading(false);
    emailInput.value = '';
  } catch (error) {
    console.error('Forgot password error:', error);
    const friendlyMsg = getFriendlyErrorMessage(error.code) || error.message;
    showError(friendlyMsg);
    setLoading(false);
  }
});
