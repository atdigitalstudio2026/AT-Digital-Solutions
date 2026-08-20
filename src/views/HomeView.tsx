import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES } from '../data/products';
import { 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  Sparkles, 
  TrendingUp, 
  Cpu, 
  CheckCircle2,
  Lock,
  DownloadCloud,
  Star,
  Quote
} from 'lucide-react';
import { TESTIMONIALS } from '../data/products';

export const HomeView: React.FC = () => {
  const { products, navigateTo, setSelectedCategory, setSearchQuery } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'best' | 'new'>('all');
  const [activeSpeedTab, setActiveSpeedTab] = useState<'startup' | 'memory' | 'sync'>('startup');

  const filteredFeatured = products.filter((p) => {
    if (activeTab === 'best') return p.tag === 'best';
    if (activeTab === 'new') return p.tag === 'new';
    return true;
  });

  const handleCategorySelect = (cat: any) => {
    setSelectedCategory(cat);
    navigateTo('/catalog');
  };

  return (
    <div className="space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-16 text-center max-w-5xl mx-auto px-4 sm:px-6">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/15 text-xs font-medium text-[#c4c2dd] mb-8 shadow-sm backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#00e0c6] animate-pulse" />
          <span className="font-semibold text-white">Rilis Agustus 2026:</span>
          <span>8 Aplikasi Bisnis Performa Maksimal Tersedia</span>
        </div>

        {/* Big Display Headline */}
        <h1 className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.08] mb-6">
          Software bisnis yang <br className="hidden sm:inline" />
          <span className="gradient-text">bekerja secepat timmu.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-[#9291ab] max-w-2xl mx-auto leading-relaxed mb-10">
          AT Digital Solution menyediakan software produktivitas, analitik, desain, dan keamanan modern. Siap diunduh seketika, dioptimasi untuk kecepatan tinggi dan tanpa beban instalasi rumit.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <button
            onClick={() => navigateTo('/catalog')}
            className="w-full sm:w-auto gradient-btn px-8 py-3.5 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#7c5cff]/25"
            id="hero-explore-btn"
          >
            Jelajahi Katalog Aplikasi
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigateTo('/auth')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/15 font-semibold text-sm text-[#edecf6] transition-all"
            id="hero-register-btn"
          >
            Buat Akun Pengguna
          </button>
        </div>

        {/* Stat Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-white/10">
          <div className="p-3 text-center">
            <div className="font-display font-bold text-2xl sm:text-3xl text-white">
              &lt; 180ms
            </div>
            <div className="text-xs text-[#9291ab] mt-1 font-mono">Waktu Buka Aplikasi</div>
          </div>
          <div className="p-3 text-center">
            <div className="font-display font-bold text-2xl sm:text-3xl text-[#00e0c6]">
              48.000+
            </div>
            <div className="text-xs text-[#9291ab] mt-1 font-mono">Lisensi Aktif Terpasang</div>
          </div>
          <div className="p-3 text-center">
            <div className="font-display font-bold text-2xl sm:text-3xl text-[#ffb84f]">
              4.85 / 5.0
            </div>
            <div className="text-xs text-[#9291ab] mt-1 font-mono">Rating Kepuasan Tim</div>
          </div>
          <div className="p-3 text-center">
            <div className="font-display font-bold text-2xl sm:text-3xl text-[#ff4fd8]">
              100% Native
            </div>
            <div className="text-xs text-[#9291ab] mt-1 font-mono">Ringan & Hemat RAM</div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY PILLS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-[#7c5cff] uppercase tracking-wider font-mono">
              Eksplorasi Cepat
            </span>
            <h2 className="font-display font-bold text-2xl text-white mt-1">
              Kategori Kebutuhan Bisnis
            </h2>
          </div>
          <button
            onClick={() => navigateTo('/catalog')}
            className="text-xs font-semibold text-[#00e0c6] hover:underline flex items-center gap-1"
          >
            Semua ({products.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.slice(1).map((cat) => {
            const count = products.filter((p) => p.cat === cat).length;
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className="p-4 rounded-2xl bg-white/[0.025] hover:bg-white/[0.06] border border-white/10 hover:border-[#7c5cff]/50 text-left transition-all group"
              >
                <div className="text-sm font-semibold text-white group-hover:text-[#00e0c6] transition-colors">
                  {cat}
                </div>
                <div className="text-xs text-[#615f78] mt-1 font-mono">{count} software siap pakai</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-[#00e0c6] uppercase tracking-wider font-mono">
              Software Terpopuler
            </span>
            <h2 className="font-display font-bold text-3xl text-white mt-1">
              Pilihan Utama untuk Perusahaan Anda
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'all' ? 'bg-[#7c5cff] text-white font-semibold' : 'text-[#9291ab] hover:text-white'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveTab('best')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'best' ? 'bg-[#7c5cff] text-white font-semibold' : 'text-[#9291ab] hover:text-white'
              }`}
            >
              Terlaris ⭐
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'new' ? 'bg-[#7c5cff] text-white font-semibold' : 'text-[#9291ab] hover:text-white'
              }`}
            >
              Rilis Baru ✨
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatured.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. SPEED & PERFORMANCE BENCHMARK SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#10101f] to-[#07070c] border border-white/15 relative overflow-hidden">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-[#ff4fd8] uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Tolok Ukur Kecepatan & Optimasi
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mt-2 mb-4">
              Mengapa software AT Digital Solution 5x lebih cepat dibanding alternatif lama?
            </h2>
            <p className="text-sm sm:text-base text-[#9291ab] leading-relaxed mb-8">
              Setiap aplikasi di ekosistem kami dikompilasi langsung menggunakan arsitektur native multi-thread (Rust & C++ core), memangkas konsumsi memori dan memberikan respons instan di setiap klik.
            </p>
          </div>

          {/* Interactive Benchmark Tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Startup Latency Metric */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
              <div className="flex items-center justify-between text-xs text-[#9291ab] font-mono">
                <span>Waktu Peluncuran (Cold Boot)</span>
                <span className="text-[#00e0c6] font-bold">5.8x Lebih Cepat</span>
              </div>
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white font-medium">AT Digital Solution Apps</span>
                    <span className="font-mono text-[#00e0c6] font-bold">140 ms</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-[#00e0c6] rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1 text-[#9291ab]">
                    <span>Software Konvensional (Electron/Web)</span>
                    <span className="font-mono">820 ms</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-red-500/50 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* RAM Usage Metric */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
              <div className="flex items-center justify-between text-xs text-[#9291ab] font-mono">
                <span>Penggunaan Memori RAM</span>
                <span className="text-[#7c5cff] font-bold">Hemat 78%</span>
              </div>
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white font-medium">AT Digital Solution Apps</span>
                    <span className="font-mono text-[#7c5cff] font-bold">48 MB</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-[#7c5cff] rounded-full" style={{ width: '22%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1 text-[#9291ab]">
                    <span>Software Konvensional</span>
                    <span className="font-mono">220 MB</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-amber-500/50 rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Offline Capability */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-white font-display font-semibold text-sm">
                <ShieldCheck className="w-4 h-4 text-[#00e0c6]" />
                Privasi Lokal & Zero Tracking
              </div>
              <p className="text-xs text-[#9291ab] leading-relaxed">
                Data pekerjaan dan file proyek Anda disimpan 100% di komputer lokal Anda tanpa transmisi analitik diam-diam.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-[#00e0c6] font-mono">
                ✓ Sesuai Regulasi Privasi GDPR & UU PDP
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#ffb84f] uppercase tracking-wider font-mono">
            Ulasan Pengguna Nyata
          </span>
          <h2 className="font-display font-bold text-3xl text-white mt-1">
            Dipercaya oleh Ribuan Tim Kreatif & Perusahaan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-white/[0.025] border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-[#ffb84f] mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#ffb84f]" />
                  ))}
                </div>
                <p className="text-xs text-[#c4c2dd] leading-relaxed mb-6 italic">
                  "{t.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="font-semibold text-xs text-white">{t.name}</div>
                <div className="text-[11px] text-[#9291ab] truncate">{t.role}</div>
                <div className="text-[10px] text-[#615f78] font-mono">{t.company}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-[#7c5cff]/20 via-[#ff4fd8]/10 to-[#00e0c6]/20 border border-white/20 text-center relative overflow-hidden backdrop-blur-2xl">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
              Mulai Tingkatkan Efisiensi Bisnis Anda Hari Ini
            </h2>
            <p className="text-sm sm:text-base text-[#c4c2dd] leading-relaxed">
              Beli satu kali, miliki lisensi seumur hidup tanpa biaya langganan bulanan yang mencekik. Download langsung setelah checkout selesai.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => navigateTo('/catalog')}
                className="gradient-btn px-8 py-3.5 rounded-xl font-display font-bold text-sm shadow-xl shadow-[#7c5cff]/30"
              >
                Lihat Katalog Lengkap
              </button>
              <button
                onClick={() => navigateTo('/auth')}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 font-semibold text-sm text-white transition-colors"
              >
                Daftar Akun Baru
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
