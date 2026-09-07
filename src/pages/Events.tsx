import { useTranslation } from 'react-i18next'
import { Users, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import PageHero from '@/components/PageHero'
import AnimatedSection from '@/components/AnimatedSection'
import SectionHeading from '@/components/SectionHeading'
import { eventRooms, equipmentKeys } from '@/data/events'
import type { EventFormData } from '@/types'
import { validateEmail } from '@/utils/helpers'

export default function Events() {
  const { t } = useTranslation()
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle')
  const [form, setForm] = useState<EventFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    eventDate: '',
    guestCount: '',
  })

  function update<K extends keyof EventFormData>(key: K, value: string) {
    setForm((p) => ({ ...p, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !validateEmail(form.email) || !form.message) return
    setStatus('sending')
    // eslint-disable-next-line no-console
    console.log('[Royal Palace] Event inquiry submitted:', form)
    await new Promise((r) => setTimeout(r, 800))
    setStatus('success')
  }

  const inputClass =
    'w-full border border-gray-300 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 px-4 py-3 text-sm outline-none transition-colors bg-white'

  return (
    <>
      <PageHero image="/images/events/events-2.jpg" title={t('events.heroTitle')} subtitle={t('events.heroSubtitle')} />

      <AnimatedSection className="container-luxe py-20 md:py-24">
        <SectionHeading title={t('events.introTitle')} text={t('events.introText')} />
      </AnimatedSection>

      {/* Rooms with capacity */}
      <section className="bg-cream py-20 md:py-24">
        <div className="container-luxe">
          <SectionHeading title={t('events.roomsTitle')} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            {eventRooms.map((room, idx) => (
              <AnimatedSection key={room.id} delay={idx * 0.1} className="bg-white rounded-md overflow-hidden shadow-card">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={room.image} alt={t(`events.${room.key}Name`)} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-lg mb-2">{t(`events.${room.key}Name`)}</h3>
                  <div className="flex items-center gap-2 text-sm text-gold-600 mb-2">
                    <Users size={16} /> {t(`events.${room.key}Capacity`)}
                  </div>
                  <p className="text-sm text-gray-600">{t(`events.${room.key}Style`)}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment */}
      <AnimatedSection className="container-luxe py-20 md:py-24">
        <SectionHeading title={t('events.equipmentTitle')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-14 max-w-4xl mx-auto">
          {equipmentKeys.map((key) => (
            <div key={key} className="flex items-center gap-3 bg-white border border-gray-100 rounded-md p-4 shadow-sm">
              <CheckCircle2 size={18} className="text-gold-500 shrink-0" />
              <span className="text-sm text-charcoal">{t(`events.${key}`)}</span>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Quote request form */}
      <section className="bg-charcoal py-20 md:py-24">
        <div className="container-luxe max-w-3xl">
          <SectionHeading title={t('events.formTitle')} text={t('events.formText')} light />
          {status === 'success' ? (
            <div className="mt-10 text-center text-gold-400 bg-white/5 border border-gold-500/30 rounded-md p-8">
              <CheckCircle2 size={32} className="mx-auto mb-3" />
              {t('contact.successMessage')}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input required placeholder={t('contact.namePlaceholder')} value={form.name} onChange={(e) => update('name', e.target.value)} className={inputClass} />
                <input required type="email" placeholder={t('contact.emailPlaceholder')} value={form.email} onChange={(e) => update('email', e.target.value)} className={inputClass} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input type="date" value={form.eventDate} onChange={(e) => update('eventDate', e.target.value)} className={inputClass} />
                <input type="number" min={1} placeholder="Nombre de personnes" value={form.guestCount} onChange={(e) => update('guestCount', e.target.value)} className={inputClass} />
              </div>
              <textarea required rows={4} placeholder={t('contact.messagePlaceholder')} value={form.message} onChange={(e) => update('message', e.target.value)} className={inputClass} />
              <button type="submit" disabled={status === 'sending'} className="btn-gold disabled:opacity-60">
                {status === 'sending' ? t('common.sending') : t('common.send')}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
