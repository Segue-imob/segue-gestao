import { CalendarDays, ListChecks, BarChart3 } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'agenda', label: 'Agenda', icon: CalendarDays },
  { id: 'demandas', label: 'Demandas', icon: ListChecks },
  { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
]

export default function Sidebar({ active, onChange, pendentesCount }) {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col shrink-0 bg-segue-900 text-slate-200 h-screen sticky top-0">
      <div className="px-6 pt-7 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-segue-accent text-segue-950 font-extrabold text-lg">
            S
          </div>
          <div>
            <p className="text-white font-bold leading-tight tracking-tight">SEGUE</p>
            <p className="text-[11px] uppercase tracking-widest text-segue-400 font-semibold">
              Gestão
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs text-slate-400 leading-relaxed">Segue Imobiliária</p>
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
                  ? 'bg-segue-800 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} strokeWidth={2} className={isActive ? 'text-segue-accent' : ''} />
              <span>{item.label}</span>
              {item.id === 'demandas' && pendentesCount > 0 && (
                <span className="ml-auto rounded-full bg-segue-accent/90 text-segue-950 text-[11px] font-bold px-2 py-0.5">
                  {pendentesCount}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="px-6 py-5 border-t border-white/10">
        <p className="text-[11px] text-slate-500 leading-relaxed">
          SEGUE Gestão &copy; {new Date().getFullYear()}
          <br />
          Controle interno de demandas
        </p>
      </div>
    </aside>
  )
}
