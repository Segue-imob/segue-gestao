import { CalendarDays, ListChecks, BarChart3 } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'agenda', label: 'Agenda', icon: CalendarDays },
  { id: 'demandas', label: 'Demandas', icon: ListChecks },
  { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
]

export default function MobileNav({ active, onChange }) {
  return (
    <>
      <header className="md:hidden sticky top-0 z-30 flex items-center gap-2.5 bg-segue-900 px-4 py-3.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-segue-accent text-segue-950 font-extrabold text-sm">
          S
        </div>
        <p className="text-white font-bold tracking-tight">SEGUE Gestão</p>
      </header>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-segue-900 border-t border-white/10 flex">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`focus-ring flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                isActive ? 'text-segue-accent' : 'text-slate-400'
              }`}
            >
              <Icon size={19} />
              {item.label}
            </button>
          )
        })}
      </nav>
    </>
  )
}
