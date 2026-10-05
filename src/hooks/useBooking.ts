import { createContext, createElement, useCallback, useContext, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTomorrow, getDefaultCheckout, toInputDate, fromInputDate } from '@/utils/dateHelpers'
import type { BookingState } from '@/types'
import { api, type AvailabilityResult } from '@/utils/api'

/** Résultat de la dernière recherche, pour l'afficher au lieu de le perdre. */
export interface SearchOutcome {
  status: 'searching' | 'available' | 'full' | 'failed'
  availableRooms: number
  requestedRooms: number
}

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

  const [outcome, setOutcome] = useState<SearchOutcome | null>(null)

  /**
   * Toute modification des critères périme la réponse précédente : afficher
   * « complet » sous des dates qu'on vient de changer serait trompeur.
   */
  const clearOutcome = useCallback(() => setOutcome(null), [])

  const setCheckIn = useCallback((value: string) => {
    const date = fromInputDate(value)
    clearOutcome()
    setState((prev) => ({
      ...prev,
      checkIn: date,
      // Keep checkout consistent (at least 1 night after new check-in)
      checkOut: date && prev.checkOut && prev.checkOut <= date ? getDefaultCheckout(date) : prev.checkOut,
    }))
  }, [clearOutcome])

  const setCheckOut = useCallback((value: string) => {
    clearOutcome()
    setState((prev) => ({ ...prev, checkOut: fromInputDate(value) }))
  }, [clearOutcome])

  const setRooms = (rooms: number) => {
    clearOutcome()
    setState((prev) => ({ ...prev, rooms: Math.max(1, rooms) }))
  }

  const setAdults = (adults: number) => {
    clearOutcome()
    setState((prev) => ({ ...prev, adults: Math.max(1, adults) }))
  }

  const setChildren = (children: number) => {
    clearOutcome()
    setState((prev) => ({ ...prev, children: Math.max(0, children) }))
  }

  /**
   * Interroge la disponibilité, puis renvoie le visiteur vers la liste des
   * chambres. Le résultat est conservé : la barre de recherche doit pouvoir
   * répondre « complet » tout de suite, au lieu de faire croire à une recherche
   * réussie parce qu'elle a changé de page.
   *
   * Une recherche qui échoue n'empêche pas la navigation : la page Chambres
   * reste utile, et elle refera le calcul de son côté.
   */
  const submitSearch = useCallback(async (roomId?: string) => {
    const payload = {
      checkIn: toInputDate(state.checkIn),
      checkOut: toInputDate(state.checkOut),
      rooms: state.rooms,
      adults: state.adults,
      children: state.children,
      ...(roomId && { roomId }),
    }

    setOutcome({ status: 'searching', availableRooms: 0, requestedRooms: state.rooms })
    const response = await api.checkAvailability(payload)
    const result = response.data as AvailabilityResult | undefined

    if (response.error || !result) {
      setOutcome({ status: 'failed', availableRooms: 0, requestedRooms: state.rooms })
    } else {
      setOutcome({
        status: result.available ? 'available' : 'full',
        availableRooms: result.availableRooms,
        requestedRooms: result.requestedRooms,
      })
    }

    const params = new URLSearchParams(payload as unknown as Record<string, string>)
    navigate(`/chambres-suites?${params.toString()}`)
  }, [state, navigate])

  return {
    state, setCheckIn, setCheckOut, setRooms, setAdults, setChildren,
    submitSearch, outcome, clearOutcome,
  }
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
