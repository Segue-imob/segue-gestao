import { CalendarDays, ListChecks, BarChart3 } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'agenda', label: 'Agenda', icon: CalendarDays },
  { id: 'demandas', label: 'Demandas', icon: ListChecks },
  { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
]

export default function Sidebar({ active, onChange, pendentesCount }) {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col shrink-0 bg-segue-black text-segue-cream h-screen sticky top-0">
      <div className="px-6 pt-8 pb-6 border-b border-segue-cream/10">
        <div className="flex items-center gap-3">
          <img
            src="/logo-segue.png"
            alt="Logo Segue Imobiliária"
            className="h-9 w-9 object-contain shrink-0"
          />
          <div>
            <p className="text-segue-cream font-bold leading-tight tracking-tight">SEGUE</p>
            <p className="text-[11px] uppercase tracking-widest text-segue-terracotta font-semibold">
              Gestão
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs text-segue-stone leading-relaxed">Segue Imobiliária</p>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`focus-ring w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-segue-terracotta text-segue-cream shadow-sm'
                  : 'text-segue-stone hover:bg-segue-cream/5 hover:text-segue-cream'
              }`}
            >
              <Icon size={18} strokeWidth={2} className={isActive ? 'text-segue-cream' : ''} />
              <span>{item.label}</span>
              {item.id === 'demandas' && pendentesCount > 0 && (
                <span
                  className={`ml-auto rounded-full text-[11px] font-bold px-2 py-0.5 ${
                    isActive
                      ? 'bg-segue-cream text-segue-terracotta'
                      : 'bg-segue-brown text-segue-cream'
                  }`}
                >
                  {pendentesCount}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="px-6 py-5 border-t border-segue-cream/10">
        <p className="text-[11px] text-segue-stone leading-relaxed">
          SEGUE Gestão &copy; {new Date().getFullYear()}
          <br />
          Controle interno de demandas
        </p>
      </div>
    </aside>
  )
}
