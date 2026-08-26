import { ChevronDown } from 'lucide-react'
import { STATUS_LIST, STATUS_META } from '../lib/constants'

// Select estilizado como pill colorido, reutilizado na tabela e nos cards do Kanban
// para alterar rapidamente o status de uma demanda diretamente no Supabase.
export default function StatusDropdown({ value, onChange, className = '' }) {
  const meta = STATUS_META[value]
  return (
    <div className="relative inline-block">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`focus-ring appearance-none rounded-full py-1 pl-2.5 pr-7 text-xs font-medium cursor-pointer ${meta.badge} ${className}`}
      >
        {STATUS_LIST.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
    </div>
  )
}
