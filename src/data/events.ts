import type { EventRoom } from '@/types'

/**
 * EVENT ROOMS DATA
 * ----------------
 * `key` maps to translation strings in the `events` namespace
 * (e.g. events.room1Name, events.room1Capacity, events.room1Style).
 */
export const eventRooms: EventRoom[] = [
  { id: 'room1', key: 'room1', image: '/images/Photo-Evenements-1200.jpg' },
  { id: 'room2', key: 'room2', image: '/images/Photo-Gallerie-1-1200.jpg' },
  { id: 'room3', key: 'room3', image: '/images/Photo-Gallerie-2-1200.jpg' },
]

export const equipmentKeys = ['equipment1', 'equipment2', 'equipment3', 'equipment4', 'equipment5', 'equipment6']

export default eventRooms
