import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let IconComponent = Info;
        let iconColor = 'text-[#00e0c6]';
        let borderColor = 'border-white/10';

        if (toast.type === 'success') {
          IconComponent = CheckCircle2;
          iconColor = 'text-[#00e0c6]';
          borderColor = 'border-[#00e0c6]/30';
        } else if (toast.type === 'warning') {
          IconComponent = AlertTriangle;
          iconColor = 'text-[#ffb84f]';
          borderColor = 'border-[#ffb84f]/30';
        } else if (toast.type === 'error') {
          IconComponent = XCircle;
          iconColor = 'text-[#ff4fd8]';
          borderColor = 'border-[#ff4fd8]/30';
        }

        return (
          <div
            key={toast.id}
            id={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 bg-[#0f0f18]/95 backdrop-blur-xl border ${borderColor} rounded-xl shadow-2xl text-sm font-medium text-[#edecf6] transition-all duration-300 transform translate-y-0`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <IconComponent className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
              <span className="truncate">{toast.text}</span>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
