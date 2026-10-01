import { useId, useRef, useState } from 'react'
import { GripVertical, ImagePlus, Trash2, Upload } from 'lucide-react'
import { resolveImageUrl, uploadImages } from '@/utils/api'

const ACCEPT = 'image/jpeg,image/png,image/webp,image/avif,image/gif'
const MAX_MB = 5

/** Nom lisible d'un fichier, à partir de son chemin. */
const basename = (src: string) => src.split('/').pop() || src

function Thumb({ src, alt = '' }: { src: string; alt?: string }) {
  return (
    <img
      src={resolveImageUrl(src)}
      alt={alt}
      loading="lazy"
      className="h-16 w-24 shrink-0 border border-gray-200 bg-gray-50 object-cover"
    />
  )
}

/* ------------------------------------------------------------------ */
/* Une seule image                                                     */
/* ------------------------------------------------------------------ */

export function ImageField({ label, value, onChange, help, required }: {
  label: string
  value: string
  onChange: (value: string) => void
  help?: string
  required?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const id = useId()

  async function pick(files: FileList | null) {
    if (!files || files.length === 0) return
    setBusy(true)
    setError('')
    const response = await uploadImages([files[0]])
    setBusy(false)
    if (response.error || !response.data?.[0]) {
      setError(response.error || 'Envoi impossible.')
      return
    }
    onChange(response.data[0].url)
  }

  return (
    <div>
      <span className="block text-sm text-gray-700">{label}</span>

      <div className="mt-1 flex items-start gap-3 border border-gray-300 p-3">
        {value
          ? <Thumb src={value} alt={label} />
          : (
            <div className="grid h-16 w-24 shrink-0 place-items-center border border-dashed border-gray-300 bg-gray-50 text-gray-400">
              <ImagePlus size={20} aria-hidden="true" />
            </div>
          )}

        <div className="min-w-0 flex-1">
          <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
            className="inline-flex items-center gap-2 border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50">
            <Upload size={15} aria-hidden="true" />
            {busy ? 'Envoi…' : value ? 'Remplacer l’image' : 'Choisir une image'}
          </button>

          {value && (
            <button type="button" onClick={() => onChange('')}
              className="ml-2 text-sm text-red-700 hover:underline">
              Retirer
            </button>
          )}

          <p className="mt-2 truncate text-xs text-gray-500" title={value}>
            {value ? basename(value) : 'Aucune image sélectionnée'}
          </p>
        </div>
      </div>

      <input ref={inputRef} id={id} type="file" accept={ACCEPT} className="sr-only"
        onChange={(event) => { void pick(event.target.files); event.target.value = '' }} />

      {/* Rend le champ obligatoire côté formulaire sans exposer de saisie d'URL. */}
      {required && (
        <input
          tabIndex={-1} required value={value} readOnly aria-hidden="true"
          onChange={() => {}}
          className="h-0 w-0 border-0 p-0 opacity-0"
        />
      )}

      {error && <p role="alert" className="mt-1 text-xs text-red-700">{error}</p>}
      <p className="mt-1 text-xs text-gray-500">
        {help ? `${help} ` : ''}JPEG, PNG, WebP, AVIF ou GIF, {MAX_MB} Mo maximum.
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Plusieurs images, ordonnées                                         */
/* ------------------------------------------------------------------ */

export function ImageListField({ label, value, onChange, help }: {
  label: string
  value: string[]
  onChange: (value: string[]) => void
  help?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function add(files: FileList | null) {
    if (!files || files.length === 0) return
    setBusy(true)
    setError('')
    const response = await uploadImages(Array.from(files))
    setBusy(false)
    if (response.error || !response.data) {
      setError(response.error || 'Envoi impossible.')
      return
    }
    onChange([...value, ...response.data.map((file) => file.url)])
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= value.length) return
    const next = [...value]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <div>
      <span className="block text-sm text-gray-700">{label}</span>

      <div className="mt-1 border border-gray-300">
        {value.length === 0 ? (
          <p className="px-3 py-4 text-sm text-gray-500">Aucune image pour le moment.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {value.map((src, index) => (
              <li key={`${src}-${index}`} className="flex items-center gap-3 px-3 py-2">
                <GripVertical size={14} aria-hidden="true" className="shrink-0 text-gray-300" />
                <Thumb src={src} />
                <span className="min-w-0 flex-1 truncate text-xs text-gray-600" title={src}>
                  {index === 0 && (
                    <span className="mr-1 bg-gold-100 px-1.5 py-0.5 text-[11px] text-gold-800">
                      principale
                    </span>
                  )}
                  {basename(src)}
                </span>
                <span className="flex shrink-0 items-center gap-1">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0}
                    aria-label={`Monter l’image ${index + 1}`}
                    className="px-1.5 py-1 text-gray-600 disabled:opacity-30 enabled:hover:bg-gray-100">↑</button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === value.length - 1}
                    aria-label={`Descendre l’image ${index + 1}`}
                    className="px-1.5 py-1 text-gray-600 disabled:opacity-30 enabled:hover:bg-gray-100">↓</button>
                  <button type="button" aria-label={`Retirer l’image ${index + 1}`}
                    onClick={() => onChange(value.filter((unused, i) => i !== index))}
                    className="px-1.5 py-1 text-red-700 hover:bg-red-50">
                    <Trash2 size={14} aria-hidden="true" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="border-t border-gray-200 px-3 py-2">
          <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
            className="inline-flex items-center gap-2 border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50">
            <Upload size={15} aria-hidden="true" />
            {busy ? 'Envoi…' : 'Ajouter des images'}
          </button>
        </div>
      </div>

      <input ref={inputRef} type="file" accept={ACCEPT} multiple className="sr-only"
        onChange={(event) => { void add(event.target.files); event.target.value = '' }} />

      {error && <p role="alert" className="mt-1 text-xs text-red-700">{error}</p>}
      <p className="mt-1 text-xs text-gray-500">
        {help ? `${help} ` : 'La première image sert de visuel principal. '}
        JPEG, PNG, WebP, AVIF ou GIF, {MAX_MB} Mo par fichier.
      </p>
    </div>
  )
}
