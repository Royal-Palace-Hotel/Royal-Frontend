import { Link } from 'react-router-dom'

export default function CtaBanner() {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <img
        src="/images/imageOrigine/Photo-footer-1.jpg"
        alt="Royal Palace Antsirabe"
        className="absolute inset-0 w-full h-full object-cover object-center"
        loading="lazy"
      />
      {/* Dark elegant gradient over building photo */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#090b10]/75 via-[#0b0e14]/85 to-[#0e0e0e]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white tracking-wide leading-snug">
          Offrez-vous dès aujourd’hui une expérience
          <br className="hidden sm:inline" /> unique, entre{' '}
          <span className="italic font-normal">raffinement et sérénité.</span>
        </h2>
        <Link
          to="/contact#booking"
          className="mt-8 inline-block bg-[#FDF4E9] hover:bg-white text-charcoal font-medium text-xs tracking-widest uppercase px-9 py-3.5 rounded-full transition-all shadow-md transform hover:-translate-y-0.5"
        >
          RÉSERVEZ
        </Link>
      </div>
    </section>
  )
}
