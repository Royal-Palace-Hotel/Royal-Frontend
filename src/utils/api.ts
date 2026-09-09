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
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
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

export const api = {
  // Content
  getRooms: () => request<any[]>('/content/rooms'),
  getMenu: () => request<any[]>('/content/menu'),
  getSpa: () => request<any[]>('/content/spa'),
  getEvents: () => request<any[]>('/content/events'),

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
