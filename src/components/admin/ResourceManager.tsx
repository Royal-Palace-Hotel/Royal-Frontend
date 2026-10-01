import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { adminApi } from '@/utils/api'
import { Button, Card, EmptyState, ErrorBanner, Notice, Spinner } from './ui'
import { ImageField, ImageListField } from './ImageField'

export interface FieldSpec {
  key: string
  label: string
  /** `image` : une pièce jointe. `imageList` : plusieurs, ordonnées. */
  type?: 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'list' | 'image' | 'imageList'
  options?: Array<{ value: string; label: string }>
  /** Options chargées depuis un autre endpoint (ex. sections de la carte). */
  optionsFrom?: { endpoint: string; value: string; label: string }
  optional?: boolean
  help?: string
  /** Envoyer `null` plutôt qu'une chaîne vide (colonnes nullable). */
  nullWhenEmpty?: boolean
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

  function beginCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setFormOpen(true)
    setError('')
  }

  function beginEdit(row: any) {
    const next: Record<string, string> = {}
    for (const field of spec.fields) next[field.key] = asFormValue(row[field.key])
    setEditingId(row.id)
    setForm(next)
    setFormOpen(true)
    setError('')
  }

  function payload() {
    const result: Record<string, unknown> = {}
    for (const field of spec.fields) {
      const raw = form[field.key] ?? ''

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
    const response = editingId
      ? await adminApi.update(`${spec.endpoint}/${editingId}`, payload())
      : await adminApi.create(spec.endpoint, payload())
    setSaving(false)

    if (response.error) {
      setError(response.error)
      return
    }
    setNotice(editingId ? 'Modifications enregistrées.' : 'Élément ajouté.')
    setForm({})
    setEditingId(null)
    setFormOpen(false)
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

            {spec.fields.map((field) => {
              const value = form[field.key] ?? ''
              const required = !field.optional && field.type !== 'checkbox'
              const id = `field-${field.key}`

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
                    <label htmlFor={id} className="block text-sm text-gray-700">
                      {field.label}
                      {field.optional && <span className="ml-1 text-xs text-gray-400">(facultatif)</span>}

                      {field.type === 'select' || field.optionsFrom ? (
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
                          onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                          className="mt-1 w-full border border-gray-300 px-3 py-2 outline-none focus:border-gold-500" />
                      ) : (
                        <input id={id} type={field.type === 'number' ? 'number' : 'text'}
                          min={field.type === 'number' ? 0 : undefined}
                          step={field.type === 'number' ? 'any' : undefined}
                          value={value} required={required}
                          onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                          className="mt-1 w-full border border-gray-300 px-3 py-2 outline-none focus:border-gold-500" />
                      )}
                    </label>
                  )}
                  {field.help && <p className="mt-1 text-xs text-gray-500">{field.help}</p>}
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
