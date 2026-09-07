import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, Users, ChevronDown } from 'lucide-react'
import { useBooking } from '@/hooks/useBooking'
import { toInputDate } from '@/utils/dateHelpers'
import { classNames } from '@/utils/helpers'

interface BookingBarProps {
  floating?: boolean // true = overlapping hero (rounded white card), false = inline/static
}

/**
 * BookingBar
 * ----------
 * Functional date pickers (native <input type="date">) + rooms/guests
 * stepper. Replicates the reference photo's floating white bar with
 * ARRIVÉE / DÉPART / CHAMBRES & VOYAGEURS / CHECK AVAILABILITY layout.
 */
export default function BookingBar({ floating = true }: BookingBarProps) {
  const { t } = useTranslation()
  const { state, setCheckIn, setCheckOut, setRooms, setAdults, setChildren, submitSearch } = useBooking()
  const [guestsOpen, setGuestsOpen] = useState(false)
  const guestsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (guestsRef.current && !guestsRef.current.contains(e.target as Node)) {
        setGuestsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const guestsLabel = `${state.rooms} ${t(state.rooms > 1 ? 'common.rooms' : 'common.room')} · ${state.adults} ${t(
    state.adults > 1 ? 'common.adults' : 'common.adult'
  )}${state.children > 0 ? ` · ${state.children} ${t(state.children > 1 ? 'common.children' : 'common.child')}` : ''}`

  return (
    <div
      className={classNames(
        'bg-white flex flex-col md:flex-row items-stretch w-full',
        floating ? 'rounded-md shadow-soft-lg md:divide-x divide-gray-200' : 'rounded-md shadow-card md:divide-x divide-gray-200 border border-gray-100'
      )}
    >
      {/* Check-in */}
      <label className="flex-1 flex items-center gap-3 px-6 py-4 cursor-pointer">
        <Calendar size={18} className="text-gold-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-widest2 text-gray-400 font-medium">{t('common.checkIn')}</div>
          <input
            type="date"
            value={toInputDate(state.checkIn)}
            min={toInputDate(new Date())}
            onChange={(e) => setCheckIn(e.target.value)}
            className="text-sm font-medium text-charcoal w-full focus:outline-none bg-transparent"
          />
        </div>
      </label>

      {/* Check-out */}
      <label className="flex-1 flex items-center gap-3 px-6 py-4 cursor-pointer">
        <Calendar size={18} className="text-gold-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-widest2 text-gray-400 font-medium">{t('common.checkOut')}</div>
          <input
            type="date"
            value={toInputDate(state.checkOut)}
            min={toInputDate(state.checkIn || new Date())}
            onChange={(e) => setCheckOut(e.target.value)}
            className="text-sm font-medium text-charcoal w-full focus:outline-none bg-transparent"
          />
        </div>
      </label>

      {/* Rooms & guests */}
      <div ref={guestsRef} className="flex-1 relative">
        <button
          type="button"
          onClick={() => setGuestsOpen((v) => !v)}
          className="w-full flex items-center gap-3 px-6 py-4 text-left"
        >
          <Users size={18} className="text-gold-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-widest2 text-gray-400 font-medium">{t('common.roomsGuests')}</div>
            <div className="text-sm font-medium text-charcoal truncate">{guestsLabel}</div>
          </div>
          <ChevronDown size={16} className={classNames('text-gray-400 transition-transform', guestsOpen && 'rotate-180')} />
        </button>

        {guestsOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white shadow-soft-lg rounded-md p-5 w-72 z-50 border border-gray-100">
            <Stepper label={t('common.rooms')} value={state.rooms} onChange={setRooms} min={1} />
            <Stepper label={t('common.adults')} value={state.adults} onChange={setAdults} min={1} />
            <Stepper label={t('common.children')} value={state.children} onChange={setChildren} min={0} />
            <button
              type="button"
              onClick={() => setGuestsOpen(false)}
              className="mt-2 w-full text-center text-xs uppercase tracking-widest2 text-gold-600 font-medium py-2 hover:bg-cream rounded"
            >
              {t('common.apply')}
            </button>
          </div>
        )}
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={submitSearch}
        className="bg-gold-500 hover:bg-gold-600 text-white uppercase tracking-widest2 text-xs md:text-sm font-medium px-8 py-5 transition-colors whitespace-nowrap"
      >
        {t('common.checkAvailability')}
      </button>
    </div>
  )
}

function Stepper({
  label,
  value,
  onChange,
  min = 0,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-charcoal capitalize">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gold-500 hover:text-gold-500 disabled:opacity-30 transition-colors"
        >
          −
        </button>
        <span className="w-5 text-center text-sm font-medium">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gold-500 hover:text-gold-500 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  )
}
