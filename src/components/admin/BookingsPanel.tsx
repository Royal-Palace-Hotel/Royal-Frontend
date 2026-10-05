import { useCallback, useEffect, useState } from 'react'
import { Download, Phone, Plus } from 'lucide-react'
import { adminApi, downloadCsv, PageMeta, queryString } from '@/utils/api'
import NewBookingDrawer from './NewBookingDrawer'
import {
  BOOKING_STATUS, Button, Card, Drawer, EmptyState, ErrorBanner, Field, Notice, Pagination,
  SearchInput, Select, Spinner, StatusBadge, Toolbar,
} from './ui'

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmées' },
  { value: 'cancelled', label: 'Annulées' },
]

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Trier : plus récentes' },
  { value: 'checkIn', label: 'Trier : date d’arrivée' },
  { value: 'guestName', label: 'Trier : nom du client' },
  { value: 'status', label: 'Trier : statut' },
]

const STATUS_DONE: Record<string, string> = {
  confirmed: 'Réservation confirmée',
  cancelled: 'Réservation annulée',
  pending: 'Réservation remise en attente',
}

/**
 * Le back-end dit si l'e-mail est réellement parti. Un envoi peut échouer sans
 * empêcher le changement de statut : l'admin doit le voir pour prévenir le
 * client lui-même, d'où les trois cas distincts plutôt qu'un « enregistré ».
 */
function noticeFor(status: string, notification?: 'not-due' | 'sent' | 'failed') {
  const done = STATUS_DONE[status] ?? 'Statut mis à jour'
  if (notification === 'sent') return `${done}. Client prévenu par e-mail.`
  if (notification === 'failed') {
    return `${done}, mais l’e-mail n’a pas pu être envoyé — prévenez le client vous-même.`
  }
  return `${done}.`
}

const date = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'
const dateTime = (value?: string | null) =>
  value ? new Date(value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '—'

export default function BookingsPanel() {
  const [rows, setRows] = useState<any[]>([])
  const [meta, setMeta] = useState<PageMeta>()
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('createdAt')
  const [page, setPage] = useState(1)
  const [detail, setDetail] = useState<any>(null)
  const [creating, setCreating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  // Le bandeau de confirmation s'effface seul : il rend compte d'une action
  // passée, il ne doit pas rester en haut de la liste indéfiniment.
  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(''), 8000)
    return () => clearTimeout(timer)
  }, [notice])

  // La recherche part 350 ms après la dernière frappe, pas à chaque caractère.
  useEffect(() => {
    const timer = setTimeout(() => { setDebounced(search); setPage(1) }, 350)
    return () => clearTimeout(timer)
  }, [search])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const query = queryString({
      q: debounced, status, sort, page,
      order: sort === 'checkIn' || sort === 'guestName' ? 'asc' : 'desc',
    })
    const response = await adminApi.get<any[]>(`/admin/bookings${query}`)
    if (response.error) setError(response.error)
    else { setRows(response.data || []); setMeta(response.meta) }
    setLoading(false)
  }, [debounced, status, sort, page])

  useEffect(() => { void load() }, [load])

  async function openDetail(id: string) {
    const response = await adminApi.get<any>(`/admin/bookings/${id}`)
    if (response.error) setError(response.error)
    else setDetail(response.data)
  }

  async function setStatusOf(id: string, next: string) {
    const response = await adminApi.patch<any>(`/admin/bookings/${id}`, { status: next })
    if (response.error) { setError(response.error); return }
    setNotice(noticeFor(next, response.data?.notification))
    setDetail((current: any) => (current && current.id === id ? { ...current, status: next } : current))
    await load()
  }

  async function exportCsv() {
    const message = await downloadCsv(
      `/admin/bookings/export${queryString({ q: debounced, status })}`,
      'reservations.csv',
    )
    if (message) setError(message)
  }

  return (
    <>
      {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}
      {notice && <Notice message={notice} />}

      <Toolbar>
        <SearchInput value={search} onChange={setSearch} placeholder="Nom, e-mail, téléphone…" />
        <Select label="Filtrer par statut" value={status}
          onChange={(value) => { setStatus(value); setPage(1) }} options={STATUS_OPTIONS} />
        <Select label="Trier" value={sort} onChange={setSort} options={SORT_OPTIONS} />
        <div className="ml-auto flex items-center gap-2">
          <Button variant="gold" onClick={() => setCreating(true)}>
            <span className="inline-flex items-center gap-2">
              <Plus size={15} aria-hidden="true" /> Nouvelle réservation
            </span>
          </Button>
          <Button onClick={exportCsv}>
            <span className="inline-flex items-center gap-2"><Download size={15} aria-hidden="true" /> Exporter en CSV</span>
          </Button>
        </div>
      </Toolbar>

      <Card title="Réservations">
        {loading ? <Spinner /> : rows.length === 0 ? (
          <EmptyState>Aucune réservation ne correspond à ces critères.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Chambre</th>
                  <th className="px-4 py-3 font-medium">Séjour</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <button onClick={() => void openDetail(row.id)}
                        className="text-left font-medium text-charcoal hover:text-gold-700 hover:underline">
                        {row.guestName}
                      </button>
                      <p className="text-xs text-gray-500">
                        {row.guestEmail || row.guestPhone || '—'}
                      </p>
                      {row.source === 'admin' && (
                        <span title="Saisie au back-office"
                          className="mt-1 inline-flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-600">
                          <Phone size={11} aria-hidden="true" /> Hors site
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{row.roomName || '—'}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                      {date(row.checkIn)} → {date(row.checkOut)}
                      <span className="block text-xs text-gray-400">
                        {row.nights} nuit(s) · {row.rooms} chambre(s)
                      </span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={row.status} map={BOOKING_STATUS} /></td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {row.status !== 'confirmed' && (
                        <button onClick={() => void setStatusOf(row.id, 'confirmed')}
                          className="mr-3 text-green-700 hover:underline">Confirmer</button>
                      )}
                      {row.status !== 'cancelled' && (
                        <button onClick={() => void setStatusOf(row.id, 'cancelled')}
                          className="text-red-700 hover:underline">Annuler</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination meta={meta} onPage={setPage} />
      </Card>

      {creating && (
        <NewBookingDrawer
          onClose={() => setCreating(false)}
          onCreated={(guestName) => {
            setCreating(false)
            setNotice(`Réservation enregistrée pour ${guestName}.`)
            void load()
          }}
        />
      )}

      {detail && (
        <Drawer title="Détail de la réservation" onClose={() => setDetail(null)} footer={
          <div className="flex flex-wrap gap-2">
            <Button variant="gold" onClick={() => void setStatusOf(detail.id, 'confirmed')}>Confirmer</Button>
            <Button onClick={() => void setStatusOf(detail.id, 'pending')}>Remettre en attente</Button>
            <Button variant="danger" onClick={() => void setStatusOf(detail.id, 'cancelled')}>Annuler</Button>
          </div>
        }>
          <div className="mb-4"><StatusBadge status={detail.status} map={BOOKING_STATUS} /></div>
          <dl className="divide-y divide-gray-100">
            <Field label="Client">{detail.guestName}</Field>
            <Field label="E-mail">
              {detail.guestEmail
                ? <a href={`mailto:${detail.guestEmail}`} className="text-gold-700 hover:underline">{detail.guestEmail}</a>
                : <span className="text-gray-400">Non renseigné</span>}
            </Field>
            <Field label="Origine">
              {detail.source === 'admin' ? 'Saisie au back-office' : 'Site web'}
            </Field>
            <Field label="Téléphone">
              {detail.guestPhone
                ? <a href={`tel:${detail.guestPhone}`} className="text-gold-700 hover:underline">{detail.guestPhone}</a>
                : null}
            </Field>
            <Field label="Chambre">{detail.roomName || detail.roomSlug}</Field>
            <Field label="Arrivée">{date(detail.checkIn)}</Field>
            <Field label="Départ">{date(detail.checkOut)}</Field>
            <Field label="Durée">{detail.nights} nuit(s)</Field>
            <Field label="Occupation">
              {detail.rooms} chambre(s) · {detail.adults} adulte(s)
              {detail.children ? `, ${detail.children} enfant(s)` : ''}
            </Field>
            <Field label="Total estimé">
              {detail.estimatedTotal} {detail.roomCurrency || 'EUR'}
              <span className="block text-xs text-gray-500">au prix catalogue de la chambre</span>
            </Field>
            <Field label="Réservée le">{dateTime(detail.createdAt)}</Field>
            <Field label="Référence"><code className="text-xs">{detail.id}</code></Field>
          </dl>
        </Drawer>
      )}
    </>
  )
}
