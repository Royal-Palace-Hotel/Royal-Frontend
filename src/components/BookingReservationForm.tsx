import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { useBooking } from '@/hooks/useBooking'
import { api } from '@/utils/api'
import { formatDate, nightsBetween, toInputDate } from '@/utils/dateHelpers'
import { validateEmail, validatePhone } from '@/utils/helpers'

type Status = 'idle' | 'sending' | 'success' | 'error'
type ReservationFormData = { name: string; email: string; phone: string }
type ReservationFormErrors = Partial<Record<keyof ReservationFormData, string>>

export default function BookingReservationForm() {
  const { t, i18n } = useTranslation()
  const { state } = useBooking()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<ReservationFormErrors>({})
  const [form, setForm] = useState<ReservationFormData>({ name: '', email: '', phone: '' })

  function update<K extends keyof ReservationFormData>(key: K, value: string) {
    setForm((previous) => ({ ...previous, [key]: value }))
  }

  function validate(): boolean {
    const next: ReservationFormErrors = {}
    if (!form.name.trim()) next.name = 'required'
    if (!validateEmail(form.email)) next.email = 'invalid'
    if (!validatePhone(form.phone)) next.phone = 'invalid'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!validate()) return

    setStatus('sending')
    try {
      const result = await api.createBooking({
        guestName: form.name.trim(),
        guestEmail: form.email,
        guestPhone: form.phone || undefined,
        checkIn: toInputDate(state.checkIn),
        checkOut: toInputDate(state.checkOut),
        rooms: state.rooms,
        adults: state.adults,
        children: state.children,
        roomId: searchParams.get('room') || undefined,
      })

      if (result.error) {
        setStatus('error')
      } else {
        setStatus('success')
        setForm({ name: '', email: '', phone: '' })
      }
    } catch {
      setStatus('error')
    }
  }

  const language = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'fr'
  const nights = nightsBetween(state.checkIn, state.checkOut)
  const roomLabel = t(state.rooms > 1 ? 'common.rooms' : 'common.room')
  const adultLabel = t(state.adults > 1 ? 'common.adults' : 'common.adult')
  const childLabel = t(state.children > 1 ? 'common.children' : 'common.child')
  const guestSummary = `${state.adults} ${adultLabel}${state.children ? `, ${state.children} ${childLabel}` : ''}`
  const summary = `${nights} ${t(nights > 1 ? 'booking.nights' : 'booking.night')} · ${state.rooms} ${roomLabel} · ${guestSummary}, ${t(
    'booking.stayDates',
    { checkIn: formatDate(state.checkIn, language), checkOut: formatDate(state.checkOut, language) }
  )}`

  const inputClass =
    'w-full border border-gray-300 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 px-4 py-3 text-sm outline-none transition-colors bg-white'

  return (
    <form onSubmit={handleSubmit} className="mt-8 border-t border-gray-200 pt-7 space-y-5">
      <div>
        <h3 className="font-serif text-lg mb-1">{t('booking.guestDetails')}</h3>
        <p className="text-sm text-gray-500">{summary}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="booking-name" className="block text-xs uppercase tracking-widest2 text-gray-500 mb-2">
            {t('contact.nameLabel')} *
          </label>
          <input
            id="booking-name"
            type="text"
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
            placeholder={t('contact.namePlaceholder')}
            className={inputClass}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>}
        </div>
        <div>
          <label htmlFor="booking-email" className="block text-xs uppercase tracking-widest2 text-gray-500 mb-2">
            {t('contact.emailLabel')} *
          </label>
          <input
            id="booking-email"
            type="email"
            value={form.email}
            onChange={(event) => update('email', event.target.value)}
            placeholder={t('contact.emailPlaceholder')}
            className={inputClass}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">Adresse e-mail invalide</p>}
        </div>
      </div>

      <div>
        <label htmlFor="booking-phone" className="block text-xs uppercase tracking-widest2 text-gray-500 mb-2">
          {t('contact.phoneLabel')}
        </label>
        <input
          id="booking-phone"
          type="tel"
          value={form.phone}
          onChange={(event) => update('phone', event.target.value)}
          placeholder={t('contact.phonePlaceholder')}
          className={inputClass}
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">Numéro invalide</p>}
      </div>

      <button type="submit" disabled={status === 'sending'} className="btn-gold w-full sm:w-auto disabled:opacity-60">
        {status === 'sending' ? t('common.sending') : t('booking.confirmButton')}
      </button>

      {status === 'success' && (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-4 py-3 rounded text-sm">
          <CheckCircle size={18} /> {t('booking.successMessage')}
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded text-sm">
          <AlertCircle size={18} /> {t('booking.errorMessage')}
        </div>
      )}
    </form>
  )
}