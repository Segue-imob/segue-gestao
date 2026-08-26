import { urgenciaMeta } from '../lib/constants'

// Etiqueta retangular colorida por urgência, usada nas visões Mês, Semana e
// Dia da Agenda. "size" controla a densidade: 'sm' (mês, compacta e trunca
// em 1 linha), 'md' (semana, 2 linhas) e 'lg' (dia, mais respiro e detalhe).
export default function AgendaLabel({ demanda, onClick, size = 'sm' }) {
  const solid = urgenciaMeta(demanda.urgencia).solid
  const codigo = demanda.codigo_imovel || demanda.codigo
  const texto = `${codigo} - ${demanda.titulo}`

  function handleClick(e) {
    e.stopPropagation()
    onClick(demanda)
  }

  if (size === 'lg') {
    return (
      <button
        onClick={handleClick}
        className={`focus-ring block w-full rounded-md px-3 py-2 text-left text-white ${solid} hover:brightness-95 transition`}
      >
        <p className="text-xs font-semibold truncate">{codigo}</p>
        <p className="text-sm font-medium leading-snug line-clamp-2">{demanda.titulo}</p>
      </button>
    )
  }

  if (size === 'md') {
    return (
      <button
        onClick={handleClick}
        title={texto}
        className={`focus-ring block w-full rounded px-2 py-1 text-left text-white ${solid} hover:brightness-95 transition`}
      >
        <p className="text-[11px] font-semibold leading-tight line-clamp-2">{texto}</p>
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      title={texto}
      className={`focus-ring block w-full truncate rounded px-1.5 py-0.5 text-left text-[10px] font-semibold text-white ${solid} hover:brightness-95 transition`}
    >
      {texto}
    </button>
  )
}
