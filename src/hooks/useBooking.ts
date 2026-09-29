import { createContext, createElement, useCallback, useContext, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTomorrow, getDefaultCheckout, toInputDate, fromInputDate } from '@/utils/dateHelpers'
import type { BookingState } from '@/types'
import { api } from '@/utils/api'

/**
 * useBooking
 * ----------
 * Manages the state of the floating booking bar (check-in/out dates,
 * rooms & guests) and exposes a `submitSearch` action.
 *
 * API integration: Checks availability and navigates to rooms page with params.
 */
function useBookingState() {
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

  const setRooms = (rooms: number) => {
    setState((prev) => ({ ...prev, rooms: Math.max(1, rooms) }))
  }

  const setAdults = (adults: number) => {
    setState((prev) => ({ ...prev, adults: Math.max(1, adults) }))
  }

  const setChildren = (children: number) => {
    setState((prev) => ({ ...prev, children: Math.max(0, children) }))
  }

  const submitSearch = useCallback(async (roomId?: string) => {
    const payload = {
      checkIn: toInputDate(state.checkIn),
      checkOut: toInputDate(state.checkOut),
      rooms: state.rooms,
      adults: state.adults,
      children: state.children,
      ...(roomId && { roomId }),
    }

    // Check availability via API
    const result = await api.checkAvailability(payload)

    if (result.error) {
      console.error('[Royal Palace] Availability check failed:', result.error)
      // Still navigate to rooms page even if availability check fails
    }

    const params = new URLSearchParams(payload as unknown as Record<string, string>)
    navigate(`/chambres-suites?${params.toString()}`)
  }, [state, navigate])

  return { state, setCheckIn, setCheckOut, setRooms, setAdults, setChildren, submitSearch }
}

type BookingContextValue = ReturnType<typeof useBookingState>

const BookingContext = createContext<BookingContextValue | null>(null)

export function BookingProvider({ children }: { children: ReactNode }) {
  const booking = useBookingState()
  return createElement(BookingContext.Provider, { value: booking }, children)
}

export function useBooking() {
  const context = useContext(BookingContext)
  const standaloneBooking = useBookingState()
  return context ?? standaloneBooking
}

export default useBooking
