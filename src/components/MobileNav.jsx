import { CalendarDays, ListChecks, BarChart3 } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'agenda', label: 'Agenda', icon: CalendarDays },
  { id: 'demandas', label: 'Demandas', icon: ListChecks },
  { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
]

export default function MobileNav({ active, onChange }) {
  return (
    <>
      <header className="md:hidden sticky top-0 z-30 flex flex-row items-center gap-2.5 bg-segue-black px-4 py-3.5">
        <img src="/logo-segue.png" alt="Logo Segue Imobiliária" className="h-7 w-auto object-contain shrink-0" />
        <p className="text-segue-cream font-bold tracking-tight">SEGUE Gestão</p>
      </header>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-segue-black border-t border-segue-cream/10 flex">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`focus-ring flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                isActive ? 'text-segue-terracotta' : 'text-segue-stone'
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
