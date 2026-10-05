import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { adminApi, type RoomAvailability, type RoomBlock } from '@/utils/api'
import { Button, Card, EmptyState, ErrorBanner, Spinner } from './ui'

/**
 * Tableau de disponibilité : une ligne par catégorie de chambre, une colonne par
 * jour du mois, et dans chaque case le nombre d'unités encore vendables cette
 * nuit-là.
 *
 * C'est la vue qui manquait pour répondre d'un coup d'œil à « est-ce que la
 * deluxe est libre du 12 au 15 ? » sans parcourir la liste des réservations.
 */

/** Minuit UTC : tous les jours manipulés ici sont des dates, jamais des instants. */
const utcDay = (year: number, month: number, day: number) =>
  new Date(Date.UTC(year, month, day))

const iso = (date: Date) => date.toISOString().slice(0, 10)

const MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]
const WEEKDAYS = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

const roomLabel = (room: RoomAvailability) => room.name || room.slug

export default function AvailabilityPanel() {
  const today = new Date()
  const [year, setYear] = useState(today.getUTCFullYear())
  const [month, setMonth] = useState(today.getUTCMonth())
  const [rooms, setRooms] = useState<RoomAvailability[]>([])
  const [blocks, setBlocks] = useState<RoomBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const from = useMemo(() => iso(utcDay(year, month, 1)), [year, month])
  const to = useMemo(() => iso(utcDay(year, month + 1, 1)), [year, month])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const response = await adminApi.availability(from, to)
    if (response.error || !response.data) {
      setError(response.error || 'Disponibilité indisponible.')
    } else {
      setRooms(response.data.rooms)
      setBlocks(response.data.blocks)
    }
    setLoading(false)
  }, [from, to])

  useEffect(() => { void load() }, [load])

  function shift(months: number) {
    const target = utcDay(year, month + months, 1)
    setYear(target.getUTCFullYear())
    setMonth(target.getUTCMonth())
  }

  const todayIso = iso(utcDay(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
  const days = rooms[0]?.days ?? []

  return (
    <>
      {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}

      <Card
        title={`Disponibilité — ${MONTHS[month]} ${year}`}
        action={
          <div className="flex items-center gap-2">
            <Button onClick={() => shift(-1)}>
              <span className="inline-flex items-center gap-1">
                <ChevronLeft size={15} aria-hidden="true" /> Mois précédent
              </span>
            </Button>
            <Button onClick={() => { setYear(today.getUTCFullYear()); setMonth(today.getUTCMonth()) }}>
              Ce mois
            </Button>
            <Button onClick={() => shift(1)}>
              <span className="inline-flex items-center gap-1">
                Mois suivant <ChevronRight size={15} aria-hidden="true" />
              </span>
            </Button>
          </div>
        }
      >
        {loading ? <Spinner /> : days.length === 0 ? (
          <EmptyState>Aucune chambre enregistrée : ajoutez-en dans « Chambres ».</EmptyState>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <caption className="sr-only">
                  Unités disponibles par chambre et par nuit, pour {MONTHS[month]} {year}
                </caption>
                <thead>
                  <tr className="bg-gray-50 text-gray-500">
                    <th scope="col"
                      className="sticky left-0 z-10 bg-gray-50 px-4 py-2 text-left font-medium">
                      Chambre
                    </th>
                    {days.map((day) => {
                      const date = new Date(`${day.date}T00:00:00Z`)
                      const weekend = [0, 6].includes(date.getUTCDay())
                      return (
                        <th key={day.date} scope="col"
                          className={`w-10 px-0 py-2 text-center text-xs font-medium ${
                            day.date === todayIso ? 'bg-gold-500 text-white'
                              : weekend ? 'bg-gray-100' : ''
                          }`}>
                          <span className="block">{WEEKDAYS[date.getUTCDay()]}</span>
                          <span className="block text-[11px] text-current opacity-80">
                            {date.getUTCDate()}
                          </span>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.roomId} className="border-t border-gray-100">
                      <th scope="row"
                        className="sticky left-0 z-10 whitespace-nowrap bg-white px-4 py-2 text-left font-medium text-charcoal">
                        {roomLabel(room)}
                        <span className="block text-xs font-normal text-gray-400">
                          {room.totalUnits} unité(s)
                        </span>
                      </th>
                      {room.days.map((day) => (
                        <td key={day.date} className="p-0.5">
                          <DayCell
                            free={day.free}
                            total={day.total ?? room.totalUnits}
                            booked={day.booked ?? 0}
                            blocked={day.blocked ?? 0}
                            room={roomLabel(room)}
                            date={day.date}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center gap-4 border-t border-gray-100 px-4 py-3 text-xs text-gray-500">
              <Legend className="bg-white border border-gray-200">tout libre</Legend>
              <Legend className="bg-gold-100">partiellement vendu</Legend>
              <Legend className="bg-red-200">complet</Legend>
              <Legend className="bg-gray-300">bloqué (travaux, fermeture)</Legend>
              <span>Le chiffre est le nombre d’unités encore vendables cette nuit-là.</span>
            </div>
          </>
        )}
      </Card>

      <div className="mt-6">
        <Card title="Périodes bloquées sur ce mois">
          {blocks.length === 0 ? (
            <EmptyState>
              Aucun blocage sur cette période. Ajoutez-en dans « Périodes bloquées ».
            </EmptyState>
          ) : (
            <ul className="divide-y divide-gray-100">
              {blocks.map((block) => (
                <li key={block.id} className="flex flex-wrap items-baseline gap-x-3 px-4 py-3 text-sm">
                  <span className="font-medium text-charcoal">{block.roomName}</span>
                  <span className="text-gray-600">
                    du {block.startDate} au {block.endDate} (départ inclus comme jour libre)
                  </span>
                  <span className="text-gray-500">· {block.units} unité(s)</span>
                  {block.reason && <span className="text-gray-400">· {block.reason}</span>}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  )
}

function Legend({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block h-3 w-3 ${className}`} aria-hidden="true" />
      {children}
    </span>
  )
}

/**
 * Une nuit, pour une catégorie.
 *
 * La couleur donne l'état en un coup d'œil, le chiffre donne la quantité, et
 * l'infobulle détaille — un tableau de 31 colonnes ne peut pas tout écrire.
 */
function DayCell({ free, total, booked, blocked, room, date }: {
  free: number
  total: number
  booked: number
  blocked: number
  room: string
  date: string
}) {
  const tone = free === 0
    ? (blocked >= total ? 'bg-gray-300 text-gray-700' : 'bg-red-200 text-red-900')
    : free < total ? 'bg-gold-100 text-gold-900'
      : 'bg-white text-gray-400 border border-gray-100'

  const detail = [
    `${room}, nuit du ${date}`,
    `${free} libre(s) sur ${total}`,
    booked > 0 ? `${booked} réservée(s)` : null,
    blocked > 0 ? `${blocked} bloquée(s)` : null,
  ].filter(Boolean).join(' · ')

  return (
    <span title={detail}
      className={`flex h-8 items-center justify-center text-xs tabular-nums ${tone}`}>
      {free}
    </span>
  )
}
