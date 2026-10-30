import { useState } from 'react'
import { X, Utensils, Wine, Phone } from 'lucide-react'
import HeroBanner from '@/components/HeroBanner'
import CtaBanner from '@/components/CtaBanner'
import AnimatedSection from '@/components/AnimatedSection'

const snackMenuImages = [
  { src: '/images/menu/snack-menu-1-uhd.jpg', alt: 'Menu snack Royal Palace - page 1', width: 2435, height: 3475 },
  { src: '/images/menu/snack-menu-2-uhd.jpg', alt: 'Menu snack Royal Palace - page 2', width: 2455, height: 3480 },
]

const menuItems = [
  { name: 'Foie gras poêlé de Behenjy aux baies roses', price: '48 000 Ar', desc: 'Brioche toastée maison et chutney de mangues caramélisées' },
  { name: 'Carpaccio de zébu aux agrumes d’Antsirabe', price: '36 000 Ar', desc: 'Huile d’olive parfumée au combava et copeaux de fromage local' },
  { name: 'Filet de zébu royal en croûte d’herbes', price: '54 000 Ar', desc: 'Mousseline de patates douces et jus corsé à la vanille de Madagascar' },
  { name: 'Pavé de truite de Mantasoa rôti', price: '52 000 Ar', desc: 'Légumes croquants du Vakinankaratra et émulsion au poivre vert' },
  { name: 'Romazava royal aux brèdes mafana et viandes confites', price: '46 000 Ar', desc: 'Riz rouge malgache parfumé et rougail tomates fraîches' },
  { name: 'Soufflé chaud au chocolat noir grand cru de Sambirano', price: '28 000 Ar', desc: 'Glace artisanale à la vanille bourbon' },
]

const drinksItems = [
  { name: 'Cocktail Signature Royal Palace', price: '26 000 Ar', desc: 'Rhum arrangé maison, jus de litchi frais, curaçao bleu, citron vert' },
  { name: 'Coucher de Soleil d’Antsirabe', price: '24 000 Ar', desc: 'Cocktail dégradé fraise, mangue, orange et touche de rhum blanc' },
  { name: 'Jus frais pressés du verger', price: '14 000 Ar', desc: 'Orange, ananas, papaye ou corossol selon arrivage' },
  { name: 'Sélection de vins français & sud-africains', price: 'À partir de 95 000 Ar / bt', desc: 'Bordeaux, Bourgogne, Côtes-du-Rhône, Chenin Blanc' },
  { name: 'Vins de Madagascar (Clos Malaza / Lazan’i Betsileo)', price: '55 000 Ar / bt', desc: 'Gris, rouge et blanc' },
  { name: 'Café d’excellence et infusions aux herbes des hauts plateaux', price: '8 000 Ar', desc: 'Arabica torréfié localement' },
]

export default function Restaurant() {
  const [modalType, setModalType] = useState<'menu' | 'drinks' | null>(null)

  return (
    <div className="bg-white">
      {/* 1. Hero matching Screenshot 3 avec la photo originale de Bar & Restaurants */}
      <HeroBanner
        image="/images/imageOrigine/Photo-Bar-et-Restaurants.jpg"
        stars={3}
        eyebrow="LA RESTAURATION"
        title="Une expérience gastronomique"
        titleItalic="unique en 3 étoiles"
        buttonText="RÉSERVEZ"
        buttonLink="/contact#booking"
      />

      {/* 2. Section Saveurs authentiques (White Background) */}
      <AnimatedSection className="py-20 md:py-28 px-6 max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-wide mb-8 leading-tight">
          Saveurs authentiques et{' '}
          <span className="italic font-normal">moments conviviaux</span> à Antsirabe
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed font-light mb-10">
          Ici, la gastronomie se savoure simplement et avec goût. Entre recettes locales et inspirations
          internationales, notre restaurant vous offre une expérience gourmande qui ravira vos papilles
          tout en vous faisant sentir comme chez vous.
        </p>

        {/* 2 Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setModalType('menu')}
            className="w-full sm:w-auto bg-[#FAF3EA] hover:bg-[#F3E5D3] text-charcoal font-medium text-xs tracking-widest uppercase px-8 py-3.5 rounded-full transition-all shadow-sm border border-charcoal/5"
          >
            DÉCOUVREZ NOTRE MENU
          </button>
          <button
            type="button"
            onClick={() => setModalType('drinks')}
            className="w-full sm:w-auto bg-[#FAF3EA] hover:bg-[#F3E5D3] text-charcoal font-medium text-xs tracking-widest uppercase px-8 py-3.5 rounded-full transition-all shadow-sm border border-charcoal/5"
          >
            NOTRE CARTE DES BOISSONS
          </button>
        </div>
      </AnimatedSection>

      <section className="bg-[#FAF7F2] py-20 md:py-28 px-6">
        <AnimatedSection className="max-w-5xl mx-auto text-center" direction="up">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#C6A87D] font-medium mb-3">
            À TOUTE HEURE
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal mb-4">
            Notre menu snack
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-light max-w-xl mx-auto mb-10">
            Une carte gourmande à découvrir sur place, à partager ou à savourer en toute simplicité.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {snackMenuImages.map((menu, index) => (
              <AnimatedSection key={menu.src} delay={index * 0.12} direction={index === 0 ? 'left' : 'right'}>
                <div className="overflow-hidden rounded-sm border border-[#C6A87D]/40 bg-white shadow-card">
                  <img
                    src={menu.src}
                    alt={menu.alt}
                    width={menu.width}
                    height={menu.height}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto block"
                  />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* 3. Section Une table accueillante avec les 3 photos d'origine */}
      <section className="bg-[#FAF3EA] py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif italic text-3xl md:text-4xl text-center text-charcoal mb-16 font-normal">
            Une table accueillante pour{' '}
            <span className="italic font-normal">voyageurs et gourmands</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Terrasse */}
            <div className="flex flex-col">
              <div className="aspect-[4/5] rounded-sm overflow-hidden mb-6 shadow-sm">
                <img
                  src="/images/imageOrigine/Photo-restaurant-1.webp"
                  alt="Cadre élégant et chaleureux"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
                Un cadre élégant et chaleureux, idéal pour partager un moment de qualité. Découvrez un
                lieu où raffinement et convivialité se rencontrent.
              </p>
            </div>

            {/* Card 2: Plat gastronomique */}
            <div className="flex flex-col">
              <div className="aspect-[4/5] rounded-sm overflow-hidden mb-6 shadow-sm">
                <img
                  src="/images/imageOrigine/Photo-nourriture-1.webp"
                  alt="Plats raffinés"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
                Des plats raffinés, préparés avec soin et passion. Chaque assiette révèle des saveurs
                délicates et gourmandes.
              </p>
            </div>

            {/* Card 3: Cocktails & Bar */}
            <div className="flex flex-col">
              <div className="aspect-[4/5] rounded-sm overflow-hidden mb-6 shadow-sm">
                <img
                  src="/images/imageOrigine/photo-boisson.webp"
                  alt="Cocktails créatifs"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
                Cocktails créatifs, jus frais naturels et vins soigneusement sélectionnés. Notre bar a
                été pensé pour éveiller tous vos sens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section Venez découvrir nos créations */}
      <section className="relative py-24 md:py-32 px-6 overflow-hidden">
        <img
          src="/images/imageOrigine/photo-boisson.webp"
          alt="Ambiance restaurant"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-95"
        />
        <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px]" />

        <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-wide mb-8">
            Venez découvrir <span className="italic font-normal">nos créations</span>
          </h2>
          <a
            href="tel:+261344904040"
            className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-black text-white text-xs sm:text-sm font-medium tracking-widest uppercase px-8 py-3.5 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <Phone size={16} />
            <span>+261 34 49 040 40</span>
          </a>
        </div>
      </section>

      {/* 5. Pre-footer CTA banner */}
      <CtaBanner />

      {/* Menu / Drinks Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-10 shadow-2xl relative">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              aria-label="Fermer"
            >
              <X size={22} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              {modalType === 'menu' ? (
                <Utensils className="text-gold-600" size={24} />
              ) : (
                <Wine className="text-gold-600" size={24} />
              )}
              <h3 className="font-serif text-2xl text-charcoal">
                {modalType === 'menu' ? 'Notre Menu Gastronomique' : 'Notre Carte des Boissons'}
              </h3>
            </div>

            <div className="divide-y divide-gray-100 space-y-4">
              {(modalType === 'menu' ? menuItems : drinksItems).map((item, idx) => (
                <div key={idx} className="pt-4 first:pt-0">
                  <div className="flex justify-between items-baseline gap-4 mb-1">
                    <h4 className="font-serif text-base text-charcoal font-medium">{item.name}</h4>
                    <span className="text-gold-700 font-semibold text-sm whitespace-nowrap">
                      {item.price}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-light">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-gray-400">
                Service continu 7j/7 de 6h30 à 22h00
              </span>
              <a
                href="tel:+261344904040"
                className="inline-flex items-center gap-2 bg-charcoal text-white text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:bg-black transition-all"
              >
                <span>Réserver une table</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
