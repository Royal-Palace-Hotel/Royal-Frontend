import { ReactNode, useEffect } from 'react'
import { AlertCircle, Check, ChevronLeft, ChevronRight, CircleDot, Search, X } from 'lucide-react'

/**
 * Jetons de visualisation.
 *
 * Les marques de données utilisent une rampe séquentielle bleue, validée sur
 * la surface blanche des cartes (monotone, écarts de clarté suffisants,
 * extrémité claire à 2,11:1). L'or de la marque reste réservé aux éléments
 * interactifs — sans quoi une barre dorée se confondrait avec un bouton.
 */
export const VIZ = {
  bar: '#2a78d6',          // rampe bleue, step 450 — 4,42:1 sur blanc
  barSoft: '#86b6ef',      // step 250
  track: '#cde2fb',        // step 100 — piste du meter, même rampe
  grid: '#e1e0d9',
  axis: '#c3c2b7',
  ink: '#0b0b0b',
  inkSecondary: '#52514e',
  inkMuted: '#898781',
}

/* ------------------------------------------------------------------ */
/* Mise en page                                                        */
/* ------------------------------------------------------------------ */

export function Card({ title, action, children, className = '' }: {
  title?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`bg-white border border-gray-200 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
          {typeof title === 'string' ? <h2 className="font-serif text-lg">{title}</h2> : title}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export function Toolbar({ children }: { children: ReactNode }) {
  // Les filtres vivent sur une seule ligne au-dessus du contenu.
  return <div className="mb-4 flex flex-wrap items-center gap-2">{children}</div>
}

export function SearchInput({ value, onChange, placeholder = 'Rechercher…' }: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <div className="relative">
      <Search size={16} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-56 border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-gold-500"
      />
    </div>
  )
}

export function Select({ value, onChange, options, label }: {
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  label: string
}) {
  return (
    <label className="text-sm text-gray-600">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className="border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gold-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  )
}

export function Button({ children, onClick, variant = 'default', type = 'button', disabled }: {
  children: ReactNode
  onClick?: () => void
  variant?: 'default' | 'gold' | 'ghost' | 'danger'
  type?: 'button' | 'submit'
  disabled?: boolean
}) {
  const styles = {
    default: 'border border-gray-300 bg-white text-charcoal hover:bg-gray-50',
    gold: 'bg-gold-500 text-white hover:bg-gold-600',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'border border-red-200 bg-white text-red-700 hover:bg-red-50',
  }[variant]
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`px-3 py-2 text-sm transition-colors disabled:opacity-50 ${styles}`}>
      {children}
    </button>
  )
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="px-5 py-10 text-center text-sm text-gray-500">{children}</p>
}

export function ErrorBanner({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  return (
    <div role="alert" className="mb-5 flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <AlertCircle size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} aria-label="Masquer l’erreur" className="shrink-0 hover:text-red-900">
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

export function Notice({ message }: { message: string }) {
  return (
    <div role="status" className="mb-5 flex items-center gap-3 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
      <Check size={18} aria-hidden="true" className="shrink-0" />
      <span>{message}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Statuts : pastille + libellé — la couleur ne porte jamais seule le  */
/* sens (l'ambre « en attente » est sous 3:1 sur blanc).               */
/* ------------------------------------------------------------------ */

type StatusTone = 'good' | 'warning' | 'critical' | 'neutral'

const TONES: Record<StatusTone, { dot: string; text: string; bg: string }> = {
  good: { dot: '#0ca30c', text: '#0a6b0a', bg: '#e7f6e7' },      // texte 6,00:1
  warning: { dot: '#fab219', text: '#8a5a00', bg: '#fdf3dd' },   // texte 5,37:1
  critical: { dot: '#d03b3b', text: '#a32020', bg: '#fbe9e9' },  // texte 6,44:1
  neutral: { dot: '#898781', text: '#52514e', bg: '#f3f4f6' },   // texte 7,21:1
}

export const BOOKING_STATUS: Record<string, { label: string; tone: StatusTone }> = {
  pending: { label: 'En attente', tone: 'warning' },
  confirmed: { label: 'Confirmée', tone: 'good' },
  cancelled: { label: 'Annulée', tone: 'critical' },
}

export const MESSAGE_STATUS: Record<string, { label: string; tone: StatusTone }> = {
  new: { label: 'Nouveau', tone: 'warning' },
  read: { label: 'Lu', tone: 'neutral' },
  replied: { label: 'Répondu', tone: 'good' },
  archived: { label: 'Archivé', tone: 'neutral' },
}

export function StatusBadge({ status, map }: {
  status: string
  map: Record<string, { label: string; tone: StatusTone }>
}) {
  const entry = map[status] ?? { label: status, tone: 'neutral' as StatusTone }
  const tone = TONES[entry.tone]
  return (
    <span style={{ backgroundColor: tone.bg, color: tone.text }}
      className="inline-flex items-center gap-1.5 whitespace-nowrap px-2 py-1 text-xs font-medium">
      <span aria-hidden="true" style={{ backgroundColor: tone.dot }} className="h-2 w-2 rounded-full" />
      {entry.label}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Pagination                                                          */
/* ------------------------------------------------------------------ */

export function Pagination({ meta, onPage }: {
  meta?: { page: number; perPage: number; total: number; totalPages: number }
  onPage: (page: number) => void
}) {
  if (!meta || meta.total === 0) return null
  const first = (meta.page - 1) * meta.perPage + 1
  const last = Math.min(meta.page * meta.perPage, meta.total)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-5 py-3 text-sm text-gray-600">
      <span>
        {first}–{last} sur {meta.total}
      </span>
      <div className="flex items-center gap-1">
        <button onClick={() => onPage(meta.page - 1)} disabled={meta.page <= 1}
          aria-label="Page précédente"
          className="p-2 disabled:opacity-40 enabled:hover:bg-gray-100">
          <ChevronLeft size={16} aria-hidden="true" />
        </button>
        <span aria-current="page">Page {meta.page} / {meta.totalPages}</span>
        <button onClick={() => onPage(meta.page + 1)} disabled={meta.page >= meta.totalPages}
          aria-label="Page suivante"
          className="p-2 disabled:opacity-40 enabled:hover:bg-gray-100">
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Panneau latéral (détail d'une réservation, d'un message)            */
/* ------------------------------------------------------------------ */

export function Drawer({ title, onClose, children, footer }: {
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button className="absolute inset-0 bg-black/40" aria-label="Fermer le panneau" onClick={onClose} />
      <aside role="dialog" aria-modal="true" aria-label={title}
        className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="font-serif text-lg">{title}</h2>
          <button onClick={onClose} aria-label="Fermer" className="p-2 text-gray-500 hover:bg-gray-100 hover:text-charcoal">
            <X size={18} aria-hidden="true" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <footer className="border-t border-gray-200 px-5 py-4">{footer}</footer>}
      </aside>
    </div>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="py-2">
      <dt className="text-xs uppercase tracking-wider text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-charcoal">{children || <span className="text-gray-400">—</span>}</dd>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Figures : tuile, meter, barres, colonnes                            */
/* ------------------------------------------------------------------ */

/** Chiffres proportionnels pour les grandes valeurs ; tabulaires en colonne. */
export function StatTile({ label, value, hint, tone }: {
  label: string
  value: string | number
  hint?: string
  tone?: StatusTone
}) {
  const accent = tone ? TONES[tone] : null
  return (
    <div className="bg-white border border-gray-200 px-5 py-4">
      <div className="flex items-center gap-2">
        {accent && <span aria-hidden="true" style={{ backgroundColor: accent.dot }} className="h-2 w-2 rounded-full" />}
        <p className="text-sm text-gray-600">{label}</p>
      </div>
      <p className="mt-2 font-sans text-3xl font-semibold text-charcoal">{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  )
}

/** Ratio contre une limite : piste = step clair de la même rampe. */
export function Meter({ label, rate, hint }: { label: string; rate: number; hint?: string }) {
  const clamped = Math.max(0, Math.min(rate, 100))
  return (
    <div className="bg-white border border-gray-200 px-5 py-4">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="mt-2 font-sans text-3xl font-semibold text-charcoal">{clamped.toFixed(1)} %</p>
      <div role="img" aria-label={`${label} : ${clamped.toFixed(1)} %`}
        className="mt-3 h-2 w-full overflow-hidden" style={{ backgroundColor: VIZ.track }}>
        <div className="h-full" style={{ width: `${clamped}%`, backgroundColor: VIZ.bar }} />
      </div>
      {hint && <p className="mt-2 text-xs text-gray-500">{hint}</p>}
    </div>
  )
}

/**
 * Barres horizontales — comparer des grandeurs.
 * Une seule série : pas de légende, le titre de la carte dit ce qui est tracé.
 * Valeur directement au bout de chaque barre, donc rien n'est caché au survol.
 */
export function BarList({ items, emptyLabel = 'Aucune donnée.' }: {
  items: Array<{ label: string; value: number; hint?: string }>
  emptyLabel?: string
}) {
  if (items.length === 0) return <EmptyState>{emptyLabel}</EmptyState>
  const max = Math.max(...items.map((item) => item.value), 1)

  return (
    <ul className="divide-y divide-gray-100">
      {items.map((item) => (
        <li key={item.label} className="px-5 py-3 hover:bg-gray-50" title={`${item.label} : ${item.value}`}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate text-charcoal">{item.label}</span>
            <span className="shrink-0 tabular-nums text-gray-600">
              {item.value}{item.hint ? <span className="text-gray-400"> · {item.hint}</span> : null}
            </span>
          </div>
          {/* Barre <= 24px, extrémité arrondie 4px, ancrée à la ligne de base. */}
          <div className="mt-2 h-2.5 w-full" style={{ backgroundColor: 'transparent' }}>
            <div className="h-full"
              style={{
                width: `${Math.max((item.value / max) * 100, 1.5)}%`,
                backgroundColor: VIZ.bar,
                borderRadius: '0 4px 4px 0',
              }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

/**
 * Colonnes — évolution dans le temps.
 * Grille en filet 1px, valeur sur la tête de colonne, 2px de surface entre
 * colonnes voisines (via le gap de la flex).
 */
export function ColumnChart({ items, emptyLabel = 'Aucune donnée.' }: {
  items: Array<{ label: string; value: number }>
  emptyLabel?: string
}) {
  if (items.length === 0) return <EmptyState>{emptyLabel}</EmptyState>
  const max = Math.max(...items.map((item) => item.value), 1)

  return (
    <div className="px-5 py-5">
      <div className="relative flex items-end gap-[2px] border-b" style={{ height: 150, borderColor: VIZ.axis }}>
        {/* Deux filets de repère, récessifs et non pointillés. */}
        {[0.5, 1].map((fraction) => (
          <span key={fraction} aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 border-t"
            style={{ bottom: `${fraction * 100}%`, borderColor: VIZ.grid }} />
        ))}
        {items.map((item) => (
          <div key={item.label} className="group relative flex flex-1 flex-col items-center justify-end"
            title={`${item.label} : ${item.value}`}>
            <span className="mb-1 text-xs tabular-nums text-gray-600">{item.value}</span>
            <div className="w-full" style={{ maxWidth: 24 }}>
              <div style={{
                height: Math.max((item.value / max) * 110, 2),
                backgroundColor: VIZ.bar,
                borderRadius: '4px 4px 0 0',
              }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-[2px]">
        {items.map((item) => (
          <span key={item.label} className="flex-1 text-center text-xs" style={{ color: VIZ.inkMuted }}>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export function Spinner({ label = 'Chargement…' }: { label?: string }) {
  return (
    <p className="flex items-center gap-2 px-5 py-10 text-sm text-gray-500">
      <CircleDot size={16} aria-hidden="true" className="animate-spin" />
      {label}
    </p>
  )
}
