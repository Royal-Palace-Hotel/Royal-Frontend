import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Languages } from 'lucide-react'
import { adminApi } from '@/utils/api'
import { Button, Card, EmptyState, ErrorBanner, Notice, Spinner } from './ui'
import { ImageField, ImageListField } from './ImageField'
import { useTranslator } from './useTranslator'

export interface FieldSpec {
  key: string
  label: string
  /** `image` : une pièce jointe. `imageList` : plusieurs, ordonnées. */
  type?: 'text' | 'number' | 'date' | 'textarea' | 'select' | 'checkbox' | 'list' | 'image' | 'imageList'
  options?: Array<{ value: string; label: string }>
  /** Options chargées depuis un autre endpoint (ex. sections de la carte). */
  optionsFrom?: { endpoint: string; value: string; label: string }
  optional?: boolean
  help?: string
  /** Envoyer `null` plutôt qu'une chaîne vide (colonnes nullable). */
  nullWhenEmpty?: boolean
  /**
   * Champ anglais : clé du champ français dont il est la traduction. Il se
   * remplit alors tout seul quand on quitte le champ source (s'il est encore
   * vide) et reçoit un bouton « Traduire ». Il reste un champ comme les autres :
   * la proposition est modifiable, et c'est la valeur affichée qui est envoyée.
   */
  translateFrom?: string
}

export interface ResourceSpec {
  endpoint: string
  title: string
  fields: FieldSpec[]
  columns: Array<{ label: string; value: (row: any) => React.ReactNode }>
  /** Valeurs par défaut d'un nouvel élément. */
  defaults?: Record<string, string>
  addLabel?: string
}

const asFormValue = (value: unknown): string => {
  if (value === null || value === undefined) return ''
  if (Array.isArray(value)) return value.join('\n')
  if (typeof value === 'boolean') return value ? 'true' : ''
  return String(value)
}

export default function ResourceManager({ spec }: { spec: ResourceSpec }) {
  const [rows, setRows] = useState<any[]>([])
  const [form, setForm] = useState<Record<string, string>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [remoteOptions, setRemoteOptions] = useState<Record<string, Array<{ value: string; label: string }>>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const translator = useTranslator()

  /**
   * Dernier texte français traduit pour chaque champ anglais. Traverser un champ
   * sans le modifier ne doit pas relancer un appel, et vider la traduction à la
   * main ne doit pas la faire revenir au prochain passage.
   */
  const lastTranslated = useRef<Record<string, string>>({})

  /**
   * Traductions obtenues et pas encore retouchées à la main, et appels encore en
   * vol. `save` s'appuie sur les deux : cliquer « Ajouter » juste après avoir
   * saisi le français déclenche la traduction (au `blur`) et l'envoi dans le même
   * mouvement, et la valeur n'est pas encore revenue dans l'état du formulaire.
   */
  const translated = useRef<Record<string, string>>({})
  const inFlight = useRef(new Set<Promise<unknown>>())

  function track(work: Promise<unknown>) {
    // Neutralisé : une traduction qui échoue ne doit pas faire échouer le
    // `Promise.all` de l'enregistrement.
    const settled = work.catch(() => undefined)
    inFlight.current.add(settled)
    void settled.finally(() => inFlight.current.delete(settled))
  }

  /** Champs anglais regroupés par champ source. */
  const translationTargets = useMemo(() => {
    const targets = new Map<string, FieldSpec[]>()
    for (const field of spec.fields) {
      if (!field.translateFrom) continue
      targets.set(field.translateFrom, [...(targets.get(field.translateFrom) ?? []), field])
    }
    return targets
  }, [spec])

  const emptyForm = useMemo(() => {
    const base: Record<string, string> = {}
    for (const field of spec.fields) {
      base[field.key] = field.type === 'number' && !field.optional ? '0' : ''
    }
    return { ...base, ...spec.defaults }
  }, [spec])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const response = await adminApi.get<any[]>(spec.endpoint)
    if (response.error) setError(response.error)
    else setRows(response.data || [])
    setLoading(false)
  }, [spec.endpoint])

  useEffect(() => {
    setFormOpen(false)
    setEditingId(null)
    setForm({})
    setNotice('')
    void load()
  }, [load])

  // Listes déroulantes alimentées par un autre endpoint.
  useEffect(() => {
    let cancelled = false
    const sources = spec.fields.filter((field) => field.optionsFrom)
    if (sources.length === 0) return

    Promise.all(sources.map(async (field) => {
      const response = await adminApi.get<any[]>(field.optionsFrom!.endpoint)
      return [field.key, (response.data || []).map((row) => ({
        value: String(row[field.optionsFrom!.value]),
        label: String(row[field.optionsFrom!.label] ?? row[field.optionsFrom!.value]),
      }))] as const
    })).then((entries) => {
      if (!cancelled) setRemoteOptions(Object.fromEntries(entries))
    })

    return () => { cancelled = true }
  }, [spec])

  function optionsFor(field: FieldSpec) {
    return field.options ?? remoteOptions[field.key] ?? []
  }

  function resetTranslations() {
    lastTranslated.current = {}
    translated.current = {}
  }

  function beginCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setFormOpen(true)
    setError('')
    resetTranslations()
  }

  function beginEdit(row: any) {
    const next: Record<string, string> = {}
    for (const field of spec.fields) next[field.key] = asFormValue(row[field.key])
    setEditingId(row.id)
    setForm(next)
    setFormOpen(true)
    setError('')
    resetTranslations()
  }

  /**
   * Appelé quand on quitte un champ français : complète les champs anglais
   * encore vides. On ne remplace jamais une valeur déjà présente — une
   * traduction corrigée à la main doit survivre à un retour sur le champ
   * français. Le bouton « Retraduire » couvre le remplacement voulu.
   */
  async function fillTranslations(sourceKey: string) {
    const targets = translationTargets.get(sourceKey)
    if (!targets || !translator.enabled) return

    const source = (form[sourceKey] ?? '').trim()
    if (!source) return

    for (const target of targets) {
      if ((form[target.key] ?? '').trim()) continue
      if (lastTranslated.current[target.key] === source) continue
      lastTranslated.current[target.key] = source

      const text = await translator.translate(target.key, source)
      if (!text) continue
      translated.current[target.key] = text
      // Le champ a pu être rempli pendant l'appel : on relit l'état courant
      // plutôt que la copie capturée au moment du clic.
      setForm(current => (current[target.key] ?? '').trim()
        ? current
        : { ...current, [target.key]: text })
    }
  }

  /** Bouton « Traduire » : remplacement explicite, donc sans ménagement. */
  async function translateField(field: FieldSpec) {
    const source = (form[field.translateFrom!] ?? '').trim()
    if (!source) return
    lastTranslated.current[field.key] = source
    const text = await translator.translate(field.key, source)
    if (!text) return
    translated.current[field.key] = text
    setForm(current => ({ ...current, [field.key]: text }))
  }

  /** Saisir dans un champ traduit en reprend la main : plus de rattrapage dessus. */
  function editField(field: FieldSpec, value: string) {
    if (field.translateFrom) delete translated.current[field.key]
    setForm({ ...form, [field.key]: value })
  }

  function payload(values: Record<string, string>) {
    const result: Record<string, unknown> = {}
    for (const field of spec.fields) {
      const raw = values[field.key] ?? ''

      if (field.type === 'list' || field.type === 'imageList') {
        result[field.key] = raw.split('\n').map((line) => line.trim()).filter(Boolean)
        continue
      }
      if (field.type === 'checkbox') {
        result[field.key] = raw === 'true'
        continue
      }
      if (field.type === 'number') {
        // Un champ numérique facultatif laissé vide reste vide, pas 0.
        if (raw === '' && field.optional) {
          if (field.nullWhenEmpty) result[field.key] = null
          continue
        }
        result[field.key] = Number(raw || 0)
        continue
      }
      if (raw === '' && field.optional) {
        if (field.nullWhenEmpty) result[field.key] = null
        continue
      }
      result[field.key] = raw
    }
    return result
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')

    // Quitter le dernier champ français et cliquer « Ajouter » ne font qu'un
    // geste : on laisse la traduction arriver, puis on reprend les propositions
    // encore absentes de l'état du formulaire (React n'a pas forcément réaffiché).
    await Promise.all([...inFlight.current])
    const values = { ...form }
    for (const [key, text] of Object.entries(translated.current)) {
      if (!(values[key] ?? '').trim()) values[key] = text
    }

    const response = editingId
      ? await adminApi.update(`${spec.endpoint}/${editingId}`, payload(values))
      : await adminApi.create(spec.endpoint, payload(values))
    setSaving(false)

    if (response.error) {
      setError(response.error)
      return
    }
    setNotice(editingId ? 'Modifications enregistrées.' : 'Élément ajouté.')
    setForm({})
    setEditingId(null)
    setFormOpen(false)
    resetTranslations()
    await load()
  }

  async function remove(row: any) {
    if (!window.confirm('Supprimer définitivement cet élément ?')) return
    const response = await adminApi.delete(`${spec.endpoint}/${row.id}`)
    if (response.error) {
      setError(response.error)
      return
    }
    setNotice('Élément supprimé.')
    await load()
  }

  return (
    <>
      {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}
      {notice && !error && <Notice message={notice} />}

      <div className={formOpen
        ? 'grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]'
        : 'grid grid-cols-1 gap-6'}>

        <Card title={spec.title} action={
          <Button variant="gold" onClick={beginCreate}>{spec.addLabel ?? 'Ajouter'}</Button>
        }>
          {loading ? <Spinner /> : rows.length === 0 ? (
            <EmptyState>Aucun élément pour le moment.</EmptyState>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    {spec.columns.map((column) => (
                      <th key={column.label} className="px-4 py-3 font-medium">{column.label}</th>
                    ))}
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.map((row) => (
                    <tr key={row.id} className={editingId === row.id ? 'bg-gold-50' : undefined}>
                      {spec.columns.map((column) => (
                        <td key={column.label} className="px-4 py-3 align-top">{column.value(row)}</td>
                      ))}
                      <td className="whitespace-nowrap px-4 py-3 align-top">
                        <button onClick={() => beginEdit(row)} className="mr-3 text-gold-700 hover:underline">
                          Modifier
                        </button>
                        <button onClick={() => void remove(row)} className="text-red-700 hover:underline">
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {formOpen && (
          <form onSubmit={save} className="space-y-4 border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg">{editingId ? 'Modifier' : 'Nouvel élément'}</h2>
              <Button variant="ghost" onClick={() => { setFormOpen(false); setEditingId(null) }}>
                Fermer
              </Button>
            </div>

            {translator.enabled && translationTargets.size > 0 && (
              <p className="flex items-start gap-2 border border-gold-200 bg-gold-50 px-3 py-2 text-xs text-gray-600">
                <Languages className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-700" aria-hidden="true" />
                <span>
                  Les champs « (EN) » se remplissent d’après le français dès que vous quittez
                  le champ. La proposition reste modifiable : corrigez-la avant d’enregistrer.
                </span>
              </p>
            )}

            {spec.fields.map((field) => {
              const value = form[field.key] ?? ''
              const required = !field.optional && field.type !== 'checkbox'
              const id = `field-${field.key}`
              // Quitter un champ source complète sa traduction restée vide.
              const onBlur = translationTargets.has(field.key)
                ? () => track(fillTranslations(field.key))
                : undefined

              if (field.type === 'image') {
                return (
                  <ImageField
                    key={field.key}
                    label={field.label}
                    help={field.help}
                    required={required}
                    value={value}
                    onChange={(next) => setForm({ ...form, [field.key]: next })}
                  />
                )
              }

              if (field.type === 'imageList') {
                return (
                  <ImageListField
                    key={field.key}
                    label={field.label}
                    help={field.help}
                    value={value ? value.split('\n').filter(Boolean) : []}
                    onChange={(next) => setForm({ ...form, [field.key]: next.join('\n') })}
                  />
                )
              }

              // Le contrôle vit hors du `<label>` : la ligne de titre doit pouvoir
              // accueillir le bouton « Traduire » à droite. L'association reste
              // explicite par `htmlFor` / `id`.
              const control = field.type === 'select' || field.optionsFrom ? (
                <select id={id} value={value} required={required}
                  onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                  className="mt-1 w-full border border-gray-300 px-3 py-2 outline-none focus:border-gold-500">
                  <option value="">Choisir…</option>
                  {optionsFor(field).map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              ) : field.type === 'textarea' || field.type === 'list' ? (
                <textarea id={id} rows={field.type === 'list' ? 4 : 3} value={value} required={required}
                  onChange={(event) => editField(field, event.target.value)}
                  onBlur={onBlur}
                  className="mt-1 w-full border border-gray-300 px-3 py-2 outline-none focus:border-gold-500" />
              ) : (
                <input id={id} type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                  min={field.type === 'number' ? 0 : undefined}
                  step={field.type === 'number' ? 'any' : undefined}
                  value={value} required={required}
                  onChange={(event) => editField(field, event.target.value)}
                  onBlur={onBlur}
                  className="mt-1 w-full border border-gray-300 px-3 py-2 outline-none focus:border-gold-500" />
              )

              return (
                <div key={field.key}>
                  {field.type === 'checkbox' ? (
                    <label htmlFor={id} className="flex items-center gap-2 text-sm text-gray-700">
                      <input id={id} type="checkbox" checked={value === 'true'}
                        onChange={(event) => setForm({ ...form, [field.key]: event.target.checked ? 'true' : '' })}
                        className="h-4 w-4 accent-gold-500" />
                      {field.label}
                    </label>
                  ) : (
                    <>
                      <div className="flex items-baseline justify-between gap-2">
                        <label htmlFor={id} className="block text-sm text-gray-700">
                          {field.label}
                          {field.optional && <span className="ml-1 text-xs text-gray-400">(facultatif)</span>}
                        </label>
                        {field.translateFrom && translator.enabled && (
                          <button type="button" onClick={() => void translateField(field)}
                            disabled={translator.busy[field.key] || !(form[field.translateFrom] ?? '').trim()}
                            className="flex shrink-0 items-center gap-1 text-xs text-gold-700 hover:underline disabled:text-gray-400 disabled:no-underline">
                            <Languages className="h-3.5 w-3.5" aria-hidden="true" />
                            {translator.busy[field.key]
                              ? 'Traduction…'
                              : value.trim() ? 'Retraduire' : 'Traduire'}
                          </button>
                        )}
                      </div>
                      {control}
                    </>
                  )}
                  {field.help && <p className="mt-1 text-xs text-gray-500">{field.help}</p>}
                  {translator.errors[field.key] && (
                    <p className="mt-1 text-xs text-red-600">{translator.errors[field.key]}</p>
                  )}
                </div>
              )
            })}

            <div className="flex gap-2 pt-2">
              <Button type="submit" variant="gold" disabled={saving}>
                {saving ? 'Enregistrement…' : editingId ? 'Enregistrer' : 'Ajouter'}
              </Button>
              {editingId && (
                <Button onClick={() => { setEditingId(null); setForm(emptyForm) }}>
                  Annuler la modification
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </>
  )
}
