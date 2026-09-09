import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle, AlertCircle } from 'lucide-react'
import type { ContactFormData } from '@/types'
import { validateEmail, validatePhone } from '@/utils/helpers'
import { api } from '@/utils/api'

type Status = 'idle' | 'sending' | 'success' | 'error'

/**
 * ContactForm
 * -----------
 * Fully client-validated contact form. On submit, sends data to the backend API.
 */
export default function ContactForm() {
  const { t } = useTranslation()
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({})
  const [form, setForm] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  function update<K extends keyof ContactFormData>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof ContactFormData, string>> = {}
    if (!form.name.trim()) next.name = 'required'
    if (!validateEmail(form.email)) next.email = 'invalid'
    if (!validatePhone(form.phone)) next.phone = 'invalid'
    if (!form.message.trim()) next.message = 'required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setStatus('sending')
    try {
      const result = await api.sendContact(form)
      if (result.error) {
        setStatus('error')
      } else {
        setStatus('success')
        setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      }
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'w-full border border-gray-300 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 px-4 py-3 text-sm outline-none transition-colors bg-white'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs uppercase tracking-widest2 text-gray-500 mb-2">
            {t('contact.nameLabel')} *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder={t('contact.namePlaceholder')}
            className={inputClass}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>}
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest2 text-gray-500 mb-2">
            {t('contact.emailLabel')} *
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder={t('contact.emailPlaceholder')}
            className={inputClass}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">Adresse e-mail invalide</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs uppercase tracking-widest2 text-gray-500 mb-2">
            {t('contact.phoneLabel')}
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder={t('contact.phonePlaceholder')}
            className={inputClass}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">Numéro invalide</p>}
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest2 text-gray-500 mb-2">
            {t('contact.subjectLabel')}
          </label>
          <input
            type="text"
            value={form.subject}
            onChange={(e) => update('subject', e.target.value)}
            placeholder={t('contact.subjectPlaceholder')}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest2 text-gray-500 mb-2">
          {t('contact.messageLabel')} *
        </label>
        <textarea
          rows={5}
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          placeholder={t('contact.messagePlaceholder')}
          className={inputClass}
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>}
      </div>

      <button type="submit" disabled={status === 'sending'} className="btn-gold w-full sm:w-auto disabled:opacity-60">
        {status === 'sending' ? t('common.sending') : t('contact.submitButton')}
      </button>

      {status === 'success' && (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-4 py-3 rounded text-sm">
          <CheckCircle size={18} /> {t('contact.successMessage')}
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded text-sm">
          <AlertCircle size={18} /> {t('contact.errorMessage')}
        </div>
      )}
    </form>
  )
}
