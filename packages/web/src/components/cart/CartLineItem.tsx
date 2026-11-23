import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { CartItem } from '../../lib/api'
import { useCart } from '../../lib/cart-context'
import { track } from '../../lib/analytics'
import { formatPrice } from '../../lib/format'

interface CartLineItemProps {
  item: CartItem
  compact?: boolean
  onNavigate?: () => void
}

export function CartLineItem({ item, compact = false, onNavigate }: CartLineItemProps) {
  const { t, i18n } = useTranslation()
  const { updateQuantity, removeItem } = useCart()

  const name =
    i18n.language?.startsWith('th') && item.product_name_th ? item.product_name_th : item.product_name
  const imageClass = compact ? 'h-24 w-20' : 'h-24 w-20 md:h-28 md:w-24'

  return (
    <li className={`flex gap-4 ${compact ? 'py-4' : 'py-5 md:gap-6'}`}>
      <Link
        to={`/products/${item.product_slug}`}
        onClick={onNavigate}
        className={`${imageClass} shrink-0 overflow-hidden bg-charcoal/5`}
      >
        {item.image_url ? (
          <img src={item.image_url} alt={name} className="h-full w-full object-cover" />
        ) : null}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/products/${item.product_slug}`}
              onClick={onNavigate}
              className="line-clamp-2 font-body text-sm font-medium lowercase tracking-[-0.04em] text-charcoal transition-opacity hover:opacity-70"
            >
              {name}
            </Link>
            <p className="mt-1 font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/50">
              {[item.color, item.size].filter(Boolean).join(' / ')}
            </p>
            {item.sold_out && (
              <p className="mt-1 font-body text-[12px] lowercase tracking-[-0.04em] text-red">
                {t('cart.sold_out')}
              </p>
            )}
          </div>
          <p className="shrink-0 font-body text-sm tracking-[-0.04em] text-charcoal">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex items-center border border-charcoal/20">
            <button
              type="button"
              className="cursor-pointer px-3 py-1.5 font-body text-sm text-charcoal transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30"
              disabled={item.quantity <= 1 || item.sold_out}
              aria-label={t('cart.quantity_decrease')}
              onClick={() => void updateQuantity(item.id, item.quantity - 1)}
            >
              −
            </button>
            <span className="min-w-8 text-center font-body text-[13px] tracking-[-0.04em] text-charcoal">
              {item.quantity}
            </span>
            <button
              type="button"
              className="cursor-pointer px-3 py-1.5 font-body text-sm text-charcoal transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30"
              disabled={item.sold_out || item.quantity >= item.available_stock}
              aria-label={t('cart.quantity_increase')}
              onClick={() => void updateQuantity(item.id, item.quantity + 1)}
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="cursor-pointer font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/50 transition-opacity hover:opacity-70"
            onClick={() =>
              void removeItem(item.id).then(() =>
                track('item_removed_from_cart', {
                  product_id: item.product_id,
                  quantity: item.quantity,
                  size: item.size,
                }),
              )
            }
          >
            {t('cart.remove')}
          </button>
        </div>
      </div>
    </li>
  )
}
