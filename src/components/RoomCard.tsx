import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Maximize, Users, BedDouble, Eye } from 'lucide-react'
import type { Room } from '@/types'
import { formatCurrency } from '@/utils/helpers'

interface RoomCardProps {
  room: Room
  featured?: boolean
}

/**
 * RoomCard
 * --------
 * Displays a room's photo, name/description (via i18n roomsData.<translationKey>),
 * key facts (size, guests, view) and price, with a booking CTA.
 */
export default function RoomCard({ room, featured = false }: RoomCardProps) {
  const { t } = useTranslation()
  const base = `roomsData.${room.translationKey}`

  return (
    <div className="group bg-white shadow-card rounded-md overflow-hidden flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={room.images[0]}
          alt={t(`${base}.name`)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {featured && (
          <span className="absolute top-4 left-4 bg-gold-500 text-white text-[10px] uppercase tracking-widest2 px-3 py-1.5">
            ★ Premium
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-serif text-xl text-charcoal mb-2">{t(`${base}.name`)}</h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1">{t(`${base}.description`)}</p>

        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-5 border-t border-gray-100 pt-4">
          <span className="flex items-center gap-1.5">
            <Maximize size={14} className="text-gold-500" /> {room.size} m²
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={14} className="text-gold-500" /> {room.maxGuests} {t('rooms.guests')}
          </span>
          <span className="flex items-center gap-1.5">
            <BedDouble size={14} className="text-gold-500" /> {t(`${base}.bedType`)}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye size={14} className="text-gold-500" /> {t(`${base}.view`)}
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-[11px] uppercase tracking-widest2 text-gray-400">{t('common.from')}</span>
            <div className="font-serif text-2xl text-gold-600">
              {formatCurrency(room.price)}
              <span className="text-xs text-gray-500 font-sans ml-1">{t('common.perNight')}</span>
            </div>
          </div>
          <Link
            to={`/contact?room=${room.id}#booking`}
            className="btn-outline !py-2.5 !px-5 text-xs"
          >
            {t('rooms.bookThisRoom')}
          </Link>
        </div>
      </div>
    </div>
  )
}
