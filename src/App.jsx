import { useCallback, useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import MobileNav from './components/MobileNav'
import Toast from './components/Toast'
import DemandaFormModal from './components/DemandaFormModal'
import Agenda from './pages/Agenda'
import Demandas from './pages/Demandas'
import Relatorios from './pages/Relatorios'
import { supabase } from './lib/supabaseClient'

export default function App() {
  const [tab, setTab] = useState('agenda')
  const [demandas, setDemandas] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toasts, setToasts] = useState([])

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [prefillDate, setPrefillDate] = useState(null)

  const pushToast = useCallback((message, type = 'success') => {
    const id = crypto.randomUUID()
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 4000)
  }, [])

  const fetchDemandas = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('demandas')
      .select('*')
      .order('data_vencimento', { ascending: true })

    if (error) {
      pushToast('Não foi possível carregar as demandas. Verifique a conexão com o Supabase.', 'error')
      console.error(error)
    } else {
      setDemandas(data || [])
    }
    setLoading(false)
  }, [pushToast])

  useEffect(() => {
    fetchDemandas()

    const channel = supabase
      .channel('demandas-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'demandas' }, () => {
        fetchDemandas()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchDemandas])

  function openNovaDemanda(date) {
    setEditing(null)
    setPrefillDate(date || null)
    setFormOpen(true)
  }

  function openEditDemanda(demanda) {
    setEditing(demanda)
    setPrefillDate(null)
    setFormOpen(true)
  }

  async function handleSave(form) {
    setSaving(true)
    if (editing) {
      const { error } = await supabase.from('demandas').update(form).eq('id', editing.id)
      setSaving(false)
      if (error) {
        pushToast('Erro ao salvar alterações da demanda.', 'error')
        console.error(error)
        return
      }
      pushToast('Demanda atualizada com sucesso.')
    } else {
      const { error } = await supabase.from('demandas').insert([{ ...form, status: 'Pendente' }])
      setSaving(false)
      if (error) {
        pushToast('Erro ao criar a demanda.', 'error')
        console.error(error)
        return
      }
      pushToast('Demanda criada com sucesso.')
    }
    setFormOpen(false)
    fetchDemandas()
  }

  async function handleDelete(demanda) {
    const { error } = await supabase.from('demandas').delete().eq('id', demanda.id)
    if (error) {
      pushToast('Erro ao excluir a demanda.', 'error')
      console.error(error)
      return
    }
    pushToast('Demanda excluída.')
    fetchDemandas()
  }

  async function handleStatusChange(demanda, status) {
    setDemandas((prev) => prev.map((d) => (d.id === demanda.id ? { ...d, status } : d)))
    const { error } = await supabase.from('demandas').update({ status }).eq('id', demanda.id)
    if (error) {
      pushToast('Erro ao atualizar o status.', 'error')
      console.error(error)
      fetchDemandas()
      return
    }
    pushToast(`Status atualizado para "${status}".`)
  }

  const pendentesCount = demandas.filter((d) => d.status === 'Pendente').length

  return (
    <div className="min-h-screen flex bg-segue-cream">
      <Sidebar active={tab} onChange={setTab} pendentesCount={pendentesCount} />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileNav active={tab} onChange={setTab} />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6 max-w-7xl w-full mx-auto">
          {tab === 'agenda' && (
            <Agenda demandas={demandas} onOpenDemanda={openEditDemanda} onNovaDemanda={openNovaDemanda} />
          )}
          {tab === 'demandas' && (
            <Demandas
              demandas={demandas}
              loading={loading}
              onNovaDemanda={openNovaDemanda}
              onEditDemanda={openEditDemanda}
              onDeleteDemanda={handleDelete}
              onStatusChange={handleStatusChange}
            />
          )}
          {tab === 'relatorios' && <Relatorios demandas={demandas} />}
        </main>
      </div>

      <DemandaFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initialData={editing}
        saving={saving}
        prefillDate={prefillDate}
      />

      <Toast toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
    </div>
  )
}
