import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTomorrow, getDefaultCheckout, toInputDate, fromInputDate } from '@/utils/dateHelpers'
import type { BookingState } from '@/types'

/**
 * useBooking
 * ----------
 * Manages the state of the floating booking bar (check-in/out dates,
 * rooms & guests) and exposes a `submitSearch` action.
 *
 * API-READY: `submitSearch` currently navigates to /contact with the
 * booking query params, and logs the payload to the console. Replace
 * the body of `submitSearch` with a real API call (e.g. fetch to your
 * PMS / channel manager) when ready — the data shape is already
 * structured for that purpose.
 */
export function useBooking() {
  const navigate = useNavigate()
  const defaultCheckIn = getTomorrow()

  const [state, setState] = useState<BookingState>({
    checkIn: defaultCheckIn,
    checkOut: getDefaultCheckout(defaultCheckIn),
    rooms: 1,
    adults: 2,
    children: 0,
  })

  const setCheckIn = useCallback((value: string) => {
    const date = fromInputDate(value)
    setState((prev) => ({
      ...prev,
      checkIn: date,
      // Keep checkout consistent (at least 1 night after new check-in)
      checkOut: date && prev.checkOut && prev.checkOut <= date ? getDefaultCheckout(date) : prev.checkOut,
    }))
  }, [])

  const setCheckOut = useCallback((value: string) => {
    setState((prev) => ({ ...prev, checkOut: fromInputDate(value) }))
  }, [])

  const setRooms = useCallback((rooms: number) => {
    setState((prev) => ({ ...prev, rooms: Math.max(1, rooms) }))
  }, [])

  const setAdults = useCallback((adults: number) => {
    setState((prev) => ({ ...prev, adults: Math.max(1, adults) }))
  }, [])

  const setChildren = useCallback((children: number) => {
    setState((prev) => ({ ...prev, children: Math.max(0, children) }))
  }, [])

  const submitSearch = useCallback(() => {
    const payload = {
      checkIn: toInputDate(state.checkIn),
      checkOut: toInputDate(state.checkOut),
      rooms: state.rooms,
      adults: state.adults,
      children: state.children,
    }
    // eslint-disable-next-line no-console
    console.log('[Royal Palace] Booking search submitted:', payload)

    const params = new URLSearchParams(payload as unknown as Record<string, string>)
    navigate(`/chambres-suites?${params.toString()}`)
  }, [state, navigate])

  return { state, setCheckIn, setCheckOut, setRooms, setAdults, setChildren, submitSearch }
}

export default useBooking
