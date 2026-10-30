import { FormEvent, useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { adminApi } from '@/utils/api'
import { Button, Drawer } from './ui'

/**
 * Saisie d'une réservation au back-office : téléphone, comptoir, e-mail reçu
 * hors du site.
 *
 * Elle passe par le même service que le site public, donc par le même verrou
 * anti-survente. Aucun e-mail n'est envoyé : la réception a le client en ligne.
 *
 * Le nombre d'unités encore libres s'affiche pendant la saisie — c'est la
 * réponse qu'on cherche quand quelqu'un demande « vous avez de la place du 12
 * au 15 ? », et elle doit arriver avant de remplir le reste du formulaire.
 */

interface RoomOption {
  id: string
  name?: string | null
  slug: string
  maxGuests: number
  totalUnits: number
}

const emptyForm = {
  guestName: '', guestPhone: '', guestEmail: '',
  roomId: '', checkIn: '', checkOut: '',
  rooms: '1', adults: '2', children: '0',
  status: 'confirmed',
}

/** Les messages du service de réservation sont en anglais et techniques. */
function explain(error: string) {
  const left = error.match(/Only (\d+) room/i)
  if (left) return `Il ne reste que ${left[1]} unité(s) sur ces dates.`
  if (/No rooms available/i.test(error)) return 'Plus aucune chambre disponible sur ces dates.'
  if (/No room can accommodate/i.test(error)) return 'Aucune chambre ne peut accueillir ce groupe.'
  return error
}

/**
 * Réservation existante à modifier. Les champs arrivent de `/admin/bookings/:id`,
 * où les dates sont des horodatages ISO : on ne garde que le jour, le reste du
 * formulaire ne manipule que des dates.
 */
export interface EditableBooking {
  id: string
  guestName: string
  guestEmail: string | null
  guestPhone: string | null
  roomId: string
  checkIn: string
  checkOut: string
  rooms: number
  adults: number
  children: number
  status: string
}

const asForm = (booking: EditableBooking) => ({
  guestName: booking.guestName,
  guestPhone: booking.guestPhone ?? '',
  guestEmail: booking.guestEmail ?? '',
  roomId: booking.roomId,
  checkIn: booking.checkIn.slice(0, 10),
  checkOut: booking.checkOut.slice(0, 10),
  rooms: String(booking.rooms),
  adults: String(booking.adults),
  children: String(booking.children),
  status: booking.status,
})

export default function NewBookingDrawer({ onClose, onSaved, booking }: {
  onClose: () => void
  onSaved: (guestName: string) => void
  /** Présente : le tiroir modifie cette réservation au lieu d'en créer une. */
  booking?: EditableBooking
}) {
  const editing = Boolean(booking)
  const [form, setForm] = useState(booking ? asForm(booking) : emptyForm)
  const [rooms, setRooms] = useState<RoomOption[]>([])
  const [free, setFree] = useState<number | null>(null)
  const [checking, setChecking] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    adminApi.get<RoomOption[]>('/admin/rooms').then((response) => {
      if (response.data) setRooms(response.data)
    })
  }, [])

  // Disponibilité de la catégorie choisie, recalculée à chaque changement de
  // dates. La réponse du séjour est celle de sa pire nuit.
  useEffect(() => {
    const { roomId, checkIn, checkOut } = form
    if (!roomId || !checkIn || !checkOut || checkIn >= checkOut) {
      setFree(null)
      return
    }

    let cancelled = false
    setChecking(true)
    // En modification, la réservation ne doit pas se compter elle-même : sinon
    // corriger le nom d'un client afficherait « complet » parce que ses propres
    // unités occupent la période. Le serveur applique la même règle avant
    // d'enregistrer, donc l'écran et la décision ne peuvent pas diverger.
    adminApi.availability(checkIn, checkOut, booking?.id).then((response) => {
      if (cancelled) return
      setChecking(false)
      const room = response.data?.rooms.find((entry) => entry.roomId === roomId)
      setFree(room && room.days.length > 0 ? Math.min(...room.days.map((day) => day.free)) : null)
    })

    return () => { cancelled = true }
  }, [form.roomId, form.checkIn, form.checkOut, booking?.id])

  function set(key: keyof typeof emptyForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  // Le bouton d'enregistrement vit dans le pied du tiroir, hors du `<form>` :
  // il appelle donc `submit` directement, tandis que le formulaire garde son
  // `onSubmit` pour la validation native et la touche Entrée.
  async function submit(event?: FormEvent) {
    event?.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      guestName: form.guestName.trim(),
      guestEmail: form.guestEmail.trim(),
      guestPhone: form.guestPhone.trim(),
      roomId: form.roomId,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      rooms: Number(form.rooms),
      adults: Number(form.adults),
      children: Number(form.children),
      status: form.status,
    }

    const response = booking
      ? await adminApi.update(`/admin/bookings/${booking.id}`, payload)
      : await adminApi.create('/admin/bookings', payload)
    setSaving(false)

    if (response.error) {
      setError(explain(response.error))
      return
    }
    onSaved(form.guestName.trim())
  }

  const requested = Number(form.rooms || 1)
  const enough = free === null || free >= requested

  return (
    <Drawer title={editing ? 'Modifier la réservation' : 'Nouvelle réservation'} onClose={onClose} footer={
      <div className="flex gap-2">
        <Button variant="gold" disabled={saving} onClick={() => void submit()}>
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
        <Button onClick={onClose}>Annuler</Button>
      </div>
    }>
      <form id="new-booking" onSubmit={submit} className="space-y-4">
        {error && (
          <p role="alert" className="flex items-start gap-2 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}

        <Text label="Nom du client" value={form.guestName} onChange={(v) => set('guestName', v)} required />
        <Text label="Téléphone" value={form.guestPhone} onChange={(v) => set('guestPhone', v)} optional />
        <Text label="E-mail" type="email" value={form.guestEmail} onChange={(v) => set('guestEmail', v)}
          optional help="Laissez vide si le client n’en a pas donné : aucun e-mail ne part d’ici." />

        <label className="block text-sm text-gray-700">
          Chambre
          <select value={form.roomId} onChange={(event) => set('roomId', event.target.value)} required
            className="mt-1 w-full border border-gray-300 px-3 py-2 outline-none focus:border-gold-500">
            <option value="">Choisir…</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name || room.slug} — {room.maxGuests} pers., {room.totalUnits} unité(s)
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <Text label="Arrivée" type="date" value={form.checkIn} onChange={(v) => set('checkIn', v)} required />
          <Text label="Départ" type="date" value={form.checkOut} onChange={(v) => set('checkOut', v)} required />
        </div>

        {(checking || free !== null) && (
          <p className={`flex items-center gap-2 border px-3 py-2 text-sm ${
            checking ? 'border-gray-200 bg-gray-50 text-gray-600'
              : enough ? 'border-green-200 bg-green-50 text-green-800'
                : 'border-red-200 bg-red-50 text-red-700'
          }`}>
            {!checking && (enough
              ? <CheckCircle2 size={16} className="shrink-0" aria-hidden="true" />
              : <AlertCircle size={16} className="shrink-0" aria-hidden="true" />)}
            {checking ? 'Vérification…'
              : free === 0 ? 'Complet sur ces dates.'
                : `${free} unité(s) libre(s) sur ces dates.`}
          </p>
        )}

        <div className="grid grid-cols-3 gap-3">
          <Text label="Chambres" type="number" value={form.rooms} onChange={(v) => set('rooms', v)} required />
          <Text label="Adultes" type="number" value={form.adults} onChange={(v) => set('adults', v)} required />
          <Text label="Enfants" type="number" value={form.children} onChange={(v) => set('children', v)} />
        </div>

        <label className="block text-sm text-gray-700">
          Statut
          <select value={form.status} onChange={(event) => set('status', event.target.value)}
            className="mt-1 w-full border border-gray-300 px-3 py-2 outline-none focus:border-gold-500">
            <option value="confirmed">Confirmée</option>
            <option value="pending">En attente</option>
            {/* Une réservation ne s'annule qu'une fois créée. */}
            {editing && <option value="cancelled">Annulée</option>}
          </select>
        </label>

        {/* Le bouton du pied de page vit hors du formulaire : il le soumet par `form`. */}
        <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
      </form>
    </Drawer>
  )
}

function Text({ label, value, onChange, type = 'text', required, optional, help }: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'date' | 'number'
  required?: boolean
  optional?: boolean
  help?: string
}) {
  return (
    <label className="block text-sm text-gray-700">
      {label}
      {optional && <span className="ml-1 text-xs text-gray-400">(facultatif)</span>}
      <input type={type} value={value} required={required}
        min={type === 'number' ? 0 : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full border border-gray-300 px-3 py-2 outline-none focus:border-gold-500" />
      {help && <span className="mt-1 block text-xs text-gray-500">{help}</span>}
    </label>
  )
}
