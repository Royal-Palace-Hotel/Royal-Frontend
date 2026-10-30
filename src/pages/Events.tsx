import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Users, Sparkles, Check } from 'lucide-react'
import HeroBanner from '@/components/HeroBanner'
import CtaBanner from '@/components/CtaBanner'

export default function Events() {
  const [modalOpen, setModalOpen] = useState<'fete' | 'reunions' | null>(null)

  return (
    <div className="bg-white">
      {/* 1. Hero matching Mockup 1 avec la photo officielle Événements */}
      <HeroBanner
        image="/images/imageOrigine/Photo-Evenements-1200.jpg"
        stars={3}
        eyebrow="ÉVÉNEMENTS"
        title="Organisez votre événement"
        titleItalic="à Antsirabe"
        buttonText="RÉSERVEZ"
        buttonLink="/contact#booking"
      />

      {/* 2. Section: Un hôtel 3* au centre d'Antsirabe */}
      <section className="py-20 md:py-28 px-6 max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-wide mb-2 leading-tight">
          Un hôtel 3* au centre d’Antsirabe
        </h2>
        <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-charcoal tracking-wide mb-8 font-normal">
          L’endroit idéal pour vos événements
        </h3>

        <div className="space-y-4 text-xs sm:text-sm text-gray-500 font-light leading-relaxed max-w-2xl mx-auto mb-16">
          <p>
            Un lieu où l’on se retrouve pour célébrer les moments importants de la vie, en famille ou entre amis.
          </p>
          <p>
            Mais aussi une adresse idéale pour vos événements professionnels : réunir vos collègues,
            renforcer l’esprit d’équipe et stimuler la créativité au fil des échanges. Chaque rencontre
            devient l’occasion de créer des souvenirs et de nouvelles idées.
          </p>
        </div>

        {/* 2 Cards Grid avec photos d'origine */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center max-w-3xl mx-auto">
          {/* Card 1: Fête */}
          <div className="flex flex-col items-center">
            <div className="w-full aspect-[16/10] rounded-sm overflow-hidden mb-6 shadow-sm">
              <img
                src="/images/imageOrigine/Photo-Bloc-1.webp"
                alt="Une fête à Antsirabe"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <h4 className="font-serif text-lg sm:text-xl text-charcoal mb-3 font-normal">
              Une fête à Antsirabe, un lieu rien que pour vous
            </h4>
            <p className="text-xs text-gray-500 font-light leading-relaxed mb-6 max-w-sm">
              L’hôtel Le Royal Palace dispose de 35 chambres et suites, d’un restaurant, d’un bar et
              d’un spa idéalement situé à Antsirabe. Ensemble, créons l’événement parfait.
            </p>
            <button
              type="button"
              onClick={() => setModalOpen('fete')}
              className="mt-auto bg-[#FAF3EA] hover:bg-[#F3E5D3] text-charcoal font-medium text-[11px] tracking-widest uppercase px-8 py-3 rounded-full transition-all shadow-sm border border-charcoal/5"
            >
              EN SAVOIR PLUS
            </button>
          </div>

          {/* Card 2: Réunions */}
          <div className="flex flex-col items-center">
            <div className="w-full aspect-[16/10] rounded-sm overflow-hidden mb-6 shadow-sm">
              <img
                src="/images/imageOrigine/Photo-Bloc-2.webp"
                alt="Réunions et événements"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <h4 className="font-serif text-lg sm:text-xl text-charcoal mb-3 font-normal">
              Réunions et événements
            </h4>
            <p className="text-xs text-gray-500 font-light leading-relaxed mb-6 max-w-sm">
              Une parenthèse pour vos équipes, qu’il s’agisse de séminaires, de brainstorming, de
              réunions ou de teambuilding.
            </p>
            <button
              type="button"
              onClick={() => setModalOpen('reunions')}
              className="mt-auto bg-[#FAF3EA] hover:bg-[#F3E5D3] text-charcoal font-medium text-[11px] tracking-widest uppercase px-8 py-3 rounded-full transition-all shadow-sm border border-charcoal/5"
            >
              EN SAVOIR PLUS
            </button>
          </div>
        </div>
      </section>

      {/* 3. Section: Pour en savoir plus, contactez-nous avec photo boissons d'origine */}
      <section className="relative py-24 md:py-28 px-6 overflow-hidden">
        <img
          src="/images/imageOrigine/photo-boisson.webp"
          alt="Ambiance bar & cocktails"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-95"
        />
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />

        <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-wide mb-8">
            Pour en savoir plus, <span className="italic font-normal">contactez-nous</span>
          </h2>
          <Link
            to="/contact"
            className="inline-block bg-[#1A1A1A] hover:bg-black text-white text-xs sm:text-sm font-medium tracking-widest uppercase px-9 py-3.5 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            CONTACTEZ-NOUS
          </Link>
        </div>
      </section>

      {/* 4. Pre-footer CTA */}
      <CtaBanner />

      {/* Detail Modals */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-10 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              aria-label="Fermer"
            >
              <X size={22} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              {modalOpen === 'fete' ? (
                <Sparkles className="text-gold-600" size={24} />
              ) : (
                <Users className="text-gold-600" size={24} />
              )}
              <h3 className="font-serif text-2xl text-charcoal">
                {modalOpen === 'fete'
                  ? 'Privatisation & Événements Privés'
                  : 'Séminaires & Réunions Professionnelles'}
              </h3>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-6 font-light">
              {modalOpen === 'fete'
                ? 'Mariages, anniversaires, dîners de gala ou réunions de famille au bord de la piscine illuminée. Nous mettons à votre disposition notre service traiteur sur-mesure, sonorisation, décoration et hébergements pour vos convives.'
                : 'Salles climatisées et modulables pouvant accueillir jusqu’à 120 participants. Équipement high-tech complet : vidéoprojecteur laser, sonorisation professionnelle, micros sans fil, Wi-Fi très haut débit et pauses café gourmandes.'}
            </p>

            <div className="space-y-3 mb-8">
              {(modalOpen === 'fete'
                ? [
                    'Privatisation de la terrasse et du bord de piscine',
                    'Menus gastronomiques personnalisés (buffet ou service à table)',
                    'Formule hébergement avec tarifs préférentiels pour vos invités',
                    'Accompagnement dédié par notre coordinateur d’événements',
                  ]
                : [
                    'Disposition au choix (théâtre, banquet, école, en U)',
                    'Vidéoprojecteur HD, écran géant et paperboard numérique',
                    'Pauses café avec viennoiseries artisanales et jus frais locaux',
                    'Déjeuners d’affaires sur la terrasse du restaurant',
                  ]
              ).map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs text-charcoal/80">
                  <Check size={16} className="text-gold-600 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-gray-400">Devis gratuit et personnalisé sous 24h</span>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-charcoal text-white text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:bg-black transition-all"
              >
                <span>Demander un devis</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
