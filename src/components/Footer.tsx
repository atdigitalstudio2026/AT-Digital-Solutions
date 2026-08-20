import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Zap, ArrowRight, Check, Heart, Globe, Lock, MessageCircle, Phone } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { openWhatsAppChat, WHATSAPP_CONFIG } from '../utils/whatsapp';

export const Footer: React.FC = () => {
  const { navigateTo, setSelectedCategory, showToast } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Mohon masukkan alamat email yang valid.', 'warning');
      return;
    }
    setIsSubscribed(true);
    showToast('Terima kasih! Anda telah berlangganan update software terbaru.', 'success');
  };

  const handleCategoryClick = (cat: any) => {
    setSelectedCategory(cat);
    navigateTo('/catalog');
  };

  return (
    <footer className="w-full border-t border-white/10 bg-[#06060a] relative z-10 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7c5cff] via-[#ff4fd8] to-[#00e0c6] flex items-center justify-center text-[#0a0a12] font-display font-bold text-xs tracking-tight">
                AT
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                AT Digital Solution
              </span>
            </div>
            <p className="text-sm text-[#9291ab] max-w-sm leading-relaxed">
              Pusat software & aplikasi bisnis modern terbaik dari AT Digital Solution di Indonesia. Dirancang dengan standar performa ultra-cepat, perlindungan privasi tingkat militer, dan lisensi instan tanpa ribet.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => openWhatsAppChat()}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 text-xs font-semibold hover:bg-[#25D366]/20 transition-colors"
              >
                <Phone className="w-3 h-3" />
                WA: {WHATSAPP_CONFIG.displayNumber}
              </button>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00e0c6]/10 text-[#00e0c6] border border-[#00e0c6]/20 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e0c6] animate-ping" />
                Server 99.9%
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] text-[#9291ab] border border-white/10 text-xs font-mono">
                <Lock className="w-3 h-3 text-[#ff4fd8]" /> TLS 1.3
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-display font-semibold text-sm text-white uppercase tracking-wider mb-4">
              Kategori Software
            </h4>
            <ul className="space-y-2.5 text-sm text-[#9291ab]">
              {CATEGORIES.slice(1).map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => handleCategoryClick(cat)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-display font-semibold text-sm text-white uppercase tracking-wider mb-4">
              Ekosistem & Bantuan
            </h4>
            <ul className="space-y-2.5 text-sm text-[#9291ab]">
              <li>
                <button onClick={() => navigateTo('/catalog')} className="hover:text-white transition-colors">
                  Katalog Lengkap
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/dashboard')} className="hover:text-white transition-colors">
                  Portal Lisensi Pengguna
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/cart')} className="hover:text-white transition-colors">
                  Keranjang Belanja
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openWhatsAppChat()} 
                  className="text-[#25D366] hover:underline font-semibold flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Chat WhatsApp (24/7 Fast Response)
                </button>
              </li>
              <li>
                <span className="text-[#615f78] cursor-not-allowed">
                  Dokumentasi API (Segera)
                </span>
              </li>
              <li>
                <span className="text-[#615f78] cursor-not-allowed">
                  Program Reseller & Afiliasi
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h4 className="font-display font-semibold text-sm text-white uppercase tracking-wider mb-4">
              Update Rilis Software
            </h4>
            <p className="text-xs text-[#9291ab] mb-3 leading-relaxed">
              Dapatkan notifikasi rilis software versi terbaru dan diskon eksklusif bulanan.
            </p>
            {isSubscribed ? (
              <div className="p-3 rounded-xl bg-[#00e0c6]/10 border border-[#00e0c6]/30 text-[#00e0c6] text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" />
                Terdaftar di buletin mingguan!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="nama@perusahaan.com"
                    className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#615f78] focus:outline-none focus:border-[#7c5cff] focus:ring-2 focus:ring-[#7c5cff]/20 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full gradient-btn py-2 rounded-xl text-xs font-bold font-display flex items-center justify-center gap-1.5"
                >
                  Langganan Berita
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright & badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#615f78]">
          <p>© 2026 AT Digital Solution. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-[#9291ab]">
              <Globe className="w-3.5 h-3.5 text-[#00e0c6]" /> Region: Indonesia (IDR)
            </span>
            <span className="flex items-center gap-1 text-[#9291ab]">
              <Zap className="w-3.5 h-3.5 text-[#ffb84f]" /> Ultra-fast response
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
