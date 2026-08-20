import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  Download, 
  ArrowRight, 
  FileText, 
  Sparkles,
  Zap,
  ShieldCheck
} from 'lucide-react';

interface SuccessViewProps {
  orderId?: string;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ orderId }) => {
  const { transactions, getProductById, navigateTo, startDownloadSimulation, showToast } = useApp();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Latest transaction or matching
  const latestTx = transactions[0];

  const handleCopyLicense = (key: string) => {
    navigator.clipboard?.writeText(key).catch(() => {});
    setCopiedKey(key);
    showToast('Kode lisensi berhasil disalin!', 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-10">
      {/* Animated Success Icon */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#00e0c6] to-[#7c5cff] p-1 shadow-2xl shadow-[#00e0c6]/30 flex items-center justify-center animate-pulse-glow">
          <div className="w-full h-full rounded-full bg-[#07070c] flex items-center justify-center text-[#00e0c6]">
            <CheckCircle2 className="w-10 h-10" />
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono text-[#00e0c6] font-bold uppercase tracking-wider">
            Transaksi Sukses Terverifikasi
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">
            Pembayaran Berhasil Dikonfirmasi!
          </h1>
          <p className="text-xs sm:text-sm text-[#9291ab] max-w-md mx-auto">
            Terima kasih atas pembelian Anda. Lisensi software Anda telah aktif dan siap diunduh seketika.
          </p>
        </div>
      </div>

      {/* License Keys Card */}
      {latestTx && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0c16] border border-white/15 text-left space-y-6 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <div className="text-xs text-[#9291ab] font-mono">No. Pesanan:</div>
              <div className="font-mono font-bold text-sm text-white">{latestTx.orderNumber}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#9291ab] font-mono">Metode:</div>
              <div className="text-xs text-[#00e0c6] font-semibold">{latestTx.paymentMethod}</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display font-bold text-sm text-white">
              Software & Kunci Aktivasi Anda
            </h3>

            <div className="space-y-3">
              {latestTx.items.map((item, idx) => {
                const product = getProductById(item.productId);
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/[0.025] border border-white/10 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {product && (
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-base text-[#0a0a12]"
                            style={{ background: product.gradient }}
                          >
                            {product.iconLetter}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-xs text-white">
                            {item.productName}
                          </div>
                          <div className="text-[11px] text-[#9291ab] font-mono">
                            {item.version} · {item.qty} Lisensi Seumur Hidup
                          </div>
                        </div>
                      </div>

                      {product && (
                        <button
                          onClick={() => startDownloadSimulation(product)}
                          className="gradient-btn px-4 py-2 rounded-xl text-xs font-bold font-display flex items-center justify-center gap-1.5 shadow-md shadow-[#7c5cff]/20"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Unduh Installer ({product.fileSize})
                        </button>
                      )}
                    </div>

                    {/* License Key Box */}
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs">
                      <span className="text-[#00e0c6] font-bold tracking-wider truncate">
                        {item.licenseKey}
                      </span>
                      <button
                        onClick={() => handleCopyLicense(item.licenseKey)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#9291ab] hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                        title="Salin lisensi"
                      >
                        {copiedKey === item.licenseKey ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#00e0c6]" />
                            <span className="text-[#00e0c6]">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2 text-xs text-[#9291ab]">
            <ShieldCheck className="w-4 h-4 text-[#00e0c6] flex-shrink-0" />
            <span>Bukti pembayaran dan faktur digital resmi telah dikirimkan ke alamat email Anda.</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => navigateTo('/dashboard')}
          className="w-full sm:w-auto gradient-btn px-8 py-3.5 rounded-xl font-display font-bold text-xs shadow-xl shadow-[#7c5cff]/30 flex items-center justify-center gap-2"
        >
          Masuk ke Dashboard Saya
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => navigateTo('/catalog')}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/15 font-semibold text-xs text-[#edecf6] transition-colors"
        >
          Lanjut Belanja Software
        </button>
      </div>
    </div>
  );
};
