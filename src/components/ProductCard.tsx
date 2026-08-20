import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Star, ShoppingBag, Eye, Download, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, featured = false }) => {
  const { navigateTo, addToCart, formatPrice, openDemoModal, purchasedProductIds, startDownloadSimulation } = useApp();
  const isPurchased = purchasedProductIds.includes(product.id);

  const handleCardClick = (e: React.MouseEvent) => {
    // If target is not a button, navigate to detail
    if (!(e.target as HTMLElement).closest('button')) {
      navigateTo({ name: 'detail', productId: product.id });
    }
  };

  return (
    <div
      onClick={handleCardClick}
      id={`card-${product.id}`}
      className={`glass-card-interactive group cursor-pointer p-5 flex flex-col justify-between h-full relative overflow-hidden ${
        featured ? 'border-[#7c5cff]/30 shadow-lg shadow-[#7c5cff]/10' : ''
      }`}
    >
      {/* Subtle top gradient aura */}
      <div
        className="absolute top-0 right-0 w-36 h-36 rounded-full blur-2xl opacity-10 pointer-events-none group-hover:opacity-25 transition-opacity"
        style={{ background: product.accentColor }}
      />

      <div>
        {/* Top Header: Icon & Tags */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-bold text-2xl text-[#0a0a12] shadow-md flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
            style={{ background: product.gradient }}
          >
            {product.iconLetter}
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {product.tag === 'new' && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#00e0c6]/15 text-[#00e0c6] border border-[#00e0c6]/30 tracking-wide uppercase">
                Baru
              </span>
            )}
            {product.tag === 'best' && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#ffb84f]/15 text-[#ffb84f] border border-[#ffb84f]/30 tracking-wide uppercase">
                Terlaris
              </span>
            )}
            {product.tag === 'pro' && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#ff4fd8]/15 text-[#ff4fd8] border border-[#ff4fd8]/30 tracking-wide uppercase">
                Developer Pro
              </span>
            )}

            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/[0.04] text-[#9291ab] border border-white/10">
              {product.cat}
            </span>
          </div>
        </div>

        {/* Product Title & Tagline */}
        <div className="mb-3">
          <h3 className="font-display font-bold text-lg text-white group-hover:text-[#00e0c6] transition-colors flex items-center gap-1">
            {product.name}
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#00e0c6]" />
          </h3>
          <p className="text-xs text-[#9291ab] line-clamp-2 mt-1.5 leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Feature Pill Highlights */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.highlights.slice(0, 2).map((hl, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.03] text-[#c4c2dd] border border-white/5"
            >
              ✓ {hl}
            </span>
          ))}
        </div>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-2 mb-4 text-xs">
          <div className="flex items-center gap-1 text-[#ffb84f]">
            <Star className="w-3.5 h-3.5 fill-[#ffb84f]" />
            <span className="font-bold">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-[#615f78]">·</span>
          <span className="text-[#9291ab]">({product.reviewsCount} ulasan)</span>
          <span className="text-[#615f78]">·</span>
          <span className="text-[#9291ab] font-mono">{product.platform.split(' ')[0]}</span>
        </div>
      </div>

      {/* Bottom Pricing & Action Buttons */}
      <div className="pt-3 border-t border-white/10 mt-auto">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="font-mono font-bold text-base text-white">
              {formatPrice(product.price)}
            </div>
            {product.originalPrice && (
              <div className="text-[11px] text-[#615f78] line-through font-mono">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>
          <span className="text-[11px] text-[#00e0c6] font-mono font-medium">
            {product.version}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Live Interactive Demo Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              openDemoModal(product);
            }}
            className="px-2.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 text-xs font-semibold text-[#c4c2dd] hover:text-white flex items-center justify-center gap-1.5 transition-all"
            title="Coba demo interaktif langsung di browser"
          >
            <Eye className="w-3.5 h-3.5 text-[#00e0c6]" />
            Coba Demo
          </button>

          {/* Add to Cart or Download button */}
          {isPurchased ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                startDownloadSimulation(product);
              }}
              className="px-2.5 py-2 rounded-xl bg-[#00e0c6]/15 hover:bg-[#00e0c6]/25 border border-[#00e0c6]/40 text-xs font-semibold text-[#00e0c6] flex items-center justify-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product.id);
              }}
              className="gradient-btn px-2.5 py-2 rounded-xl text-xs font-bold font-display flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Beli
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
