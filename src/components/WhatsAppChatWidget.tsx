import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  CheckCheck, 
  Clock, 
  Phone, 
  Copy, 
  Check, 
  ExternalLink,
  MessageCircle,
  Headphones,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { WHATSAPP_CONFIG, QUICK_WHATSAPP_TOPICS, getWhatsAppUrl, openWhatsAppChat } from '../utils/whatsapp';
import { useApp } from '../context/AppContext';

export const WhatsAppChatWidget: React.FC = () => {
  const { showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [customMessage, setCustomMessage] = useState(WHATSAPP_CONFIG.defaultGreeting);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>('custom_app');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto show subtle tooltip after 3 seconds for first-time visitors
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen && !hasPrompted) {
        setShowTooltip(true);
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [isOpen, hasPrompted]);

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      setShowTooltip(false);
      setHasPrompted(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  };

  const handleSelectTopic = (topic: typeof QUICK_WHATSAPP_TOPICS[0]) => {
    setSelectedTopicId(topic.id);
    setCustomMessage(topic.message);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const textToSend = customMessage.trim() || WHATSAPP_CONFIG.defaultGreeting;
    openWhatsAppChat(textToSend);
    showToast('Membuka WhatsApp Web / Aplikasi WhatsApp...', 'success');
  };

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText(WHATSAPP_CONFIG.displayNumber).catch(() => {});
    setCopiedPhone(true);
    showToast('Nomor WhatsApp berhasil disalin!', 'success');
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Floating Tooltip Callout (When closed) */}
      {!isOpen && showTooltip && (
        <div className="mb-3 animate-bounce-short max-w-xs sm:max-w-sm bg-[#0c0c16]/95 border border-[#25D366]/40 backdrop-blur-xl p-3.5 rounded-2xl shadow-2xl shadow-[#25D366]/20 relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="absolute top-2 right-2 text-[#615f78] hover:text-white p-0.5 rounded-md"
            title="Tutup"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-start gap-3 pr-4">
            <div className="w-8 h-8 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center flex-shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-xs text-white">
                  Konsultasi Online AT Digital
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
              </div>
              <p className="text-[11px] text-[#9291ab] mt-0.5 leading-snug">
                Butuh bantuan software atau diskusi proyek web design? Chat tim konsultan kami sekarang.
              </p>
              <button
                onClick={handleToggle}
                className="mt-2 text-[11px] text-[#25D366] hover:underline font-semibold flex items-center gap-1"
              >
                Mulai Chat WhatsApp <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Arrow pointing down */}
          <div className="absolute -bottom-2 right-6 w-3 h-3 bg-[#0c0c16] border-r border-b border-[#25D366]/40 rotate-45" />
        </div>
      )}

      {/* WhatsApp Chat Popover Window */}
      {isOpen && (
        <div className="mb-4 w-[92vw] sm:w-[380px] max-h-[85vh] bg-[#0c0c16]/98 border border-white/15 rounded-3xl shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#128C7E] to-[#075E54] p-4 text-white flex items-center justify-between relative shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/10 p-0.5 border border-white/20 flex items-center justify-center font-display font-bold text-sm tracking-tight text-white shadow-md">
                  AT
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#075E54]" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-bold text-sm text-white">
                    {WHATSAPP_CONFIG.brandName}
                  </h3>
                  <span className="text-[9px] font-mono uppercase bg-white/20 px-1.5 py-0.5 rounded text-white font-semibold">
                    Official
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-white/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                  <span>Online · Balas {WHATSAPP_CONFIG.averageResponseTime}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleToggle}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Tutup Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Body Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 max-h-[340px] text-xs bg-[#07070c]/60">
            {/* Timestamp Badge */}
            <div className="flex justify-center">
              <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/5 text-[10px] text-[#615f78] font-mono">
                {WHATSAPP_CONFIG.operationalHours}
              </span>
            </div>

            {/* Inbound Agent Message */}
            <div className="flex items-start gap-2.5 max-w-[90%]">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#7c5cff] to-[#00e0c6] flex items-center justify-center text-[#0a0a12] font-display font-bold text-[10px] flex-shrink-0 mt-0.5">
                AT
              </div>
              <div className="p-3 rounded-2xl rounded-tl-sm bg-white/[0.05] border border-white/10 text-white space-y-1.5 shadow-sm">
                <div className="text-[10px] font-semibold text-[#00e0c6]">
                  {WHATSAPP_CONFIG.consultantName}
                </div>
                <p className="text-xs text-[#edecf6] leading-relaxed">
                  Halo! Selamat datang di <strong>AT Digital Solution</strong> 👋.
                </p>
                <p className="text-xs text-[#9291ab] leading-relaxed">
                  Ada yang bisa kami bantu seputar aplikasi, lisensi software, atau kebutuhan pembuatan website/web app bisnis Anda?
                </p>
                <div className="flex items-center justify-end gap-1 text-[9px] text-[#615f78] pt-1">
                  <span>Baru saja</span>
                  <CheckCheck className="w-3 h-3 text-[#25D366]" />
                </div>
              </div>
            </div>

            {/* Topic Suggestions */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#615f78] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#ffb84f]" /> Topik Konsultasi Cepat:
              </div>

              <div className="space-y-1.5">
                {QUICK_WHATSAPP_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleSelectTopic(topic)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 group ${
                      selectedTopicId === topic.id
                        ? 'bg-[#25D366]/15 border-[#25D366] text-white shadow-md'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-[#c4c2dd] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm flex-shrink-0">{topic.icon}</span>
                      <span className="text-[11px] font-medium truncate">
                        {topic.title}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-[#25D366] border border-white/10 flex-shrink-0">
                      {topic.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Input & Direct Action Box */}
          <div className="p-3.5 bg-[#0c0c16] border-t border-white/10 space-y-3">
            <form onSubmit={handleSendMessage} className="space-y-2">
              <div className="relative">
                <textarea
                  ref={inputRef}
                  rows={2}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Ketik pesan konsultasi Anda di sini..."
                  className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#615f78] focus:outline-none focus:border-[#25D366] resize-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-[#07070c] font-display font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#25D366]/25 group"
                id="whatsapp-submit-btn"
              >
                {/* Official WhatsApp SVG icon */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>Mulai Chat di WhatsApp</span>
                <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>

            {/* Hotline Copy Bar */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#9291ab]">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-[#25D366]" />
                <span className="font-mono">{WHATSAPP_CONFIG.displayNumber}</span>
              </div>
              <button
                onClick={handleCopyPhone}
                className="text-[10px] text-[#9291ab] hover:text-white flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10"
                title="Salin nomor WhatsApp"
              >
                {copiedPhone ? (
                  <>
                    <Check className="w-3 h-3 text-[#25D366]" />
                    <span className="text-[#25D366]">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Salin No.</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={handleToggle}
        aria-label="Layanan Chat WhatsApp AT Digital Solution"
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-[#07070c] p-3.5 shadow-2xl shadow-[#25D366]/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center relative group focus:outline-none"
        id="floating-whatsapp-btn"
      >
        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none" />

        {/* Unread badge dot */}
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#ff4fd8] border-2 border-[#07070c] flex items-center justify-center text-[9px] font-bold text-white shadow-sm">
          1
        </span>

        {/* WhatsApp Icon */}
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <svg className="w-7 h-7 fill-white drop-shadow-md" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        )}
      </button>
    </div>
  );
};
