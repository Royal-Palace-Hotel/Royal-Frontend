import { useCallback, useEffect, useState } from 'react'
import { adminApi } from '@/utils/api'

/**
 * Traduction FR → EN des champs du back-office.
 *
 * La proposition vient de l'API (`POST /admin/translate`), jamais du navigateur :
 * la clé du service reste côté serveur. Le hook ne touche à aucun champ lui-même,
 * il rend seulement le texte traduit — c'est au formulaire de décider s'il le
 * pose, afin de ne jamais écraser une saisie manuelle.
 */

/**
 * La disponibilité ne dépend que de la configuration du serveur : on la demande
 * une fois par session, et non à chaque ouverture d'un formulaire.
 */
let availability: Promise<boolean> | null = null

function isAvailable() {
  availability ??= adminApi.translationStatus()
    .then(response => Boolean(response.data?.enabled))
    .catch(() => false)
  return availability
}

export interface Translator {
  /** Faux si le serveur n'a pas de clé de traduction : l'UI reste alors muette. */
  enabled: boolean
  /** Champs en cours de traduction, par clé de champ. */
  busy: Record<string, boolean>
  /** Dernière erreur par champ, à afficher sous le champ concerné. */
  errors: Record<string, string>
  /** Renvoie la traduction, ou `null` si elle a échoué. */
  translate: (fieldKey: string, text: string) => Promise<string | null>
}

export function useTranslator(): Translator {
  const [enabled, setEnabled] = useState(false)
  const [busy, setBusy] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    let cancelled = false
    void isAvailable().then(value => { if (!cancelled) setEnabled(value) })
    return () => { cancelled = true }
  }, [])

  const translate = useCallback(async (fieldKey: string, text: string) => {
    const source = text.trim()
    if (!source) return null

    setBusy(current => ({ ...current, [fieldKey]: true }))
    setErrors(current => ({ ...current, [fieldKey]: '' }))

    const response = await adminApi.translate([source])
    setBusy(current => ({ ...current, [fieldKey]: false }))

    const translated = response.data?.translations?.[0]
    if (!translated) {
      // Une traduction ratée n'est pas bloquante : le message reste discret,
      // sous le champ, et la saisie manuelle prend le relais.
      setErrors(current => ({
        ...current,
        [fieldKey]: response.error || 'Traduction indisponible pour le moment.',
      }))
      return null
    }
    return translated
  }, [])

  return { enabled, busy, errors, translate }
}
