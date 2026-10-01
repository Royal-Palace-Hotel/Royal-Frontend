import { useCallback, useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { adminApi, downloadCsv, PageMeta, queryString } from '@/utils/api'
import {
  Button, Card, Drawer, EmptyState, ErrorBanner, Field, MESSAGE_STATUS, Pagination,
  SearchInput, Select, Spinner, StatusBadge, Toolbar,
} from './ui'

const TYPE_OPTIONS = [
  { value: '', label: 'Tous les types' },
  { value: 'contact', label: 'Contact' },
  { value: 'event', label: 'Devis événement' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'new', label: 'Nouveaux' },
  { value: 'read', label: 'Lus' },
  { value: 'replied', label: 'Répondus' },
  { value: 'archived', label: 'Archivés' },
]

const dateTime = (value?: string | null) =>
  value ? new Date(value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '—'
const date = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString('fr-FR') : '—'

export default function MessagesPanel() {
  const [rows, setRows] = useState<any[]>([])
  const [meta, setMeta] = useState<PageMeta>()
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [detail, setDetail] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => { setDebounced(search); setPage(1) }, 350)
    return () => clearTimeout(timer)
  }, [search])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const response = await adminApi.get<any[]>(
      `/admin/contact-messages${queryString({ q: debounced, type, status, page })}`,
    )
    if (response.error) setError(response.error)
    else { setRows(response.data || []); setMeta(response.meta) }
    setLoading(false)
  }, [debounced, type, status, page])

  useEffect(() => { void load() }, [load])

  /** Ouvrir un message non lu le marque automatiquement comme lu. */
  async function openDetail(row: any) {
    setDetail(row)
    if (row.status === 'new') {
      await adminApi.patch(`/admin/contact-messages/${row.id}`, { status: 'read' })
      setDetail({ ...row, status: 'read' })
      await load()
    }
  }

  async function setStatusOf(id: string, next: string) {
    const response = await adminApi.patch(`/admin/contact-messages/${id}`, { status: next })
    if (response.error) { setError(response.error); return }
    setDetail((current: any) => (current && current.id === id ? { ...current, status: next } : current))
    await load()
  }

  async function remove(row: any) {
    if (!window.confirm('Supprimer définitivement ce message ?')) return
    const response = await adminApi.delete(`/admin/contact-messages/${row.id}`)
    if (response.error) { setError(response.error); return }
    setDetail(null)
    await load()
  }

  async function exportCsv() {
    const message = await downloadCsv(
      `/admin/contact-messages/export${queryString({ q: debounced, type, status })}`,
      'messages.csv',
    )
    if (message) setError(message)
  }

  return (
    <>
      {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}

      <Toolbar>
        <SearchInput value={search} onChange={setSearch} placeholder="Nom, e-mail, sujet, message…" />
        <Select label="Filtrer par type" value={type}
          onChange={(value) => { setType(value); setPage(1) }} options={TYPE_OPTIONS} />
        <Select label="Filtrer par statut" value={status}
          onChange={(value) => { setStatus(value); setPage(1) }} options={STATUS_OPTIONS} />
        <div className="ml-auto">
          <Button onClick={exportCsv}>
            <span className="inline-flex items-center gap-2"><Download size={15} aria-hidden="true" /> Exporter en CSV</span>
          </Button>
        </div>
      </Toolbar>

      <Card title="Messages reçus">
        {loading ? <Spinner /> : rows.length === 0 ? (
          <EmptyState>Aucun message ne correspond à ces critères.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Expéditeur</th>
                  <th className="px-4 py-3 font-medium">Sujet</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Reçu le</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row) => (
                  <tr key={row.id} className="cursor-pointer hover:bg-gray-50" onClick={() => void openDetail(row)}>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${row.status === 'new' ? 'text-charcoal' : 'text-gray-700'}`}>
                        {row.name}
                      </span>
                      <span className="block text-xs text-gray-500">{row.email}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{row.subject || 'Sans sujet'}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {row.type === 'event' ? 'Devis événement' : 'Contact'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">{dateTime(row.createdAt)}</td>
                    <td className="px-4 py-3"><StatusBadge status={row.status} map={MESSAGE_STATUS} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination meta={meta} onPage={setPage} />
      </Card>

      {detail && (
        <Drawer title={detail.type === 'event' ? 'Demande de devis' : 'Message de contact'}
          onClose={() => setDetail(null)}
          footer={
            <div className="flex flex-wrap gap-2">
              <Button variant="gold" onClick={() => void setStatusOf(detail.id, 'replied')}>
                Marquer comme répondu
              </Button>
              <Button onClick={() => void setStatusOf(detail.id, 'archived')}>Archiver</Button>
              <Button variant="danger" onClick={() => void remove(detail)}>Supprimer</Button>
            </div>
          }>
          <div className="mb-4"><StatusBadge status={detail.status} map={MESSAGE_STATUS} /></div>
          <dl className="divide-y divide-gray-100">
            <Field label="Nom">{detail.name}</Field>
            <Field label="E-mail">
              <a href={`mailto:${detail.email}?subject=Re: ${encodeURIComponent(detail.subject || '')}`}
                className="text-gold-700 hover:underline">{detail.email}</a>
            </Field>
            <Field label="Téléphone">
              {detail.phone
                ? <a href={`tel:${detail.phone}`} className="text-gold-700 hover:underline">{detail.phone}</a>
                : null}
            </Field>
            <Field label="Sujet">{detail.subject}</Field>
            {detail.type === 'event' && (
              <>
                <Field label="Date de l’événement">{date(detail.eventDate)}</Field>
                <Field label="Nombre d’invités">{detail.guestCount}</Field>
              </>
            )}
            <Field label="Reçu le">{dateTime(detail.createdAt)}</Field>
          </dl>
          <div className="mt-4">
            <p className="text-xs uppercase tracking-wider text-gray-500">Message</p>
            <p className="mt-2 whitespace-pre-wrap border border-gray-200 bg-gray-50 p-4 text-sm text-charcoal">
              {detail.message}
            </p>
          </div>
        </Drawer>
      )}
    </>
  )
}
