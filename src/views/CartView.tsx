import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  ShieldCheck, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

export const CartView: React.FC = () => {
  const { 
    cart, 
    getProductById, 
    removeFromCart, 
    updateCartQty, 
    cartSubtotal, 
    cartDiscount, 
    cartTotal, 
    navigateTo, 
    formatPrice,
    applyDiscountCode,
    discountCode,
    appliedDiscountPercent
  } = useApp();

  const [inputCode, setInputCode] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    applyDiscountCode(inputCode);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto text-[#9291ab]">
          <ShoppingBag className="w-10 h-10 opacity-60" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display font-bold text-2xl text-white">Keranjang Belanja Kosong</h2>
          <p className="text-xs sm:text-sm text-[#9291ab] max-w-sm mx-auto">
            Anda belum menambahkan software ke dalam keranjang. Temukan aplikasi bisnis terbaik di katalog kami.
          </p>
        </div>
        <button
          onClick={() => navigateTo('/catalog')}
          className="gradient-btn px-8 py-3 rounded-xl font-display font-bold text-xs shadow-lg shadow-[#7c5cff]/30 inline-flex items-center gap-2"
        >
          Jelajahi Katalog Aplikasi
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">
            Keranjang Belanja
          </h1>
          <p className="text-xs text-[#9291ab] mt-0.5">
            Periksa kembali software dan jumlah lisensi yang ingin Anda beli.
          </p>
        </div>
        <button
          onClick={() => navigateTo('/catalog')}
          className="text-xs text-[#00e0c6] hover:underline flex items-center gap-1 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Tambah Aplikasi Lain
        </button>
      </div>

      {/* Cart Grid: Items List (Left) & Order Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map((item) => {
            const product = getProductById(item.id);
            if (!product) return null;

            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#0c0c16] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-white/20"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg text-[#0a0a12] flex-shrink-0"
                    style={{ background: product.gradient }}
                  >
                    {product.iconLetter}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-bold text-sm text-white truncate">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-[#9291ab] font-mono mt-0.5">
                      {product.cat} · Lisensi Lifetime · {product.platform.split(' ')[0]}
                    </p>
                  </div>
                </div>

                {/* Quantity & Price Controls */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl p-1">
                    <button
                      onClick={() => updateCartQty(item.id, -1)}
                      className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-white text-xs transition-colors"
                      title="Kurangi lisensi"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono text-xs font-bold text-white px-2 min-w-[20px] text-center">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateCartQty(item.id, 1)}
                      className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-white text-xs transition-colors"
                      title="Tambah lisensi"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right min-w-[110px]">
                    <div className="font-mono font-bold text-sm text-white">
                      {formatPrice(product.price * item.qty)}
                    </div>
                    {item.qty > 1 && (
                      <div className="text-[10px] text-[#615f78] font-mono">
                        @{formatPrice(product.price)}
                      </div>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 rounded-lg text-[#615f78] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Hapus dari keranjang"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Security Banner */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3 text-xs text-[#9291ab]">
            <ShieldCheck className="w-4 h-4 text-[#00e0c6] flex-shrink-0" />
            <span>Setiap lisensi dijamin original 100% dan dikirimkan instan ke dashboard akun Anda.</span>
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-[#0e0e1a] border border-white/15 space-y-6 shadow-xl">
            <h3 className="font-display font-bold text-base text-white">
              Ringkasan Pembelian
            </h3>

            {/* Price Calculations */}
            <div className="space-y-3 text-xs text-[#9291ab] font-mono">
              <div className="flex justify-between">
                <span>Subtotal Software ({cart.length} jenis)</span>
                <span className="text-white font-semibold">{formatPrice(cartSubtotal)}</span>
              </div>

              {appliedDiscountPercent > 0 && (
                <div className="flex justify-between text-[#00e0c6]">
                  <span>Kupon Diskon ({appliedDiscountPercent}%)</span>
                  <span>- {formatPrice(cartDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Biaya Platform & PPN</span>
                <span className="text-[#00e0c6] font-bold">GRATIS (Rp 0)</span>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between items-baseline text-sm">
                <span className="font-display font-bold text-white">Total Tagihan</span>
                <span className="font-mono font-bold text-xl text-white">
                  {formatPrice(cartTotal)}
                </span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2 border-t border-white/5">
              <label className="text-[11px] text-[#9291ab] font-semibold block">
                Kode Kupon Promo / Diskon
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Contoh: DISKON20"
                  className="flex-1 bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-[#615f78] uppercase focus:outline-none focus:border-[#7c5cff]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
                >
                  Pasang
                </button>
              </div>
              <div className="text-[10px] text-[#615f78] font-mono">
                Tips: Coba gunakan kode <strong className="text-[#00e0c6]">DISKON20</strong> untuk potongan 20%
              </div>
            </form>

            {/* Checkout CTA */}
            <button
              onClick={() => navigateTo('/checkout')}
              className="w-full gradient-btn py-3.5 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#7c5cff]/30"
              id="cart-checkout-btn"
            >
              Lanjutkan ke Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
