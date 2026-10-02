import { useEffect, useState } from 'react'
import { adminApi } from '@/utils/api'
import {
  BarList, BOOKING_STATUS, Card, ColumnChart, EmptyState, ErrorBanner, MESSAGE_STATUS,
  Meter, Spinner, StatTile, StatusBadge,
} from './ui'

interface Stats {
  bookings: {
    total: number; pending: number; confirmed: number; cancelled: number
    thisMonth: number; upcomingArrivals: number
  }
  today: { arrivals: number; departures: number; roomsOccupied: number }
  occupancy: { nightsSold: number; capacity: number; rate: number; daysInMonth: number }
  revenue: { estimatedThisMonth: number; currency: string }
  messages: { total: number; unread: number }
  newsletter: { subscribers: number }
  recentBookings: any[]
  recentMessages: any[]
  bookingsByRoom: Array<{ room: string | null; bookings: number; units: number }>
  bookingsByMonth: Array<{ month: string; bookings: number }>
}

const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']

const shortMonth = (value: string) => {
  const [year, month] = value.split('-')
  return `${MONTHS[Number(month) - 1] ?? month} ${year.slice(2)}`
}

const date = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'

const money = (amount: number, currency: string) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)

export default function Overview({ onOpenSection }: { onOpenSection: (section: string) => void }) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    adminApi.get<Stats>('/admin/stats').then((response) => {
      if (cancelled) return
      if (response.error) setError(response.error)
      else setStats(response.data ?? null)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  if (loading) return <Card><Spinner label="Chargement du tableau de bord…" /></Card>
  if (error) return <ErrorBanner message={error} />
  if (!stats) return null

  const { bookings, occupancy, revenue, messages, newsletter } = stats

  const today = stats.today

  return (
    <div className="space-y-6">
      {/* La journée en cours, pour la réception. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Arrivées aujourd’hui" value={today.arrivals}
          tone={today.arrivals > 0 ? 'good' : 'neutral'} />
        <StatTile label="Départs aujourd’hui" value={today.departures} />
        <StatTile label="Chambres occupées ce soir" value={today.roomsOccupied}
          hint={`sur ${occupancy.capacity / occupancy.daysInMonth} disponibles`} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Réservations ce mois" value={bookings.thisMonth}
          hint={`${bookings.total} au total`} />
        <StatTile label="En attente de confirmation" value={bookings.pending}
          tone={bookings.pending > 0 ? 'warning' : 'neutral'}
          hint={bookings.pending > 0 ? 'à traiter' : 'rien à traiter'} />
        <StatTile label="Arrivées sous 30 jours" value={bookings.upcomingArrivals} />
        <StatTile label="Messages non lus" value={messages.unread}
          tone={messages.unread > 0 ? 'warning' : 'neutral'}
          hint={`${messages.total} message(s) reçus`} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Meter label="Taux d’occupation du mois" rate={occupancy.rate}
          hint={`${occupancy.nightsSold} nuitées vendues sur ${occupancy.capacity} disponibles`} />
        <StatTile label="Chiffre d’affaires estimé" value={money(revenue.estimatedThisMonth, revenue.currency)}
          hint="mois en cours, au prix catalogue" />
        <StatTile label="Réservations confirmées" value={bookings.confirmed} tone="good"
          hint={`${bookings.cancelled} annulée(s)`} />
        <StatTile label="Abonnés newsletter" value={newsletter.subscribers} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card title="Réservations par chambre">
          <BarList
            items={stats.bookingsByRoom.map((row) => ({
              label: row.room || 'Chambre supprimée',
              value: row.bookings,
              hint: `${row.units} unité(s)`,
            }))}
            emptyLabel="Aucune réservation active."
          />
        </Card>

        <Card title="Réservations créées par mois">
          <ColumnChart
            items={stats.bookingsByMonth.map((row) => ({
              label: shortMonth(row.month),
              value: row.bookings,
            }))}
            emptyLabel="Aucune réservation sur les six derniers mois."
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card title="Dernières réservations" action={
          <button onClick={() => onOpenSection('bookings')} className="text-sm text-gold-700 hover:underline">
            Tout voir
          </button>
        }>
          {stats.recentBookings.length === 0 ? <EmptyState>Aucune réservation.</EmptyState> : (
            <ul className="divide-y divide-gray-100">
              {stats.recentBookings.map((booking) => (
                <li key={booking.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-charcoal">{booking.guestName}</p>
                    <p className="truncate text-xs text-gray-500">
                      {booking.roomName || booking.roomSlug || 'Chambre inconnue'} · {date(booking.checkIn)} → {date(booking.checkOut)}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} map={BOOKING_STATUS} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Derniers messages" action={
          <button onClick={() => onOpenSection('contact-messages')} className="text-sm text-gold-700 hover:underline">
            Tout voir
          </button>
        }>
          {stats.recentMessages.length === 0 ? <EmptyState>Aucun message.</EmptyState> : (
            <ul className="divide-y divide-gray-100">
              {stats.recentMessages.map((message) => (
                <li key={message.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-charcoal">
                      {message.name}
                      <span className="ml-2 text-xs font-normal text-gray-500">
                        {message.type === 'event' ? 'devis événement' : 'contact'}
                      </span>
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {message.subject || 'Sans sujet'} · {date(message.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={message.status} map={MESSAGE_STATUS} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}
