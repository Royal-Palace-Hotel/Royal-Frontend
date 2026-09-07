interface SectionHeadingProps {
  eyebrow?: string
  title: string
  text?: string
  center?: boolean
  light?: boolean
}

export default function SectionHeading({ eyebrow, title, text, center = true, light = false }: SectionHeadingProps) {
  return (
    <div className={center ? 'text-center max-w-3xl mx-auto' : ''}>
      {eyebrow && <div className={light ? 'section-eyebrow !text-gold-400' : 'section-eyebrow'}>{eyebrow}</div>}
      <h2 className={light ? 'section-title text-white' : 'section-title'}>{title}</h2>
      {text && <p className={light ? 'mt-5 text-white/80 leading-relaxed' : 'mt-5 text-gray-600 leading-relaxed'}>{text}</p>}
    </div>
  )
}
