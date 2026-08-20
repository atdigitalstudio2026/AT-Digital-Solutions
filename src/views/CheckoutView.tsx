import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PAYMENT_METHODS } from '../data/products';
import { 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  Check, 
  QrCode, 
  CreditCard, 
  Building2, 
  Smartphone, 
  Loader2,
  ChevronRight,
  Info
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const { 
    cart, 
    cartTotal, 
    getProductById, 
    formatPrice, 
    user, 
    addPurchasedOrder, 
    navigateTo,
    showToast
  } = useApp();

  const [buyerName, setBuyerName] = useState(user?.name || 'Daffa Pratama');
  const [buyerEmail, setBuyerEmail] = useState(user?.email || 'daffa.pratama@atdigitalsolution.com');
  const [buyerPhone, setBuyerPhone] = useState('081289218492');
  const [selectedMethodId, setSelectedMethodId] = useState('qris');
  const [isProcessing, setIsProcessing] = useState(false);

  if (cart.length === 0) {
    navigateTo('/cart');
    return null;
  }

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!buyerName.trim() || !buyerEmail.trim()) {
      showToast('Mohon lengkapi nama dan email pembeli.', 'warning');
      return;
    }

    setIsProcessing(true);

    const selectedMethod = PAYMENT_METHODS.find((m) => m.id === selectedMethodId);
    const methodName = selectedMethod?.label || 'QRIS Realtime';

    // Simulate instant payment gateway handshake
    setTimeout(() => {
      const order = addPurchasedOrder(cart, methodName);
      setIsProcessing(false);
      showToast('Pembayaran berhasil dikonfirmasi!', 'success');
      navigateTo({ name: 'success', orderId: order.id });
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">
            Konfirmasi & Pembayaran
          </h1>
          <p className="text-xs text-[#9291ab] mt-0.5">
            Lengkapi data penerima lisensi dan pilih metode pembayaran resmi.
          </p>
        </div>
        <button
          onClick={() => navigateTo('/cart')}
          className="text-xs text-[#9291ab] hover:text-white flex items-center gap-1 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Ubah Keranjang
        </button>
      </div>

      <form onSubmit={handleProcessPayment} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Form & Payment methods */}
        <div className="lg:col-span-2 space-y-6">
          {/* Buyer Details */}
          <div className="p-6 rounded-2xl bg-[#0c0c16] border border-white/10 space-y-4">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#7c5cff]/20 text-[#7c5cff] text-xs font-mono flex items-center justify-center font-bold">
                1
              </span>
              Data Penerima Lisensi
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#9291ab] block mb-1.5">
                  Nama Lengkap / Perusahaan
                </label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#615f78] focus:outline-none focus:border-[#7c5cff]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#9291ab] block mb-1.5">
                  Alamat Email (Pengiriman Lisensi)
                </label>
                <input
                  type="email"
                  required
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="budi@perusahaan.com"
                  className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#615f78] focus:outline-none focus:border-[#7c5cff]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[#9291ab] block mb-1.5">
                  Nomor WhatsApp / Kontak (Notifikasi Aktivasi)
                </label>
                <input
                  type="tel"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="08123456789"
                  className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#615f78] focus:outline-none focus:border-[#7c5cff]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="p-6 rounded-2xl bg-[#0c0c16] border border-white/10 space-y-4">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#00e0c6]/20 text-[#00e0c6] text-xs font-mono flex items-center justify-center font-bold">
                2
              </span>
              Pilih Metode Pembayaran
            </h3>

            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = selectedMethodId === method.id;
                return (
                  <div
                    key={method.id}
                    onClick={() => setSelectedMethodId(method.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-4 ${
                      isSelected
                        ? 'bg-[#7c5cff]/10 border-[#7c5cff] shadow-md shadow-[#7c5cff]/10'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="pt-0.5">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-[#00e0c6]' : 'border-white/30'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-[#00e0c6]" />}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-xs text-white">
                          {method.label}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#00e0c6] border border-white/10">
                          {method.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#9291ab] mt-1 leading-relaxed">
                        {method.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Submit */}
        <div className="space-y-4 lg:sticky lg:top-24">
          <div className="p-6 rounded-3xl bg-[#0e0e1a] border border-white/15 space-y-6 shadow-xl">
            <h3 className="font-display font-bold text-base text-white">
              Ringkasan Pesanan
            </h3>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cart.map((item) => {
                const p = getProductById(item.id);
                if (!p) return null;
                return (
                  <div key={item.id} className="flex justify-between items-start text-xs">
                    <div className="min-w-0 pr-2">
                      <div className="text-white font-medium truncate">{p.name}</div>
                      <div className="text-[11px] text-[#615f78] font-mono">
                        {item.qty} × {formatPrice(p.price)}
                      </div>
                    </div>
                    <div className="font-mono text-white font-semibold">
                      {formatPrice(p.price * item.qty)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2 text-xs font-mono text-[#9291ab]">
              <div className="flex justify-between">
                <span>Total Item:</span>
                <span className="text-white">{cart.reduce((s, i) => s + i.qty, 0)} Lisensi</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Transaksi:</span>
                <span className="text-[#00e0c6]">Rp 0 (Bebas Biaya)</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-white/5 text-sm">
                <span className="font-display font-bold text-white">Total Tagihan:</span>
                <span className="font-mono font-bold text-xl text-white">
                  {formatPrice(cartTotal)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full gradient-btn py-3.5 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#7c5cff]/30 disabled:opacity-50"
              id="checkout-pay-btn"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memverifikasi Pembayaran...
                </>
              ) : (
                <>
                  Bayar Sekarang
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#615f78]">
              <Lock className="w-3 h-3 text-[#00e0c6]" /> Enkripsi Transaksi 256-Bit SSL Terlindungi
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
