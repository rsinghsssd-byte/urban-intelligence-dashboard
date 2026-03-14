interface ToastProps {
  toast: { message: string; visible: boolean };
}

export default function Toast({ toast }: ToastProps) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] transition-all duration-300 transform ${
        toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl shadow-slate-900/30 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse shrink-0" />
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
    </div>
  );
}
