import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Download, 
  CheckCircle2, 
  HardDrive, 
  ShieldCheck, 
  Copy, 
  Check, 
  Terminal, 
  FileCode,
  Zap
} from 'lucide-react';

export const DownloadModal: React.FC = () => {
  const { downloadingProduct, closeDownloadModal, showToast } = useApp();
  const [progress, setProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState('0 MB/s');
  const [isCompleted, setIsCompleted] = useState(false);
  const [copiedLicense, setCopiedLicense] = useState(false);

  useEffect(() => {
    if (!downloadingProduct) {
      setProgress(0);
      setIsCompleted(false);
      return;
    }

    setProgress(0);
    setIsCompleted(false);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCompleted(true);
          setDownloadSpeed('Selesai');
          return 100;
        }
        const delta = Math.floor(Math.random() * 18) + 12;
        const next = Math.min(100, prev + delta);
        setDownloadSpeed(`${(Math.random() * 15 + 42).toFixed(1)} MB/s`);
        return next;
      });
    }, 280);

    return () => clearInterval(interval);
  }, [downloadingProduct]);

  if (!downloadingProduct) return null;

  const mockLicense = `AT-${downloadingProduct.id.slice(0, 4).toUpperCase()}-9841-PRO`;

  const copyLicense = () => {
    navigator.clipboard?.writeText(mockLicense).catch(() => {});
    setCopiedLicense(true);
    showToast('Kode lisensi disalin ke clipboard!', 'success');
    setTimeout(() => setCopiedLicense(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0c0c16] border border-white/15 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-xl text-[#0a0a12] shadow-lg"
              style={{ background: downloadingProduct.gradient }}
            >
              {downloadingProduct.iconLetter}
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                {isCompleted ? 'Unduhan Selesai!' : `Mengunduh ${downloadingProduct.name}`}
              </h3>
              <p className="text-xs text-[#9291ab] font-mono">
                {downloadingProduct.version} · {downloadingProduct.fileSize} · Multi-Threaded CDN
              </p>
            </div>
          </div>

          <button
            onClick={closeDownloadModal}
            className="p-1.5 rounded-lg text-[#9291ab] hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar and Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#9291ab] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#00e0c6]" />
              {isCompleted ? 'Integritas Terverifikasi' : `Kecepatan: ${downloadSpeed}`}
            </span>
            <span className="font-bold text-white">{progress}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#7c5cff] via-[#ff4fd8] to-[#00e0c6] transition-all duration-300 shadow-lg shadow-[#00e0c6]/50"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Checksum & Security verification box */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2 text-xs">
          <div className="flex items-center justify-between text-[#9291ab]">
            <span className="flex items-center gap-1.5 text-[#00e0c6]">
              <ShieldCheck className="w-4 h-4" /> VirusTotal Verified: Clean
            </span>
            <span className="font-mono text-[10px]">SHA-256 Valid</span>
          </div>
          <div className="font-mono text-[11px] text-[#615f78] truncate bg-black/40 px-2.5 py-1 rounded">
            Checksum: 8f4a21b...e921d74c0b2981
          </div>
        </div>

        {/* License Key Helper */}
        <div className="p-4 rounded-xl bg-[#7c5cff]/10 border border-[#7c5cff]/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#edecf6]">Kunci Aktivasi Lisensi Anda</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#7c5cff]/30 text-white">
              Seumur Hidup
            </span>
          </div>
          <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-lg p-2">
            <span className="font-mono text-xs text-white font-bold tracking-wider flex-1">
              {mockLicense}
            </span>
            <button
              onClick={copyLicense}
              className="p-1 text-[#9291ab] hover:text-white transition-colors"
              title="Salin lisensi"
            >
              {copiedLicense ? <Check className="w-4 h-4 text-[#00e0c6]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-[#9291ab]">
            Masukkan kunci ini saat pertama kali membuka aplikasi di komputer Anda.
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={closeDownloadModal}
          className="w-full gradient-btn py-3 rounded-xl text-xs font-bold font-display shadow-lg shadow-[#7c5cff]/30"
        >
          {isCompleted ? 'Buka Folder Unduhan' : 'Selesaikan di Latar Belakang'}
        </button>
      </div>
    </div>
  );
};
