import rooms from '@/data/rooms'
import { menuSections } from '@/data/menu'
import spaTreatments from '@/data/spa'
import eventRooms from '@/data/events'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

interface ApiResponse<T> {
  data?: T
  error?: string
  details?: any
  message?: string
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return { error: data.error || 'Request failed', details: data.details }
    }

    return data
  } catch (error) {
    return { error: 'Network error' }
  }
}

/**
 * Pour les pages de contenu (chambres, menu, spa, événements) :
 * si l'API est injoignable ou renvoie une erreur, on utilise les
 * données locales de src/data/ afin que la page s'affiche quand même.
 * Dès que le backend répond, ce sont ses données qui sont utilisées.
 */
async function withFallback<T>(
  call: () => Promise<ApiResponse<T>>,
  fallback: T
): Promise<ApiResponse<T>> {
  const response = await call()
  if (response.error || !response.data) {
    return { data: fallback }
  }
  return response
}

export const api = {
  // Content (avec repli sur les données locales)
  getRooms: () => withFallback(() => request<any[]>('/content/rooms'), rooms as any[]),
  getMenu: () => withFallback(() => request<any[]>('/content/menu'), menuSections as any[]),
  getSpa: () => withFallback(() => request<any[]>('/content/spa'), spaTreatments as any[]),
  getEvents: () => withFallback(() => request<any[]>('/content/events'), eventRooms as any[]),

  // Bookings
  checkAvailability: (data: {
    checkIn: string
    checkOut: string
    rooms: number
    roomId?: string
  }) => request<any>('/bookings/availability', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  createBooking: (data: {
    guestName: string
    guestEmail: string
    guestPhone?: string
    checkIn: string
    checkOut: string
    rooms: number
    adults: number
    children: number
    roomId: string
  }) => request<any>('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Contact
  sendContact: (data: {
    name: string
    email: string
    phone: string
    subject: string
    message: string
  }) => request<any>('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  sendEventInquiry: (data: {
    name: string
    email: string
    phone?: string
    subject?: string
    message: string
    eventDate: string
    guestCount: string
  }) => request<any>('/contact/event-inquiry', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Newsletter
  subscribeNewsletter: (email: string) => request<any>('/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
}