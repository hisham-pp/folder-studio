"use client";

import { useEffect } from "react";

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const typeStyles = {
    success: 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200 shadow-emerald-900/30',
    info: 'bg-cyan-950/90 border-cyan-500/60 text-cyan-200 shadow-cyan-900/30',
    warning: 'bg-amber-950/90 border-amber-500/60 text-amber-200 shadow-amber-900/30',
    error: 'bg-red-950/90 border-red-500/60 text-red-200 shadow-red-900/30',
  };

  const icons = {
    success: '✓',
    info: 'ℹ',
    warning: '⚠',
    error: '✕',
  };

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-xl transition-all duration-300 animate-slideUp text-xs font-medium ${typeStyles[toast.type]}`}
    >
      <div className="flex items-center gap-2.5">
        <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold bg-white/10 text-xs">
          {icons[toast.type]}
        </span>
        <span>{toast.text}</span>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-white/60 hover:text-white transition-colors text-sm font-bold pl-2"
      >
        ✕
      </button>
    </div>
  );
}
