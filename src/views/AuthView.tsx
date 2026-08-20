import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Lock, 
  Mail, 
  User as UserIcon, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Loader2, 
  Building, 
  KeyRound,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AuthViewProps {
  initialMode?: 'login' | 'register';
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode = 'login' }) => {
  const { 
    loginWithGoogle,
    loginWithGoogleAccount,
    loginWithEmail, 
    registerWithEmail, 
    sendPasswordReset, 
    navigateTo, 
    showToast 
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Google Account Selector modal state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleDirectGoogleLogin = async (googleEmail: string, googleName?: string) => {
    setIsGoogleLoading(true);
    setErrorMessage(null);
    try {
      const ok = await loginWithGoogleAccount(googleEmail, googleName);
      if (ok) {
        setShowGoogleModal(false);
        navigateTo('/dashboard');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal masuk dengan akun Google.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleOpenGoogleAuth = () => {
    setErrorMessage(null);
    setShowGoogleModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !email.includes('@')) {
      setErrorMessage('Masukkan alamat email yang valid.');
      showToast('Masukkan alamat email yang valid.', 'warning');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      showToast('Kata sandi minimal 6 karakter.', 'warning');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMessage('Nama lengkap wajib diisi.');
        showToast('Nama lengkap wajib diisi.', 'warning');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Konfirmasi kata sandi tidak cocok.');
        showToast('Konfirmasi kata sandi tidak cocok.', 'error');
        return;
      }
    }

    setIsLoading(true);

    if (mode === 'login') {
      const ok = await loginWithEmail(email, password);
      setIsLoading(false);
      if (ok) {
        navigateTo('/dashboard');
      }
    } else {
      const ok = await registerWithEmail(name, email, password, company);
      setIsLoading(false);
      if (ok) {
        navigateTo('/dashboard');
      }
    }
  };

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      showToast('Masukkan alamat email pemulihan yang valid.', 'warning');
      return;
    }
    setIsForgotLoading(true);
    const ok = await sendPasswordReset(forgotEmail);
    setIsForgotLoading(false);
    if (ok) {
      setForgotSuccess(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12 relative">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#0c0c16]/95 border border-white/15 shadow-2xl backdrop-blur-2xl space-y-6 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#7c5cff]/10 blur-3xl pointer-events-none" />

        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7c5cff] via-[#ff4fd8] to-[#00e0c6] flex items-center justify-center text-[#0a0a12] font-display font-bold text-base mx-auto shadow-lg shadow-[#7c5cff]/30">
            AT
          </div>
          <h2 className="font-display font-bold text-2xl text-white">
            {mode === 'login' ? 'Selamat Datang Kembali' : 'Buat Akun Klien Baru'}
          </h2>
          <p className="text-xs text-[#9291ab]">
            {mode === 'login'
              ? 'Masuk dengan akun Google atau Email & Sandi resmi Anda'
              : 'Daftarkan akun untuk mengelola lisensi software dan invoice'}
          </p>
        </div>

        {/* Error Notification banner if any */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMessage(null); }}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              mode === 'login' ? 'bg-[#7c5cff] text-white shadow-md' : 'text-[#9291ab] hover:text-white'
            }`}
            id="auth-tab-login"
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMessage(null); }}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              mode === 'register' ? 'bg-[#7c5cff] text-white shadow-md' : 'text-[#9291ab] hover:text-white'
            }`}
            id="auth-tab-register"
          >
            Daftar Akun
          </button>
        </div>

        {/* Google 1-Click Login Section */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleDirectGoogleLogin('atdigitalstudio2026@gmail.com', 'AT Digital Studio')}
            disabled={isGoogleLoading || isLoading}
            className="w-full p-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] active:scale-[0.99] border border-white/20 text-xs font-semibold text-white flex items-center justify-between transition-all cursor-pointer disabled:opacity-50 shadow-sm group"
            id="auth-google-quick-btn"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.38-2.27V6.58H1.25A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <div className="text-left">
                <div className="text-white font-semibold text-xs flex items-center gap-1.5">
                  <span>Masuk via Google</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#00e0c6]/20 text-[#00e0c6] font-mono">1-Klik</span>
                </div>
                <div className="text-[11px] text-[#9291ab]">atdigitalstudio2026@gmail.com</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#9291ab] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            type="button"
            onClick={handleOpenGoogleAuth}
            disabled={isGoogleLoading || isLoading}
            className="w-full text-center text-[11px] text-[#9291ab] hover:text-[#00e0c6] py-1 cursor-pointer transition-colors"
          >
            Pilih atau gunakan akun Google / Gmail lainnya →
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-[10px] text-[#615f78] uppercase tracking-wider font-mono">atau email & kata sandi</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="text-[11px] font-semibold text-[#9291ab] block mb-1">
                  Nama Lengkap <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#615f78] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Lengkap Anda"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/15 rounded-xl text-xs text-white placeholder-[#615f78] focus:outline-none focus:border-[#7c5cff]"
                    id="auth-name-input"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#9291ab] block mb-1">
                  Perusahaan / Instansi <span className="text-[10px] text-[#615f78] font-normal">(Opsional)</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#615f78] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="PT / Bisnis / Personal"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/15 rounded-xl text-xs text-white placeholder-[#615f78] focus:outline-none focus:border-[#7c5cff]"
                    id="auth-company-input"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-[11px] font-semibold text-[#9291ab] block mb-1">
              Alamat Email <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#615f78] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/15 rounded-xl text-xs text-white placeholder-[#615f78] focus:outline-none focus:border-[#7c5cff]"
                id="auth-email-input"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-[#9291ab]">
                Kata Sandi <span className="text-red-400">*</span>
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotSuccess(false);
                    setShowForgotModal(true);
                  }}
                  className="text-[11px] text-[#00e0c6] hover:underline cursor-pointer"
                  id="auth-forgot-password-btn"
                >
                  Lupa kata sandi?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#615f78] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-10 pr-10 py-2.5 bg-white/[0.04] border border-white/15 rounded-xl text-xs text-white placeholder-[#615f78] focus:outline-none focus:border-[#7c5cff]"
                id="auth-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#615f78] hover:text-white"
                title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="text-[11px] font-semibold text-[#9291ab] block mb-1">
                Ulangi Kata Sandi <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#615f78] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi Anda"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/15 rounded-xl text-xs text-white placeholder-[#615f78] focus:outline-none focus:border-[#7c5cff]"
                  id="auth-confirm-password-input"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full gradient-btn py-3 rounded-xl font-display font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#7c5cff]/30 cursor-pointer disabled:opacity-50"
            id="auth-submit-btn"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Memproses data...</span>
              </>
            ) : (
              <>
                <span>{mode === 'login' ? 'Masuk ke Akun' : 'Daftarkan Akun Sekarang'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security badge */}
        <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#615f78]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00e0c6]" />
          <span>Autentikasi Aman & Terenkripsi oleh Firebase Cloud</span>
        </div>
      </div>

      {/* Google Account Selector Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-[#0e0e1a] border border-white/20 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#9291ab] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.38-2.27V6.58H1.25A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </div>

            <div className="space-y-1">
              <h3 className="font-display font-bold text-base text-white">
                Pilih Akun Google / Gmail
              </h3>
              <p className="text-xs text-[#9291ab]">
                Pilih akun Google Anda untuk login dan menyinkronkan data klien.
              </p>
            </div>

            {/* Predefined / Suggested Google Account */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => handleDirectGoogleLogin('atdigitalstudio2026@gmail.com', 'AT Digital Studio')}
                disabled={isGoogleLoading}
                className="w-full p-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-[#7c5cff]/30 text-left flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7c5cff] to-[#00e0c6] flex items-center justify-center text-[#0a0a12] font-bold text-xs">
                    A
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">AT Digital Studio</div>
                    <div className="text-[11px] text-[#9291ab]">atdigitalstudio2026@gmail.com</div>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-[#00e0c6] opacity-80 group-hover:opacity-100" />
              </button>
            </div>

            {/* Custom Google Email Form */}
            <div className="pt-2 border-t border-white/10 space-y-3">
              <div className="text-[11px] font-semibold text-[#9291ab]">
                Atau Masukkan Akun Google Lainnya:
              </div>
              <input
                type="email"
                placeholder="nama@gmail.com"
                value={customGoogleEmail}
                onChange={(e) => setCustomGoogleEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/[0.05] border border-white/15 rounded-xl text-xs text-white placeholder-[#615f78] focus:outline-none focus:border-[#00e0c6]"
              />
              <input
                type="text"
                placeholder="Nama Pengguna (Opsional)"
                value={customGoogleName}
                onChange={(e) => setCustomGoogleName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/[0.05] border border-white/15 rounded-xl text-xs text-white placeholder-[#615f78] focus:outline-none focus:border-[#00e0c6]"
              />
              <button
                type="button"
                disabled={!customGoogleEmail.includes('@') || isGoogleLoading}
                onClick={() => handleDirectGoogleLogin(customGoogleEmail, customGoogleName)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7c5cff] to-[#00e0c6] text-white text-xs font-bold font-display disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Menghubungkan...</span>
                  </>
                ) : (
                  <span>Masuk dengan Akun Ini</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-[#0e0e1a] border border-white/20 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#9291ab] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 rounded-2xl bg-[#00e0c6]/20 border border-[#00e0c6]/40 flex items-center justify-center text-[#00e0c6]">
              <KeyRound className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <h3 className="font-display font-bold text-base text-white">
                Pemulihan Kata Sandi
              </h3>
              <p className="text-xs text-[#9291ab] leading-relaxed">
                Masukkan email akun Anda. Kami akan mengirimkan tautan resmi untuk mengatur ulang kata sandi.
              </p>
            </div>

            {forgotSuccess ? (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Email Terkirim!
                </div>
                <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                  Silakan periksa kotak masuk (atau folder spam) email <strong>{forgotEmail}</strong> dan ikuti instruksi pemulihan.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full mt-2 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 text-xs font-semibold"
                >
                  Tutup Jendela
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendReset} className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#9291ab] block mb-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-3.5 py-2.5 bg-white/[0.05] border border-white/15 rounded-xl text-xs text-white placeholder-[#615f78] focus:outline-none focus:border-[#00e0c6]"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#9291ab] font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isForgotLoading}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7c5cff] to-[#00e0c6] text-white text-xs font-bold font-display disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {isForgotLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      'Kirim Tautan'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
