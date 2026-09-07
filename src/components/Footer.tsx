import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Facebook, Instagram, MapPin, Phone, Mail } from 'lucide-react'
import { useState } from 'react'

export default function Footer() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    // eslint-disable-next-line no-console
    console.log('[Royal Palace] Newsletter signup:', email)
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="bg-charcoal text-white/80">
      <div className="container-luxe py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* About */}
        <div>
          <div className="font-serif text-xl text-white tracking-wider mb-4">ROYAL PALACE</div>
          <p className="text-sm leading-relaxed">{t('footer.aboutText')}</p>
          <div className="flex items-center gap-4 mt-5">
            <a href="https://www.facebook.com/hotelroyalpalaceantsirabe" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-gold-500 transition-colors">
              <Facebook size={20} />
            </a>
            <a href="https://www.instagram.com/hotelroyalpalace_antsirabe/" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-gold-500 transition-colors">
              <Instagram size={20} />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <div className="text-white uppercase tracking-widest2 text-xs mb-5 font-medium">{t('footer.linksTitle')}</div>
          <ul className="space-y-3 text-sm">
            <li><Link to="/chambres-suites" className="hover:text-gold-500 transition-colors">{t('nav.rooms')}</Link></li>
            <li><Link to="/restaurant" className="hover:text-gold-500 transition-colors">{t('nav.restaurant')}</Link></li>
            <li><Link to="/piscine-bien-etre" className="hover:text-gold-500 transition-colors">{t('nav.spa')}</Link></li>
            <li><Link to="/reunions-evenements" className="hover:text-gold-500 transition-colors">{t('nav.events')}</Link></li>
            <li><Link to="/decouvrir-antsirabe" className="hover:text-gold-500 transition-colors">{t('nav.discover')}</Link></li>
            <li><Link to="/contact" className="hover:text-gold-500 transition-colors">{t('nav.contact')}</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <div className="text-white uppercase tracking-widest2 text-xs mb-5 font-medium">{t('footer.contactTitle')}</div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 text-gold-500 shrink-0" />
              <span>{t('footer.address')}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-gold-500 shrink-0" />
              <a href="tel:+261344904040" className="hover:text-gold-500 transition-colors">+261 34 49 040 40</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-gold-500 shrink-0" />
              <a href="mailto:royalpalace.resa@moov.mg" className="hover:text-gold-500 transition-colors">royalpalace.resa@moov.mg</a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <div className="text-white uppercase tracking-widest2 text-xs mb-5 font-medium">{t('footer.newsletterTitle')}</div>
          <p className="text-sm mb-4">{t('footer.newsletterText')}</p>
          {subscribed ? (
            <p className="text-gold-400 text-sm">✓ Merci de votre inscription !</p>
          ) : (
            <form onSubmit={handleNewsletter} className="flex">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.newsletterPlaceholder')}
                className="bg-white/10 border border-white/20 text-sm px-4 py-2.5 w-full focus:outline-none focus:border-gold-500 placeholder:text-white/40"
              />
              <button type="submit" className="bg-gold-500 hover:bg-gold-600 px-4 text-white transition-colors" aria-label="Subscribe">
                →
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container-luxe flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/50">
          <span>© {new Date().getFullYear()} Royal Palace Antsirabe. {t('footer.rights')}</span>
          <span>Madagascar</span>
        </div>
      </div>
    </footer>
  )
}
