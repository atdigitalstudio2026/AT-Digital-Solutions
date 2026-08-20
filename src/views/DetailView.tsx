import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Star, 
  Check, 
  Download, 
  ShoppingBag, 
  Eye, 
  ShieldCheck, 
  Cpu, 
  HardDrive, 
  Layers, 
  Zap, 
  Lock, 
  ChevronRight, 
  ChevronLeft,
  Share2,
  CheckCircle2,
  Terminal
} from 'lucide-react';
import { TESTIMONIALS } from '../data/products';
import { openWhatsAppChat } from '../utils/whatsapp';

interface DetailViewProps {
  productId: string;
}

export const DetailView: React.FC<DetailViewProps> = ({ productId }) => {
  const { 
    getProductById, 
    navigateTo, 
    addToCart, 
    formatPrice, 
    openDemoModal, 
    purchasedProductIds, 
    startDownloadSimulation,
    showToast
  } = useApp();

  const product = getProductById(productId);
  const [activeScreenshotIdx, setActiveScreenshotIdx] = useState(0);

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-white">Software tidak ditemukan</h2>
        <p className="text-sm text-[#9291ab]">Produk yang Anda cari mungkin telah dipindahkan atau tidak tersedia.</p>
        <button
          onClick={() => navigateTo('/catalog')}
          className="gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold font-display"
        >
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  const isPurchased = purchasedProductIds.includes(product.id);

  const handleBuyNow = () => {
    addToCart(product.id);
    navigateTo('/checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Tautan produk disalin ke clipboard!', 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Breadcrumb & Share */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigateTo('/catalog')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#9291ab] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Katalog
        </button>

        <button
          onClick={handleShare}
          className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-[#9291ab] hover:text-white text-xs flex items-center gap-1.5 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          Bagikan
        </button>
      </div>

      {/* Main Layout: Left Content (Screenshots & Specs) + Right Sticky Pricing Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left Column (2 Cols on lg) */}
        <div className="lg:col-span-2 space-y-10">
          {/* Header Title Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center font-display font-bold text-3xl text-[#0a0a12] shadow-xl flex-shrink-0"
              style={{ background: product.gradient }}
            >
              {product.iconLetter}
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
                  {product.name}
                </h1>
                {product.tag === 'best' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ffb84f]/15 text-[#ffb84f] border border-[#ffb84f]/30 uppercase">
                    Terlaris
                  </span>
                )}
                {product.tag === 'new' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00e0c6]/15 text-[#00e0c6] border border-[#00e0c6]/30 uppercase">
                    Rilis Baru
                  </span>
                )}
              </div>

              <p className="text-sm text-[#c4c2dd] leading-relaxed">
                {product.tagline}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#9291ab] pt-1">
                <div className="flex items-center gap-1 text-[#ffb84f]">
                  <Star className="w-3.5 h-3.5 fill-[#ffb84f]" />
                  <span className="font-bold">{product.rating.toFixed(1)}</span>
                  <span className="text-[#9291ab]">({product.reviewsCount} review)</span>
                </div>
                <span>·</span>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[11px]">
                  {product.cat}
                </span>
                <span>·</span>
                <span className="font-mono text-[11px] text-[#00e0c6] font-semibold">
                  Versi {product.version}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Mockup / Screenshot Viewer */}
          <div className="space-y-3">
            <div className="relative rounded-2xl bg-gradient-to-b from-[#10101d] to-[#080811] border border-white/15 p-6 sm:p-10 overflow-hidden min-h-[300px] flex flex-col justify-between shadow-2xl">
              {/* Top bar simulating desktop window */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs font-mono text-[#9291ab]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                  <span className="ml-2 text-white font-semibold">{product.name} — Preview Mode</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#7c5cff]/20 text-[#a5b4fc] text-[10px]">
                  {product.screenshots[activeScreenshotIdx]?.badge || 'UI Preview'}
                </span>
              </div>

              {/* Center Canvas with Simulated Live Graphics */}
              <div className="my-8 text-center space-y-4">
                <div
                  className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center font-display font-bold text-2xl text-[#0a0a12] shadow-2xl"
                  style={{ background: product.gradient }}
                >
                  {product.iconLetter}
                </div>
                <h3 className="font-display font-bold text-xl text-white">
                  {product.screenshots[activeScreenshotIdx]?.title || 'Antarmuka Visual Native'}
                </h3>
                <p className="text-xs text-[#9291ab] max-w-md mx-auto leading-relaxed">
                  {product.screenshots[activeScreenshotIdx]?.description || product.desc}
                </p>
              </div>

              {/* Bottom Test Sandbox CTA inside preview */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="text-[11px] text-[#615f78] font-mono">
                  Engine: Native Vulkan/Metal · 60fps
                </div>
                <button
                  onClick={() => openDemoModal(product)}
                  className="px-3 py-1.5 rounded-lg bg-[#00e0c6]/20 hover:bg-[#00e0c6]/30 border border-[#00e0c6]/40 text-xs font-semibold text-[#00e0c6] flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Coba Interaktif
                </button>
              </div>
            </div>

            {/* Thumbnail Carousel Selectors */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.screenshots.map((shot, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveScreenshotIdx(idx)}
                  className={`p-3 rounded-xl border text-left transition-all flex-1 min-w-[140px] ${
                    activeScreenshotIdx === idx
                      ? 'bg-[#7c5cff]/15 border-[#7c5cff] text-white shadow-md'
                      : 'bg-white/[0.02] border-white/10 text-[#9291ab] hover:border-white/20'
                  }`}
                >
                  <div className="text-xs font-semibold truncate">{shot.title}</div>
                  <div className="text-[10px] text-[#615f78] mt-0.5 truncate">{shot.badge}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-4">
            <h2 className="font-display font-bold text-xl text-white">
              Tentang Aplikasi
            </h2>
            <p className="text-sm text-[#c4c2dd] leading-relaxed whitespace-pre-line">
              {product.desc}
            </p>
          </div>

          {/* Key Features List */}
          <div className="space-y-4">
            <h2 className="font-display font-bold text-xl text-white">
              Fitur Utama & Keunggulan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white/[0.025] border border-white/10 flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-md bg-[#00e0c6]/15 flex items-center justify-center text-[#00e0c6] flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-medium text-[#edecf6] leading-relaxed">
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Specifications / Modules */}
          {product.detailedFeatures && (
            <div className="space-y-4">
              <h2 className="font-display font-bold text-xl text-white">
                Kapabilitas Teknis Lanjutan
              </h2>
              <div className="space-y-3">
                {product.detailedFeatures.map((df, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1"
                  >
                    <h4 className="font-semibold text-xs text-white flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-[#ffb84f]" />
                      {df.title}
                    </h4>
                    <p className="text-xs text-[#9291ab] leading-relaxed">
                      {df.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Requirements */}
          <div className="space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#7c5cff]" />
              Kebutuhan Sistem & Spesifikasi
            </h2>
            <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/10 space-y-3">
              {product.req.map((r, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 text-xs text-[#c4c2dd] pb-2.5 border-b border-white/5 last:border-0 last:pb-0 font-mono"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e0c6]" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Reviews for this App */}
          <div className="space-y-4">
            <h2 className="font-display font-bold text-xl text-white">
              Ulasan Pengguna ({product.reviewsCount})
            </h2>
            <div className="space-y-3">
              {TESTIMONIALS.slice(0, 3).map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-white">{rev.name}</span>
                    <div className="flex items-center gap-0.5 text-[#ffb84f]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#ffb84f]" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#9291ab] leading-relaxed italic">
                    "{rev.text}"
                  </p>
                  <div className="text-[10px] text-[#615f78] font-mono">{rev.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Column (Pricing & Checkout Box) */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <div className="p-6 rounded-3xl bg-[#0e0e1a] border border-white/15 shadow-2xl space-y-6">
            {/* Price Header */}
            <div>
              <div className="text-xs text-[#9291ab] font-medium mb-1">Harga Lisensi Sekali Beli</div>
              <div className="flex items-baseline gap-3">
                <span className="font-mono font-bold text-3xl text-white">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="font-mono text-sm text-[#615f78] line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#00e0c6] mt-1 font-mono font-medium">
                ✓ Termasuk pembaruan versi minor & keamanan selama 1 tahun
              </p>
            </div>

            {/* Action CTAs */}
            <div className="space-y-2.5">
              {isPurchased ? (
                <button
                  onClick={() => startDownloadSimulation(product)}
                  className="w-full gradient-btn py-3.5 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#00e0c6]/20"
                >
                  <Download className="w-4 h-4" />
                  Unduh Installer ({product.fileSize})
                </button>
              ) : (
                <>
                  <button
                    onClick={handleBuyNow}
                    className="w-full gradient-btn py-3.5 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#7c5cff]/30"
                    id="detail-buy-now-btn"
                  >
                    Beli Sekarang
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => addToCart(product.id)}
                    className="w-full py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 font-semibold text-xs text-white flex items-center justify-center gap-2 transition-all"
                    id="detail-add-cart-btn"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Tambah ke Keranjang
                  </button>
                </>
              )}

              <button
                onClick={() => openDemoModal(product)}
                className="w-full py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-xs text-[#9291ab] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-[#00e0c6]" />
                Uji Coba Demo Langsung di Browser
              </button>

              <button
                onClick={() => openWhatsAppChat(`Halo AT Digital Solution, saya tertarik dengan software "${product.name}" (${product.version}) seharga Rp ${product.price.toLocaleString('id-ID')}. Bisakah saya konsultasi lebih lanjut?`)}
                className="w-full py-2.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-xs text-[#25D366] font-semibold flex items-center justify-center gap-1.5 transition-all"
                id="detail-whatsapp-inquiry-btn"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                Tanya Produk via WhatsApp
              </button>
            </div>

            {/* Security Guarantee Pills */}
            <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs text-[#9291ab]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00e0c6] flex-shrink-0" />
                <span>Lisensi resmi terdaftar & kode aktivasi instan</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-[#7c5cff] flex-shrink-0" />
                <span>Dukungan OS: {product.platform}</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#ff4fd8] flex-shrink-0" />
                <span>Garansi 14 hari uang kembali bila tidak kompatibel</span>
              </div>
            </div>
          </div>

          {/* Quick Specs summary card */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 text-xs">
            <h4 className="font-semibold text-white">Ringkasan Berkas</h4>
            <div className="space-y-2 font-mono text-[#9291ab]">
              <div className="flex justify-between">
                <span>Ukuran Berkas:</span>
                <span className="text-white">{product.fileSize}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Unduhan:</span>
                <span className="text-[#00e0c6] font-bold">{product.downloadCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Lisensi:</span>
                <span className="text-white">{product.licenseType.split(' ')[0]} Lifetime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
