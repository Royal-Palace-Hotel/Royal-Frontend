import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

interface HeroBannerProps {
  image: string
  stars?: number
  eyebrow: string
  title: string
  titleItalic: string
  buttonText?: string
  buttonLink?: string
}

export default function HeroBanner({
  image,
  stars = 3,
  eyebrow,
  title,
  titleItalic,
  buttonText = 'RÉSERVEZ',
  buttonLink = '/contact#booking',
}: HeroBannerProps) {
  return (
    <section className="relative h-[85vh] min-h-[520px] max-h-[780px] w-full overflow-hidden">
      {/* Background Image */}
      <img
        src={image}
        alt={eyebrow}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      {/* Dark elegant overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Hero Content */}
      <div className="relative z-10 h-full max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center pt-16">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          {/* Stars */}
          <div className="flex items-center gap-1.5 text-white/90 text-sm mb-3 tracking-widest">
            {Array.from({ length: stars }).map((_, i) => (
              <span key={i} className="text-white">★</span>
            ))}
          </div>

          {/* Eyebrow with horizontal line decorators */}
          <div className="flex items-center justify-center gap-3 text-white/90 text-[11px] md:text-xs tracking-[0.25em] uppercase font-light mb-4">
            <span className="h-px w-8 sm:w-12 bg-white/60" />
            <span>{eyebrow}</span>
            <span className="h-px w-8 sm:w-12 bg-white/60" />
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-wide font-normal max-w-3xl leading-tight">
            {title} <span className="italic font-normal">{titleItalic}</span>
          </h1>

          {/* Action Button */}
          {buttonText && (
            <Link
              to={buttonLink}
              className="mt-8 bg-[#FDF4E9] hover:bg-white text-charcoal font-medium text-[11px] md:text-xs tracking-widest uppercase px-8 py-3 rounded-full transition-all duration-300 shadow-md transform hover:-translate-y-0.5"
            >
              {buttonText}
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  )
}

