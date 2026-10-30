import { Link } from 'react-router-dom'
import { Instagram, Facebook, Youtube, Phone, Mail, MapPin } from 'lucide-react'

// WhatsApp icon component
function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-[#0e0e0e] text-white/80 pt-16 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-xs leading-relaxed">
        {/* Col 1: Logo + Description */}
        <div className="space-y-4">
          <Link to="/" className="inline-block">
            <img
              src="/images/logo.png"
              alt="Royal Palace Antsirabe"
              className="h-16 w-auto object-contain"
            />
          </Link>
          <p className="text-white/60 text-[11px] leading-relaxed max-w-xs">
            Offrez-vous une expérience unique, où chaque détail est pensé pour votre bien-être :
            chambres spacieuses, service d’exception et atmosphère prestigieuse font de votre séjour un
            véritable moment d’exception.
          </p>
        </div>

        {/* Col 2: Accès rapides */}
        <div>
          <h4 className="font-serif italic text-white text-base mb-4 font-normal">Liens rapides</h4>
          <ul className="space-y-2.5 text-white/70 text-[12px]">
            <li>
              <Link to="/chambres-suites" className="hover:text-gold-400 transition-colors">
                Chambres & Suites
              </Link>
            </li>
            <li>
              <Link to="/restaurant" className="hover:text-gold-400 transition-colors">
                Restaurant
              </Link>
            </li>
            <li>
              <Link to="/piscine-bien-etre" className="hover:text-gold-400 transition-colors">
                Piscine & Bien-être
              </Link>
            </li>
            <li>
              <Link to="/reunions-evenements" className="hover:text-gold-400 transition-colors">
                Réunions & Événements
              </Link>
            </li>
            <li>
              <Link to="/decouvrir-antsirabe" className="hover:text-gold-400 transition-colors">
                Découvrir Antsirabe
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-gold-400 transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Coordonnées */}
        <div>
          <h4 className="font-serif italic text-white text-base mb-4 font-normal">Coordonnées</h4>
          <div className="space-y-2.5 text-white/70 text-[12px]">
            <p className="leading-relaxed">
              Lot 512 C 61 Tsarasoatra Route d’Ambositra,
              <br />
              Rue D’ Ambositra, Antsirabe 110, Madagascar
            </p>
            <p>
              <a href="tel:0204449040" className="hover:text-gold-400 transition-colors">
                020 44 490 40
              </a>
            </p>
            <p>
              <a href="tel:0344904040" className="hover:text-gold-400 transition-colors">
                034 49 040 40
              </a>
            </p>
            <p>
              <a
                href="mailto:royalpalace.resa@moov.mg"
                className="hover:text-gold-400 transition-colors break-all"
              >
                royalpalace.resa@moov.mg
              </a>
            </p>
          </div>
        </div>

        {/* Col 4: Rejoignez-nous */}
        <div>
          <h4 className="font-serif italic text-white text-base mb-4 font-normal">Rejoignez-nous</h4>
          <div className="flex items-center gap-4 text-white/80">
            <a
              href="https://wa.me/261344904040"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="hover:text-gold-400 transition-colors p-1"
            >
              <WhatsAppIcon className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/hotelroyalpalace_antsirabe/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-gold-400 transition-colors p-1"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://www.facebook.com/hotelroyalpalaceantsirabe"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="hover:text-gold-400 transition-colors p-1"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="hover:text-gold-400 transition-colors p-1"
            >
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
        <div className="flex items-center gap-4">
          <Link to="/contact" className="hover:text-white/60 transition-colors">
            Mentions légales
          </Link>
          <span>|</span>
          <Link to="/contact" className="hover:text-white/60 transition-colors">
            Plan du site
          </Link>
        </div>
        <p>Copyright © 2025. Tous droits réservés.</p>
      </div>
    </footer>
  )
}
