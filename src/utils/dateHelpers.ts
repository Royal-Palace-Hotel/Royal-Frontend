import { format, addDays, differenceInCalendarDays, isBefore, isValid } from 'date-fns'
import { fr, enUS } from 'date-fns/locale'

/**
 * Format a Date object as dd/MM/yyyy (localized).
 */
export function formatDate(date: Date | null, lang: string = 'fr'): string {
  if (!date || !isValid(date)) return ''
  return format(date, 'dd/MM/yyyy', { locale: lang === 'en' ? enUS : fr })
}

/**
 * Format a Date object for <input type="date"> value (yyyy-MM-dd).
 */
export function toInputDate(date: Date | null): string {
  if (!date || !isValid(date)) return ''
  return format(date, 'yyyy-MM-dd')
}

export function fromInputDate(value: string): Date | null {
  if (!value) return null
  const d = new Date(value)
  return isValid(d) ? d : null
}

/**
 * Returns tomorrow's date (default check-in).
 */
export function getTomorrow(): Date {
  return addDays(new Date(), 1)
}

/**
 * Returns default check-out (check-in + 1 night).
 */
export function getDefaultCheckout(checkIn: Date): Date {
  return addDays(checkIn, 1)
}

/**
 * Number of nights between two dates (min 1).
 */
export function nightsBetween(checkIn: Date | null, checkOut: Date | null): number {
  if (!checkIn || !checkOut) return 1
  const diff = differenceInCalendarDays(checkOut, checkIn)
  return diff > 0 ? diff : 1
}

/**
 * Ensures checkOut is always after checkIn.
 */
export function isCheckoutValid(checkIn: Date | null, checkOut: Date | null): boolean {
  if (!checkIn || !checkOut) return true
  return isBefore(checkIn, checkOut)
}
