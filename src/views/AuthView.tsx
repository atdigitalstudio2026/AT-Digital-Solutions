import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Mail, User as UserIcon, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface AuthViewProps {
  initialMode?: 'login' | 'register';
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode = 'login' }) => {
  const { login, navigateTo, showToast } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      showToast('Masukkan alamat email yang valid.', 'warning');
      return;
    }

    if (mode === 'register' && password !== confirmPassword) {
      showToast('Konfirmasi kata sandi tidak cocok.', 'error');
      return;
    }

    login(email, name);
    navigateTo('/dashboard');
  };

  const handleGoogleLogin = () => {
    login('pengguna.google@atdigitalsolution.com', 'Pengguna Google');
    showToast('Berhasil masuk via Google Account!', 'success');
    navigateTo('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#0c0c16]/95 border border-white/15 shadow-2xl backdrop-blur-2xl space-y-6 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#7c5cff]/10 blur-3xl pointer-events-none" />

        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7c5cff] via-[#ff4fd8] to-[#00e0c6] flex items-center justify-center text-[#0a0a12] font-display font-bold text-base mx-auto shadow-lg shadow-[#7c5cff]/30">
            AT
          </div>
          <h2 className="font-display font-bold text-2xl text-white">
            {mode === 'login' ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
          </h2>
          <p className="text-xs text-[#9291ab]">
            {mode === 'login'
              ? 'Masuk untuk mengakses unduhan dan lisensi software Anda'
              : 'Daftar gratis dalam 30 detik untuk mulai bertransaksi'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              mode === 'login' ? 'bg-[#7c5cff] text-white shadow-md' : 'text-[#9291ab] hover:text-white'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              mode === 'register' ? 'bg-[#7c5cff] text-white shadow-md' : 'text-[#9291ab] hover:text-white'
            }`}
          >
            Daftar
          </button>
        </div>

        {/* 1-Click Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-xs font-semibold text-white flex items-center justify-center gap-2.5 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
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
          Lanjutkan dengan Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-[11px] text-[#615f78] uppercase font-mono">atau email</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-[11px] font-semibold text-[#9291ab] block mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#615f78] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Anda"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/15 rounded-xl text-xs text-white placeholder-[#615f78] focus:outline-none focus:border-[#7c5cff]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-[#9291ab] block mb-1">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#615f78] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@perusahaan.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/15 rounded-xl text-xs text-white placeholder-[#615f78] focus:outline-none focus:border-[#7c5cff]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-[#9291ab]">
                Kata Sandi
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => showToast('Tautan pemulihan kata sandi telah dikirim.', 'info')}
                  className="text-[11px] text-[#00e0c6] hover:underline"
                >
                  Lupa sandi?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#615f78] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/15 rounded-xl text-xs text-white placeholder-[#615f78] focus:outline-none focus:border-[#7c5cff]"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="text-[11px] font-semibold text-[#9291ab] block mb-1">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#615f78] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/15 rounded-xl text-xs text-white placeholder-[#615f78] focus:outline-none focus:border-[#7c5cff]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full gradient-btn py-3 rounded-xl font-display font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#7c5cff]/30 pt-3"
          >
            {mode === 'login' ? 'Masuk ke Akun' : 'Daftar Akun Baru'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
