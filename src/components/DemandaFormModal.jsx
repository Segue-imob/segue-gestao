import { useEffect, useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { ORIGENS, TIPOS, URGENCIAS, todayISO } from '../lib/constants'

const BLANK = {
  origem: 'Inquilino',
  urgencia: 'Baixa',
  tipo: 'Financeiro',
  tipoOutro: '',
  codigo_imovel: '',
  titulo: '',
  descricao: '',
  data_vencimento: todayISO(),
}

// Deriva os campos de tipo a partir do valor salvo no banco: se o valor não
// estiver entre as opções fixas, trata-se de um tipo "Outros" personalizado.
function tipoFieldsFromInitial(initialData) {
  if (!initialData) return { tipo: BLANK.tipo, tipoOutro: '' }
  if (TIPOS.includes(initialData.tipo)) {
    return { tipo: initialData.tipo, tipoOutro: '' }
  }
  return { tipo: 'Outros', tipoOutro: initialData.tipo || '' }
}

export default function DemandaFormModal({ open, onClose, onSave, initialData, saving, prefillDate }) {
  const [form, setForm] = useState(BLANK)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
              origem: initialData.origem,
              urgencia: initialData.urgencia,
              ...tipoFieldsFromInitial(initialData),
              codigo_imovel: initialData.codigo_imovel || '',
              titulo: initialData.titulo,
              descricao: initialData.descricao || '',
              data_vencimento: initialData.data_vencimento,
            }
          : { ...BLANK, data_vencimento: prefillDate || todayISO() }
      )
      setErrors({})
    }
  }, [open, initialData, prefillDate])

  if (!open) return null

  const isEdit = Boolean(initialData)
  const isOutros = form.tipo === 'Outros'

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function validate() {
    const e = {}
    if (!form.titulo.trim()) e.titulo = 'Informe um título para a demanda.'
    if (!form.data_vencimento) e.data_vencimento = 'Informe a data de vencimento.'
    if (isOutros && !form.tipoOutro.trim()) e.tipoOutro = 'Especifique o tipo da demanda.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return

    // O valor final de "tipo" salvo no Supabase é a especificação digitada
    // quando "Outros" é selecionado; caso contrário, é a opção escolhida.
    const payload = {
      origem: form.origem,
      urgencia: form.urgencia,
      tipo: isOutros ? form.tipoOutro.trim() : form.tipo,
      codigo_imovel: form.codigo_imovel.trim() || null,
      titulo: form.titulo,
      descricao: form.descricao,
      data_vencimento: form.data_vencimento,
    }
    onSave(payload)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-segue-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-panel animate-slide-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-segue-stone/30 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-base font-semibold text-segue-black">
              {isEdit ? 'Editar demanda' : 'Nova demanda'}
            </h2>
            {isEdit && (
              <p className="text-xs text-segue-black/40 mt-0.5 font-mono">{initialData.codigo}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="focus-ring rounded-lg p-1.5 text-segue-black/40 hover:bg-segue-stone-pale hover:text-segue-black/70"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {!isEdit && (
            <div>
              <label className="block text-xs font-semibold text-segue-black/55 mb-1.5">Código</label>
              <input
                disabled
                value="Gerado automaticamente ao salvar"
                className="w-full rounded-lg border border-segue-stone bg-segue-stone-pale px-3 py-2 text-sm text-segue-black/40 italic"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-segue-black/55 mb-1.5">
              Código Interno / Imóvel
            </label>
            <input
              value={form.codigo_imovel}
              onChange={(e) => update('codigo_imovel', e.target.value)}
              placeholder="Ex: AP-302, Ed. Royal Beach, Cod 1234"
              className="focus-ring w-full rounded-lg border border-segue-stone px-3 py-2 text-sm text-segue-black placeholder:text-segue-black/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-segue-black/55 mb-1.5">Origem</label>
              <select
                value={form.origem}
                onChange={(e) => update('origem', e.target.value)}
                className="focus-ring w-full rounded-lg border border-segue-stone px-3 py-2 text-sm text-segue-black"
              >
                {ORIGENS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-segue-black/55 mb-1.5">
                Urgência
              </label>
              <select
                value={form.urgencia}
                onChange={(e) => update('urgencia', e.target.value)}
                className="focus-ring w-full rounded-lg border border-segue-stone px-3 py-2 text-sm text-segue-black"
              >
                {URGENCIAS.map((u) => (
                  <option key={u.label} value={u.label}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-segue-black/55 mb-1.5">Tipo</label>
            <select
              value={form.tipo}
              onChange={(e) => update('tipo', e.target.value)}
              className="focus-ring w-full rounded-lg border border-segue-stone px-3 py-2 text-sm text-segue-black"
            >
              {TIPOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {isOutros && (
              <div className="mt-3 animate-fade-in">
                <label className="block text-xs font-semibold text-segue-black/55 mb-1.5">
                  Especifique o Tipo
                </label>
                <input
                  value={form.tipoOutro}
                  onChange={(e) => update('tipoOutro', e.target.value)}
                  placeholder="Digite o tipo da demanda..."
                  className={`focus-ring w-full rounded-lg border px-3 py-2 text-sm text-segue-black placeholder:text-segue-black/40 ${
                    errors.tipoOutro ? 'border-rose-400' : 'border-segue-stone'
                  }`}
                />
                {errors.tipoOutro && (
                  <p className="mt-1 text-xs text-rose-600">{errors.tipoOutro}</p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-segue-black/55 mb-1.5">
              Título / Resumo
            </label>
            <input
              value={form.titulo}
              onChange={(e) => update('titulo', e.target.value)}
              placeholder="Ex: Vazamento no banheiro do apto 302"
              className={`focus-ring w-full rounded-lg border px-3 py-2 text-sm text-segue-black placeholder:text-segue-black/40 ${
                errors.titulo ? 'border-rose-400' : 'border-segue-stone'
              }`}
            />
            {errors.titulo && <p className="mt-1 text-xs text-rose-600">{errors.titulo}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-segue-black/55 mb-1.5">
              Descrição detalhada
            </label>
            <textarea
              value={form.descricao}
              onChange={(e) => update('descricao', e.target.value)}
              rows={4}
              placeholder="Detalhe o contexto, contatos envolvidos e próximos passos..."
              className="focus-ring w-full rounded-lg border border-segue-stone px-3 py-2 text-sm text-segue-black placeholder:text-segue-black/40 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-segue-black/55 mb-1.5">
              Data de vencimento
            </label>
            <input
              type="date"
              value={form.data_vencimento}
              onChange={(e) => update('data_vencimento', e.target.value)}
              className={`focus-ring w-full rounded-lg border px-3 py-2 text-sm text-segue-black ${
                errors.data_vencimento ? 'border-rose-400' : 'border-segue-stone'
              }`}
            />
            {errors.data_vencimento && (
              <p className="mt-1 text-xs text-rose-600">{errors.data_vencimento}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="focus-ring rounded-lg px-4 py-2 text-sm font-medium text-segue-black/70 hover:bg-segue-stone-pale"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="focus-ring inline-flex items-center gap-2 rounded-lg bg-segue-terracotta px-4 py-2 text-sm font-semibold text-segue-cream hover:bg-segue-terracotta-dark disabled:opacity-60"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {isEdit ? 'Salvar alterações' : 'Criar demanda'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
