import type { EventRoom } from '@/types'

/**
 * EVENT ROOMS DATA
 * ----------------
 * `key` maps to translation strings in the `events` namespace
 * (e.g. events.room1Name, events.room1Capacity, events.room1Style).
 */
export const eventRooms: EventRoom[] = [
  { id: 'room1', key: 'room1', image: '/images/events/events-1.jpg' },
  { id: 'room2', key: 'room2', image: '/images/events/events-2.jpg' },
  { id: 'room3', key: 'room3', image: '/images/events/events-3.jpg' },
]

export const equipmentKeys = ['equipment1', 'equipment2', 'equipment3', 'equipment4', 'equipment5', 'equipment6']

export default eventRooms
