import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User as UserIcon, 
  Download, 
  Key, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Check, 
  Eye, 
  Plus, 
  Zap, 
  Shield, 
  ExternalLink,
  Receipt,
  FileCheck,
  Search
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    user, 
    purchasedProductIds, 
    getProductById, 
    transactions, 
    navigateTo, 
    startDownloadSimulation, 
    openDemoModal,
    formatPrice,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'apps' | 'licenses' | 'history'>('apps');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activationInput, setActivationInput] = useState('');

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#7c5cff] via-[#ff4fd8] to-[#00e0c6] flex items-center justify-center text-[#0a0a12] mx-auto shadow-xl">
          <UserIcon className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Akses Dashboard Klien
          </h2>
          <p className="text-sm text-[#9291ab] leading-relaxed max-w-md mx-auto">
            Silakan masuk atau daftarkan akun baru untuk melihat lisensi software, riwayat transaksi, dan file unduhan aplikasi Anda.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigateTo('/auth')}
            className="w-full sm:w-auto gradient-btn px-6 py-3 rounded-2xl text-xs font-bold font-display tracking-tight flex items-center justify-center gap-2"
          >
            <UserIcon className="w-4 h-4" />
            Masuk / Buat Akun Baru
          </button>
          <button
            onClick={() => navigateTo('/catalog')}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#9291ab] hover:text-white transition-colors"
          >
            Jelajahi Katalog Software
          </button>
        </div>
      </div>
    );
  }

  const ownedProducts = purchasedProductIds
    .map((id) => getProductById(id))
    .filter(Boolean);

  const handleCopy = (key: string) => {
    navigator.clipboard?.writeText(key).catch(() => {});
    setCopiedKey(key);
    showToast('Kunci lisensi disalin!', 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleManualActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activationInput.trim()) return;

    if (activationInput.toUpperCase().startsWith('AT-')) {
      showToast(`Lisensi ${activationInput.toUpperCase()} berhasil divalidasi dan dihubungkan ke akun!`, 'success');
      setActivationInput('');
    } else {
      showToast('Format kode lisensi tidak valid (harus diawali AT-)', 'warning');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* User Header Profile Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0c16] border border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#7c5cff]/10 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#7c5cff] via-[#ff4fd8] to-[#00e0c6] p-0.5 flex items-center justify-center shadow-lg shrink-0">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                referrerPolicy="no-referrer" 
                className="w-full h-full rounded-2xl object-cover" 
              />
            ) : (
              <div className="w-full h-full rounded-2xl bg-[#07070c] flex items-center justify-center font-display font-bold text-2xl text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-2xl text-white">
                {user.name}
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00e0c6]/20 text-[#00e0c6] border border-[#00e0c6]/30 font-semibold">
                Member Terverifikasi
              </span>
            </div>
            <p className="text-xs text-[#9291ab] font-mono">{user.email}</p>
            <p className="text-[11px] text-[#615f78]">{user.company} · Bergabung {user.joinedDate}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
          <div className="text-left md:text-right">
            <div className="font-display font-bold text-2xl text-white">
              {ownedProducts.length}
            </div>
            <div className="text-[11px] text-[#9291ab] font-mono">Software Dimiliki</div>
          </div>
          <div className="h-8 w-px bg-white/10 hidden sm:block" />
          <div className="text-left md:text-right">
            <div className="font-display font-bold text-2xl text-[#00e0c6]">
              {transactions.length}
            </div>
            <div className="text-[11px] text-[#9291ab] font-mono">Transaksi Sukses</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('apps')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'apps'
                ? 'bg-[#7c5cff] text-white shadow-md'
                : 'bg-white/[0.03] text-[#9291ab] hover:text-white'
            }`}
          >
            Aplikasi Saya ({ownedProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('licenses')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'licenses'
                ? 'bg-[#7c5cff] text-white shadow-md'
                : 'bg-white/[0.03] text-[#9291ab] hover:text-white'
            }`}
          >
            Kunci Lisensi ({ownedProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-[#7c5cff] text-white shadow-md'
                : 'bg-white/[0.03] text-[#9291ab] hover:text-white'
            }`}
          >
            Riwayat Pembelian ({transactions.length})
          </button>
        </div>

        <button
          onClick={() => navigateTo('/catalog')}
          className="gradient-btn px-4 py-2 rounded-xl text-xs font-bold font-display hidden sm:inline-flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Beli Software Baru
        </button>
      </div>

      {/* TAB 1: OWNED APPS */}
      {activeTab === 'apps' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownedProducts.map((p) => {
              if (!p) return null;
              return (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl bg-[#0c0c16] border border-white/10 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-xl text-[#0a0a12]"
                        style={{ background: p.gradient }}
                      >
                        {p.iconLetter}
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00e0c6]/20 text-[#00e0c6] border border-[#00e0c6]/30">
                        Lisensi Aktif
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-base text-white">
                        {p.name}
                      </h3>
                      <p className="text-xs text-[#9291ab] mt-1 line-clamp-2">
                        {p.tagline}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs text-[#615f78] font-mono">
                      <span>Versi: <strong className="text-white">{p.version}</strong></span>
                      <span>Ukuran: <strong className="text-white">{p.fileSize}</strong></span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openDemoModal(p)}
                      className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#00e0c6]" />
                      Buka Demo
                    </button>
                    <button
                      onClick={() => startDownloadSimulation(p)}
                      className="gradient-btn px-3 py-2 rounded-xl text-xs font-bold font-display flex items-center justify-center gap-1.5 shadow-md shadow-[#7c5cff]/20"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Unduh
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Activate Software Manual box */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-semibold text-xs text-white flex items-center justify-center sm:justify-start gap-2">
                <Key className="w-3.5 h-3.5 text-[#ffb84f]" /> Punya Kode Lisensi dari Reseller?
              </h4>
              <p className="text-xs text-[#9291ab]">
                Masukkan kode aktivasi Anda di bawah untuk mengklaim installer langsung ke dashboard ini.
              </p>
            </div>
            <form onSubmit={handleManualActivate} className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={activationInput}
                onChange={(e) => setActivationInput(e.target.value)}
                placeholder="AT-XXXX-XXXX-PRO"
                className="bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-[#615f78] uppercase focus:outline-none focus:border-[#7c5cff]"
              />
              <button
                type="submit"
                className="gradient-btn px-4 py-2 rounded-xl text-xs font-bold font-display"
              >
                Aktivasi
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: LICENSES */}
      {activeTab === 'licenses' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-[#0c0c16] border border-white/10 space-y-4 shadow-xl">
            <h3 className="font-display font-bold text-base text-white">
              Daftar Kunci Lisensi Terdaftar
            </h3>
            <div className="space-y-3">
              {ownedProducts.map((p, idx) => {
                if (!p) return null;
                const mockKey = `AT-${p.id.slice(0, 4).toUpperCase()}-8912-PRO`;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/[0.025] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-base text-[#0a0a12]"
                        style={{ background: p.gradient }}
                      >
                        {p.iconLetter}
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-white">{p.name}</div>
                        <div className="text-[11px] text-[#9291ab] font-mono">
                          {p.licenseType} · Status: Aktif Permanen
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#00e0c6] bg-black/60 px-3 py-2 rounded-xl border border-white/10 font-bold tracking-wider">
                        {mockKey}
                      </span>
                      <button
                        onClick={() => handleCopy(mockKey)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                        title="Salin kode lisensi"
                      >
                        {copiedKey === mockKey ? (
                          <Check className="w-4 h-4 text-[#00e0c6]" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRANSACTION HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-[#0c0c16] border border-white/10 space-y-4 shadow-xl">
            <h3 className="font-display font-bold text-base text-white">
              Riwayat Pembelian & Faktur Digital
            </h3>

            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 rounded-2xl bg-white/[0.025] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-white">
                        {tx.orderNumber}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00e0c6]/20 text-[#00e0c6]">
                        {tx.status}
                      </span>
                    </div>
                    <div className="text-xs text-[#9291ab]">
                      {tx.items.map((i) => i.productName).join(', ')}
                    </div>
                    <div className="text-[11px] text-[#615f78] font-mono">
                      {tx.date} · Pembayaran: {tx.paymentMethod}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    <div className="font-mono font-bold text-sm text-white">
                      {formatPrice(tx.total)}
                    </div>
                    <button
                      onClick={() => showToast(`Mengunduh faktur PDF untuk ${tx.orderNumber}...`, 'info')}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#9291ab] hover:text-white transition-colors flex items-center gap-1 text-xs"
                      title="Unduh faktur PDF"
                    >
                      <Receipt className="w-3.5 h-3.5 text-[#00e0c6]" />
                      <span className="hidden sm:inline">Faktur PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
