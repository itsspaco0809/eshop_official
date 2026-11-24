import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Product } from '@/lib/supabase';
import { useCart } from '@/lib/cart';
import { useCurrency } from '@/lib/currency';
import { Link } from '@/lib/router';
import { recordItemClick } from '@/lib/analytics';

export interface ProductColorOption {
  name: string;
  hex?: string;
  color?: string;
  image_url?: string;
}

type ExtendedProduct = Product & {
  exclusive?: boolean;
  compare_at_price?: number | null;
  badge_text?: string | null;
  colors?: Array<string | ProductColorOption> | null;
  color_options?: Array<string | ProductColorOption> | null;
  variants?: Array<string | ProductColorOption> | null;
};

interface ProductCardProps {
  product: ExtendedProduct;
  isNew?: boolean;
  isReady?: boolean;
}

// 常見 LEGO / 汽車配色預設對照表（如果 Database 只存顏色文字名都會自動出到靚色）
const COLOR_NAME_MAP: Record<string, string> = {
  red: '#DC2626',
  blue: '#2563EB',
  'light blue': '#38BDF8',
  'dark blue': '#1E3A8A',
  green: '#16A34A',
  'lime green': '#65A30D',
  lime: '#84CC16',
  yellow: '#EAB308',
  orange: '#F97316',
  white: '#F8FAFC',
  black: '#171717',
  grey: '#6B7280',
  gray: '#6B7280',
  'light grey': '#9CA3AF',
  'dark grey': '#374151',
  silver: '#CBD5E1',
  gold: '#D97706',
  purple: '#9333EA',
  pink: '#EC4899',
  tan: '#D6C7A9',
  brown: '#78350F',
};

function resolveSwatchHex(item: string | ProductColorOption): {
  name: string;
  hex: string;
  imageUrl?: string;
} {
  if (typeof item === 'string') {
    const cleanName = item.trim();
    const mapped =
      cleanName.startsWith('#') || cleanName.startsWith('rgb')
        ? cleanName
        : COLOR_NAME_MAP[cleanName.toLowerCase()] || '#737373';
    return { name: cleanName, hex: mapped };
  }

  const cleanName = (item.name || '').trim();
  const rawHex = item.hex || item.color || '';
  const mapped =
    rawHex.startsWith('#') || rawHex.startsWith('rgb')
      ? rawHex
      : COLOR_NAME_MAP[cleanName.toLowerCase()] || '#737373';

  return {
    name: cleanName || 'Color',
    hex: mapped,
    imageUrl: item.image_url,
  };
}

export default function ProductCard({
  product,
  isNew,
}: ProductCardProps) {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const isKit =
    product.section?.toLowerCase() === 'kits' ||
    product.section?.toLowerCase() === 'kit';

  const rawIsNew =
    isNew ??
    (product.is_new || product.isNew || false);

  const isExclusive = Boolean(product.exclusive);
  const price = Number(product.price);
  const compareAtPrice = product.compare_at_price ? Number(product.compare_at_price) : null;
  const customBadgeText = product.badge_text?.trim() || null;

  const isFree = price === 0;
  const hasDiscount = Boolean(!isFree && compareAtPrice && compareAtPrice > price);
  const discountPercent = hasDiscount && compareAtPrice
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const promoBadgeLabel = !isFree
    ? customBadgeText || (discountPercent > 0 ? `SAVE ${discountPercent}%` : null)
    : null;

  /* Priority: FREE > PROMO (Purple) > KITS EXCLUSIVE > NEW IN */
  const showFreeBadge = isFree;
  const showPromoBadge = !isFree && Boolean(promoBadgeLabel);
  const showExclusiveBadge = !isFree && !showPromoBadge && isExclusive;
  const showNewBadge = !isFree && !showPromoBadge && isKit && !isExclusive && rawIsNew;

  const isInstruction =
    product.section?.toLowerCase() === 'instructions' ||
    product.section?.toLowerCase() === 'instruction';

  // 整理顏色列表
  const rawColors =
    product.colors || product.color_options || product.variants || [];
  const colorSwatches = Array.isArray(rawColors)
    ? rawColors.map(resolveSwatchHex)
    : [];
  const hasMultipleColors = colorSwatches.length > 1;
  const MAX_VISIBLE_SWATCHES = 4;
  const visibleSwatches = colorSwatches.slice(0, MAX_VISIBLE_SWATCHES);
  const remainingColorCount = Math.max(0, colorSwatches.length - MAX_VISIBLE_SWATCHES);

  const displayImage = previewImage || product.image_url;

  return (
    <div
      onMouseLeave={() => setPreviewImage(null)}
      className="
        group
        relative
        bg-neutral-100
        dark:bg-[#111112]
        rounded-2xl
        overflow-hidden
        border
        border-neutral-200
        dark:border-neutral-800
        transition-all
        duration-400
        [@media(hover:hover)]:hover:border-neutral-300
        dark:[@media(hover:hover)]:hover:border-neutral-700
        [@media(hover:hover)]:hover:-translate-y-1
        shadow-none
        select-none
        flex
        flex-col
        h-full
      "
    >
      {/* IMAGE */}
      <Link
        to={`/product/${product.slug}`}
        onClick={() =>
          void recordItemClick({
            itemId: product.id,
            itemName: product.name,
            itemSlug: product.slug,
            section: product.section,
          })
        }
        className="
          block
          relative
          overflow-hidden
          aspect-square
          bg-neutral-200
          dark:bg-neutral-800
          [-webkit-touch-callout:none]
          [-webkit-tap-highlight-color:transparent]
        "
      >
        <img
          src={displayImage}
          alt={product.name}
          draggable={false}
          className="
            w-full
            h-full
            object-cover
            transition-transform
            duration-700
            [@media(hover:hover)]:[.group:hover_&]:scale-110
            pointer-events-none
            select-none
          "
        />

        {(showFreeBadge || showPromoBadge || showExclusiveBadge || showNewBadge) && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <span
              className={`
                relative
                overflow-hidden
                inline-flex
                items-center
                px-2
                py-0.5
                sm:px-3
                sm:py-1
                ${showFreeBadge || showPromoBadge || showExclusiveBadge ? 'text-white' : 'text-neutral-950'}
                text-[10px]
                sm:text-xs
                font-black
                uppercase
                tracking-wider
                rounded-full
                shadow-md
              `}
              style={{
                backgroundColor: showFreeBadge
                  ? '#F97316'
                  : showPromoBadge
                    ? '#9333EA'
                    : showExclusiveBadge
                      ? '#007AFF'
                      : '#D2FF00',
              }}
            >
              <span className="relative z-10">
                {showFreeBadge
                  ? 'FREE'
                  : showPromoBadge
                    ? promoBadgeLabel
                    : showExclusiveBadge
                      ? 'KITS EXCLUSIVE'
                      : 'NEW IN'}
              </span>

              {showExclusiveBadge && (
                <span
                  aria-hidden="true"
                  className="
                    kits-exclusive-sweep
                    pointer-events-none
                    absolute
                    z-20
                    top-[-70%]
                    bottom-[-70%]
                    left-[-20%]
                    w-[8px]
                    rotate-[22deg]
                    bg-white
                  "
                />
              )}
            </span>
          </div>
        )}
      </Link>

      {/* CONTENT */}
      <div
        className="
          p-3
          sm:p-5
          flex
          flex-col
          flex-1
        "
      >
        <div>
          <Link
            to={`/product/${product.slug}`}
            onClick={() =>
              void recordItemClick({
                itemId: product.id,
                itemName: product.name,
                itemSlug: product.slug,
                section: product.section,
              })
            }
            className="
              block
              [-webkit-tap-highlight-color:transparent]
            "
          >
            <div
              className="
                h-12
                sm:h-16
                flex
                items-start
              "
            >
              <h3
                className="
                  text-neutral-900
                  dark:text-white
                  font-bold
                  text-base
                  sm:text-xl
                  leading-tight
                  line-clamp-2
                "
              >
                {product.name}
              </h3>
            </div>
          </Link>

          <p
            className="
              hidden
              sm:block
              text-neutral-500
              dark:text-neutral-400
              text-xs
              sm:text-sm
              mt-1
              truncate
            "
          >
            {isInstruction
              ? product.theme
              : `${product.piece_count} Pieces · ${product.theme}`}
          </p>

          {/* MINI COLOR SWATCHES (只有多過1隻色先顯示) */}
          {hasMultipleColors && (
            <div
              className="flex items-center gap-1.5 mt-2 sm:mt-2.5"
              aria-label={`${colorSwatches.length} color options available`}
            >
              {visibleSwatches.map((swatch, idx) => (
                <Link
                  key={`${swatch.name}-${idx}`}
                  to={`/product/${product.slug}?color=${encodeURIComponent(swatch.name)}`}
                  title={swatch.name}
                  onMouseEnter={() => {
                    if (swatch.imageUrl) {
                      setPreviewImage(swatch.imageUrl);
                    }
                  }}
                  onClick={() =>
                    void recordItemClick({
                      itemId: product.id,
                      itemName: product.name,
                      itemSlug: product.slug,
                      section: product.section,
                    })
                  }
                  className="
                    w-3.5
                    h-3.5
                    sm:w-4
                    sm:h-4
                    rounded-full
                    border
                    border-black/20
                    dark:border-white/30
                    shadow-sm
                    transition-transform
                    duration-200
                    [@media(hover:hover)]:hover:scale-125
                    focus:outline-none
                    flex-shrink-0
                  "
                  style={{ backgroundColor: swatch.hex }}
                />
              ))}

              {remainingColorCount > 0 && (
                <Link
                  to={`/product/${product.slug}`}
                  title={`+${remainingColorCount} more colors`}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    h-3.5
                    sm:h-4
                    px-1
                    rounded-full
                    bg-neutral-200
                    dark:bg-neutral-800
                    border
                    border-neutral-300
                    dark:border-neutral-700
                    text-[9px]
                    sm:text-[10px]
                    font-bold
                    text-neutral-700
                    dark:text-neutral-300
                    leading-none
                    transition-transform
                    duration-200
                    [@media(hover:hover)]:hover:scale-110
                  "
                >
                  +{remainingColorCount}
                </Link>
              )}
            </div>
          )}
        </div>

        {/* PRICE + BUTTON */}
        <div
          className="
            flex
            items-center
            justify-between
            pt-2
            sm:pt-4
            gap-1.5
            sm:gap-2
            mt-auto
            min-h-[42px]
          "
        >
          <div className="relative min-w-0 flex items-baseline sm:gap-1.5">
            <span
              className="
                text-neutral-900
                dark:text-white
                text-sm
                sm:text-lg
                font-bold
                whitespace-nowrap
              "
            >
              {formatPrice(product.price)}
            </span>

            {hasDiscount && compareAtPrice && (
              <span
                className="
                  absolute
                  left-0
                  top-full
                  mt-0.5
                  sm:static
                  sm:mt-0
                  text-neutral-400
                  dark:text-neutral-500
                  text-[10px]
                  sm:text-sm
                  leading-none
                  line-through
                  font-medium
                  whitespace-nowrap
                "
              >
                {formatPrice(compareAtPrice)}
              </span>
            )}
          </div>

          <div
            className="
              min-w-[68px]
              h-[40px]
              flex
              items-center
              justify-end
              flex-shrink-0
            "
          >
            {product.in_stock &&
              (hasMultipleColors ? (
                <Link
                  to={`/product/${product.slug}`}
                  onClick={() =>
                    void recordItemClick({
                      itemId: product.id,
                      itemName: product.name,
                      itemSlug: product.slug,
                      section: product.section,
                    })
                  }
                  className="
                    flex
                    items-center
                    justify-center
                    gap-1
                    px-3
                    py-2
                    sm:px-3.5
                    sm:py-2.5
                    bg-neutral-900
                    text-white
                    dark:bg-white
                    dark:text-neutral-950
                    text-xs
                    sm:text-sm
                    font-bold
                    rounded-lg
                    [@media(hover:hover)]:hover:bg-neutral-800
                    dark:[@media(hover:hover)]:hover:bg-neutral-200
                    transition-all
                    [@media(hover:hover)]:hover:scale-105
                    active:scale-95
                    whitespace-nowrap
                    [-webkit-tap-highlight-color:transparent]
                  "
                >
                  <Plus
                    className="
                      w-3.5
                      h-3.5
                      sm:w-4
                      sm:h-4
                      flex-shrink-0
                    "
                  />
                  Select
                </Link>
              ) : (
                <button
                  onClick={() => addItem(product)}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-1.5
                    px-3
                    py-2
                    sm:px-4
                    sm:py-2.5
                    bg-neutral-900
                    text-white
                    dark:bg-white
                    dark:text-neutral-950
                    text-xs
                    sm:text-sm
                    font-bold
                    rounded-lg
                    [@media(hover:hover)]:hover:bg-neutral-800
                    dark:[@media(hover:hover)]:hover:bg-neutral-200
                    transition-all
                    [@media(hover:hover)]:hover:scale-105
                    active:scale-95
                    whitespace-nowrap
                    [-webkit-tap-highlight-color:transparent]
                  "
                >
                  <Plus
                    className="
                      w-3.5
                      h-3.5
                      sm:w-4
                      sm:h-4
                      flex-shrink-0
                    "
                  />
                  Add
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
