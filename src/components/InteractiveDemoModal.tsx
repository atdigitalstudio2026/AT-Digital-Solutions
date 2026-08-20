import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Play, 
  ShieldCheck, 
  Activity, 
  Check, 
  Send, 
  Zap, 
  Layers, 
  Lock, 
  Sliders, 
  BarChart3, 
  Server, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const InteractiveDemoModal: React.FC = () => {
  const { demoProduct, closeDemoModal, addToCart, navigateTo, formatPrice } = useApp();

  // Local interactive states for the simulated apps
  const [vpnConnected, setVpnConnected] = useState(false);
  const [vpnLatency, setVpnLatency] = useState(14);
  const [activeServer, setActiveServer] = useState('Singapura (SG-01)');

  // Kanban demo state
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Riset kompetitor CRM', col: 'backlog', priority: 'High' },
    { id: 2, title: 'Integrasi WhatsApp Gateway', col: 'in_progress', priority: 'Urgent' },
    { id: 3, title: 'Uji performa 60fps', col: 'done', priority: 'Normal' }
  ]);

  // Analytics demo state
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'users' | 'conversion'>('revenue');
  const [timeRange, setTimeRange] = useState('7_days');

  // API Tester demo state
  const [apiEndpoint, setApiEndpoint] = useState('https://api.atdigitalsolution.com/v1/metrics');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  if (!demoProduct) return null;

  const handleTestApi = () => {
    setIsLoadingApi(true);
    setTimeout(() => {
      setApiResponse(
        JSON.stringify(
          {
            status: 200,
            message: 'AT Digital Solution API Gateway response',
            latency: '18ms',
            timestamp: new Date().toISOString(),
            data: {
              active_users: 14209,
              server_load: '12.4%',
              cache_hit_rate: '99.4%'
            }
          },
          null,
          2
        )
      );
      setIsLoadingApi(false);
    }, 450);
  };

  const moveTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCol = t.col === 'backlog' ? 'in_progress' : t.col === 'in_progress' ? 'done' : 'backlog';
          return { ...t, col: nextCol };
        }
        return t;
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0c0c16] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#121220]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-lg text-[#0a0a12]"
              style={{ background: demoProduct.gradient }}
            >
              {demoProduct.iconLetter}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-white">
                  Demo Interaktif: {demoProduct.name}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00e0c6]/20 text-[#00e0c6] border border-[#00e0c6]/30">
                  Live Sandbox
                </span>
              </div>
              <p className="text-xs text-[#9291ab]">{demoProduct.tagline}</p>
            </div>
          </div>

          <button
            onClick={closeDemoModal}
            className="p-2 rounded-xl text-[#9291ab] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Sandbox Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Specific interactive module based on product ID */}
          {demoProduct.id === 'cipher-vpn' && (
            <div className="p-6 rounded-2xl bg-[#080811] border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div>
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-[#00e0c6]" />
                    Lokasi Node VPN Terpilih
                  </div>
                  <div className="text-xs text-[#9291ab] mt-0.5">WireGuard v2 Protocol · Enkripsi 256-bit</div>
                </div>
                <select
                  value={activeServer}
                  onChange={(e) => setActiveServer(e.target.value)}
                  className="bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Singapura (SG-01)" className="bg-[#0c0c16]">Singapura (SG-01) - 14ms</option>
                  <option value="Jakarta IDC (JKT-04)" className="bg-[#0c0c16]">Jakarta IDC (JKT-04) - 4ms</option>
                  <option value="Tokyo AWS (TYO-02)" className="bg-[#0c0c16]">Tokyo AWS (TYO-02) - 48ms</option>
                  <option value="Frankfurt (FRA-01)" className="bg-[#0c0c16]">Frankfurt (FRA-01) - 160ms</option>
                </select>
              </div>

              {/* Big VPN Toggle Button */}
              <div className="flex flex-col items-center justify-center py-6">
                <button
                  onClick={() => {
                    setVpnConnected(!vpnConnected);
                    setVpnLatency(activeServer.includes('Jakarta') ? 4 : activeServer.includes('Singapura') ? 14 : 52);
                  }}
                  className={`w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-500 shadow-2xl border-4 ${
                    vpnConnected
                      ? 'bg-gradient-to-tr from-[#00e0c6] to-[#7c5cff] border-[#00e0c6] shadow-[#00e0c6]/30 text-[#0a0a12] scale-105'
                      : 'bg-white/5 border-white/20 text-[#9291ab] hover:border-white/40'
                  }`}
                >
                  <Lock className={`w-8 h-8 mb-1 ${vpnConnected ? 'text-[#0a0a12]' : 'text-[#9291ab]'}`} />
                  <span className="font-display font-bold text-xs">
                    {vpnConnected ? 'TERKONEKSI' : 'HUBUNGKAN'}
                  </span>
                </button>

                <div className="mt-4 text-center">
                  <div className="text-xs font-mono text-[#9291ab]">
                    Status:{' '}
                    <span className={vpnConnected ? 'text-[#00e0c6] font-bold' : 'text-[#ffb84f]'}>
                      {vpnConnected ? 'Enkripsi Aktif (10 Gbps Shield)' : 'Terputus (Koneksi Standar)'}
                    </span>
                  </div>
                  {vpnConnected && (
                    <div className="text-xs font-mono text-[#c4c2dd] mt-1">
                      Latensi Ping: <span className="text-[#00e0c6] font-bold">{vpnLatency} ms</span> · IP Virtual: 185.220.101.45
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {demoProduct.id === 'orbit-tasks' && (
            <div className="p-4 rounded-2xl bg-[#080811] border border-white/10 space-y-4">
              <div className="flex items-center justify-between text-xs text-[#9291ab] border-b border-white/10 pb-3">
                <span className="font-semibold text-white">Sprint 24 — Peluncuran V3</span>
                <span>Klik kartu task untuk memindahkan status alur kerja</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Backlog */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-xs font-bold text-[#9291ab] uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Backlog</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10">
                      {tasks.filter((t) => t.col === 'backlog').length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {tasks
                      .filter((t) => t.col === 'backlog')
                      .map((t) => (
                        <div
                          key={t.id}
                          onClick={() => moveTask(t.id)}
                          className="p-2.5 rounded-lg bg-[#141424] border border-white/10 hover:border-[#00e0c6] cursor-pointer transition-all text-xs"
                        >
                          <div className="text-white font-medium">{t.title}</div>
                          <div className="mt-1 text-[10px] text-[#ffb84f] font-mono">Prioritas: {t.priority}</div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* In Progress */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-xs font-bold text-[#7c5cff] uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>In Progress</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#7c5cff]/20">
                      {tasks.filter((t) => t.col === 'in_progress').length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {tasks
                      .filter((t) => t.col === 'in_progress')
                      .map((t) => (
                        <div
                          key={t.id}
                          onClick={() => moveTask(t.id)}
                          className="p-2.5 rounded-lg bg-[#141424] border border-[#7c5cff]/40 hover:border-[#7c5cff] cursor-pointer transition-all text-xs shadow-md shadow-[#7c5cff]/10"
                        >
                          <div className="text-white font-medium">{t.title}</div>
                          <div className="mt-1 text-[10px] text-[#00e0c6] font-mono">⚡ Sedang Dikerjakan</div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Done */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-xs font-bold text-[#00e0c6] uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Selesai (Done)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00e0c6]/20">
                      {tasks.filter((t) => t.col === 'done').length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {tasks
                      .filter((t) => t.col === 'done')
                      .map((t) => (
                        <div
                          key={t.id}
                          onClick={() => moveTask(t.id)}
                          className="p-2.5 rounded-lg bg-[#141424] border border-[#00e0c6]/40 hover:border-[#00e0c6] cursor-pointer transition-all text-xs opacity-80"
                        >
                          <div className="text-white font-medium line-through">{t.title}</div>
                          <div className="mt-1 text-[10px] text-[#00e0c6] font-mono">✓ Verified & Deployed</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {demoProduct.id === 'flux-analytics' && (
            <div className="p-4 rounded-2xl bg-[#080811] border border-white/10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#00e0c6]" />
                  <span className="text-xs font-semibold text-white">Visualisasi Metrik Performa</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedMetric('revenue')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                      selectedMetric === 'revenue' ? 'bg-[#7c5cff] text-white' : 'bg-white/5 text-[#9291ab]'
                    }`}
                  >
                    Revenue
                  </button>
                  <button
                    onClick={() => setSelectedMetric('users')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                      selectedMetric === 'users' ? 'bg-[#7c5cff] text-white' : 'bg-white/5 text-[#9291ab]'
                    }`}
                  >
                    User Baru
                  </button>
                </div>
              </div>

              {/* Simulated Chart Bars */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-end justify-between gap-2 h-40 pt-4 px-2">
                  {[
                    { label: 'Sen', val: 65 },
                    { label: 'Sel', val: 82 },
                    { label: 'Rab', val: 48 },
                    { label: 'Kam', val: 95 },
                    { label: 'Jum', val: 110 },
                    { label: 'Sab', val: 140 },
                    { label: 'Min', val: 165 }
                  ].map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-[#7c5cff] to-[#00e0c6] transition-all duration-500 hover:brightness-125"
                        style={{
                          height: `${(bar.val / 170) * (selectedMetric === 'revenue' ? 100 : 75)}%`
                        }}
                      />
                      <span className="text-[10px] text-[#9291ab] font-mono">{bar.label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-[#9291ab] pt-2 border-t border-white/5 font-mono">
                  <span>Total Periode: {selectedMetric === 'revenue' ? 'Rp 48.950.000' : '3.840 Users'}</span>
                  <span className="text-[#00e0c6]">+28.4% vs Minggu Lalu</span>
                </div>
              </div>
            </div>
          )}

          {demoProduct.id === 'synapse-code' && (
            <div className="p-4 rounded-2xl bg-[#080811] border border-white/10 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs font-mono text-[#00e0c6] focus:outline-none focus:border-[#00e0c6]"
                />
                <button
                  onClick={handleTestApi}
                  disabled={isLoadingApi}
                  className="px-4 py-2 rounded-xl gradient-btn text-xs font-bold font-mono flex items-center gap-1.5"
                >
                  {isLoadingApi ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  SEND
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#030307] border border-white/10 font-mono text-[11px] text-[#a5b4fc] h-48 overflow-y-auto">
                <pre>{apiResponse || '// Klik tombol SEND untuk mengeksekusi request ke REST Gateway...'}</pre>
              </div>
            </div>
          )}

          {/* Fallback general feature walkthrough */}
          {['nexus-crm', 'vortex-suite', 'pulse-automation', 'apex-finance'].includes(demoProduct.id) && (
            <div className="p-6 rounded-2xl bg-[#080811] border border-white/10 space-y-4">
              <h4 className="font-display font-semibold text-sm text-white">
                Fitur Unggulan Siap Pakai di {demoProduct.name}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {demoProduct.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5 text-xs text-[#edecf6]"
                  >
                    <Check className="w-4 h-4 text-[#00e0c6] flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl bg-[#7c5cff]/10 border border-[#7c5cff]/30 text-xs text-[#c4c2dd] flex items-center justify-between">
                <span>Versi saat ini: <strong className="text-white font-mono">{demoProduct.version}</strong></span>
                <span>Ukuran installer: <strong className="text-white font-mono">{demoProduct.fileSize}</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-white/10 bg-[#0f0f1c]">
          <div>
            <div className="font-mono font-bold text-base text-white">
              {formatPrice(demoProduct.price)}
            </div>
            <div className="text-[11px] text-[#9291ab]">{demoProduct.licenseType}</div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                closeDemoModal();
                navigateTo({ name: 'detail', productId: demoProduct.id });
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors"
            >
              Lihat Detail Lengkap
            </button>

            <button
              onClick={() => {
                addToCart(demoProduct.id);
                closeDemoModal();
                navigateTo('/cart');
              }}
              className="flex-1 sm:flex-none gradient-btn px-5 py-2.5 rounded-xl text-xs font-bold font-display shadow-lg shadow-[#7c5cff]/30"
            >
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
