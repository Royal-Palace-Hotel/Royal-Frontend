import { useCallback, useEffect, useState } from 'react'
import { BedDouble, LogIn, LogOut, Phone } from 'lucide-react'
import { adminApi, type DayBooking } from '@/utils/api'
import { BOOKING_STATUS, Button, Card, EmptyState, ErrorBanner, Spinner, StatusBadge } from './ui'

/**
 * La journée de la réception : qui arrive, qui part, qui dort ici ce soir.
 *
 * Le tableau de bord ne donnait que des compteurs — « arrivées : 2 » sans dire
 * qui. Pour avoir les noms il fallait ouvrir la liste des réservations et la
 * trier, au moment précis où l'on a le moins de temps. Tout ce dont on a besoin
 * au comptoir est ici : le nom, le téléphone, la chambre et la durée.
 */

const iso = (date: Date) => date.toISOString().slice(0, 10)

const todayIso = () => {
  const now = new Date()
  return iso(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())))
}

const shiftDay = (date: string, days: number) =>
  iso(new Date(new Date(`${date}T00:00:00Z`).getTime() + days * 86400000))

const longDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  })

export default function DayPanel() {
  const [date, setDate] = useState(todayIso)
  const [data, setData] = useState<{
    arrivals: DayBooking[]
    departures: DayBooking[]
    inHouse: DayBooking[]
  }>({ arrivals: [], departures: [], inHouse: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const response = await adminApi.day(date)
    if (response.error || !response.data) {
      setError(response.error || 'Journée indisponible.')
    } else {
      setData(response.data)
    }
    setLoading(false)
  }, [date])

  useEffect(() => { void load() }, [load])

  const unitsInHouse = data.inHouse.reduce((sum, row) => sum + row.rooms, 0)

  return (
    <>
      {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Button onClick={() => setDate((current) => shiftDay(current, -1))}>Veille</Button>
        <Button onClick={() => setDate(todayIso())}>Aujourd’hui</Button>
        <Button onClick={() => setDate((current) => shiftDay(current, 1))}>Lendemain</Button>
        <label className="ml-auto flex items-center gap-2 text-sm text-gray-600">
          Date
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)}
            className="border border-gray-300 px-3 py-2 outline-none focus:border-gold-500" />
        </label>
      </div>

      <p className="mb-5 font-serif text-lg capitalize text-charcoal">{longDate(date)}</p>

      {loading ? <Spinner /> : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <DayList
            title="Arrivées" icon={LogIn} tone="text-green-700"
            rows={data.arrivals} empty="Aucune arrivée ce jour-là."
          />
          <DayList
            title="Départs" icon={LogOut} tone="text-amber-700"
            rows={data.departures} empty="Aucun départ ce jour-là."
          />
          <DayList
            title={`Sur place (${unitsInHouse} chambre(s))`} icon={BedDouble} tone="text-gold-700"
            rows={data.inHouse} empty="Aucun client sur place cette nuit-là."
          />
        </div>
      )}
    </>
  )
}

function DayList({ title, icon: Icon, tone, rows, empty }: {
  title: string
  icon: typeof LogIn
  tone: string
  rows: DayBooking[]
  empty: string
}) {
  return (
    <Card title={
      <h2 className="flex items-center gap-2 font-serif text-lg">
        <Icon size={18} className={tone} aria-hidden="true" />
        {title}
        <span className="text-sm font-sans text-gray-400">{rows.length}</span>
      </h2>
    }>
      {rows.length === 0 ? <EmptyState>{empty}</EmptyState> : (
        <ul className="divide-y divide-gray-100">
          {rows.map((row) => (
            <li key={row.id} className="px-4 py-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium text-charcoal">{row.guestName}</span>
                <StatusBadge status={row.status} map={BOOKING_STATUS} />
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {row.roomName || '—'} · {row.rooms} chambre(s) · {row.adults} adulte(s)
                {row.children ? `, ${row.children} enfant(s)` : ''}
              </p>
              <p className="text-xs text-gray-500">
                {row.checkIn} → {row.checkOut} · {row.nights} nuit(s)
              </p>
              {/* Le téléphone est cliquable : au comptoir, c'est ce qu'on cherche. */}
              {row.guestPhone && (
                <a href={`tel:${row.guestPhone}`}
                  className="mt-1 inline-flex items-center gap-1 text-xs text-gold-700 hover:underline">
                  <Phone size={12} aria-hidden="true" /> {row.guestPhone}
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
