import type { SpaTreatment } from '@/types'

/**
 * SPA TREATMENTS DATA
 * -------------------
 * `key` and `durationKey` map to translation strings in
 * src/i18n/locales/{fr,en}.ts under the `spa` namespace.
 * Price is in Ariary (Ar).
 */
export const spaTreatments: SpaTreatment[] = [
  { id: 't1', key: 'treatment1', durationKey: 'treatment1Duration', price: 45000 },
  { id: 't2', key: 'treatment2', durationKey: 'treatment2Duration', price: 60000 },
  { id: 't3', key: 'treatment3', durationKey: 'treatment3Duration', price: 40000 },
  { id: 't4', key: 'treatment4', durationKey: 'treatment4Duration', price: 42000 },
  { id: 't5', key: 'treatment5', durationKey: 'treatment5Duration', price: 95000 },
]

export default spaTreatments
