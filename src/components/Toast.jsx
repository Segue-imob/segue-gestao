import { CheckCircle2, XCircle, X } from 'lucide-react'

export default function Toast({ toasts, onDismiss }) {
  if (!toasts.length) return null

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-slide-in flex items-start gap-3 rounded-lg px-4 py-3 shadow-panel ring-1 ${
            t.type === 'error'
              ? 'bg-red-50 ring-red-200 text-red-800'
              : 'bg-white ring-segue-stone text-segue-black'
          }`}
        >
          {t.type === 'error' ? (
            <XCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
          ) : (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-segue-terracotta" />
          )}
          <p className="text-sm leading-snug flex-1">{t.message}</p>
          <button
            onClick={() => onDismiss(t.id)}
            className="text-segue-black/40 hover:text-segue-black/70 focus-ring rounded"
            aria-label="Fechar notificação"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
