import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)] pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between p-3.5 bg-gray-950 text-white rounded-lg shadow-xl border border-pink-500/20 backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
        >
          <div className="flex items-center gap-2.5 text-sm">
            {toast.type === 'pink' || toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-pink-300 shrink-0" />
            )}
            <span className="font-normal text-gray-100">{toast.message}</span>
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors ml-2"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
