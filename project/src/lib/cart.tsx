import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Product } from '@/lib/supabase';
import { useCart } from '@/lib/cart';
import { useCurrency } from '@/lib/currency';
import { Link } from '@/lib/router';
import { recordItemClick } from '@/lib/analytics';

export interface ProductColorOption {
  name?: string;
  label?: string;
  hex?: string;
  color?: string;
  color_hex?: string;
  code?: string;
  gallery?: string[];
  image_url?: string;
  thumbnail?: string;
}

type ExtendedProduct = Product & {
  exclusive?: boolean;
  compare_at_price?: number | null;
  badge_text?: string | null;
  colors?: ProductColorOption[] | string | null;
};

interface ProductCardProps {
  product: ExtendedProduct;
  isNew?: boolean;
  isReady?: boolean;
}

const FALLBACK_COLOR_NAMES: Record<string, string> = {
  red: '#DC2626',
  blue: '#38BDF8',
  'light blue': '#38BDF8',
  'dark blue': '#1D4ED8',
  green: '#16A34A',
  'lime green': '#65A30D',
  lime: '#84CC16',
  yellow: '#EAB308',
  orange: '#F97316',
  white: '#FFFFFF',
  black: '#18181B',
  grey: '#71717A',
  gray: '#71717A',
  'light grey': '#A1A1AA',
  'dark grey': '#3F3F46',
  silver: '#CBD5E1',
  gold: '#D97706',
  purple: '#9333EA',
  pink: '#EC4899',
  tan: '#D6C7A9',
  brown: '#78350F',
};

function normalizeHexColor(raw?: string, nameFallback?: string): string {
  if (raw && typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.startsWith('#') || trimmed.startsWith('rgb') || trimmed.startsWith('hsl')) {
      return trimmed;
    }
    if (/^[0-9A-Fa-f]{3,8}$/.test(trimmed)) {
      return `#${trimmed}`;
    }
    const mappedFromRaw = FALLBACK_COLOR_NAMES[trimmed.toLowerCase()];
    if (mappedFromRaw) return mappedFromRaw;
  }

  if (nameFallback) {
    const lower = nameFallback.toLowerCase();
    if (FALLBACK_COLOR_NAMES[lower]) return FALLBACK_COLOR_NAMES[lower];
    for (const [key, val] of Object.entries(FALLBACK_COLOR_NAMES)) {
      if (lower.includes(key)) return val;
    }
  }

  return '#71717A';
}

// 確保任何顏色都優先取用 0.webp 作為 Card Thumbnail
function resolveColorThumbnail(item: ProductColorOption): string | undefined {
  if (item.thumbnail) return item.thumbnail;

  if (Array.isArray(item.gallery) && item.gallery.length > 0) {
    const zeroWebp = item.gallery.find(
      (url) => typeof url === 'string' && /\/0\.webp(\?.*)?$/i.test(url)
    );
    if (zeroWebp) return zeroWebp;

    const firstUrl = item.gallery[0];
    if (typeof firstUrl === 'string') {
      return firstUrl.replace(/\/[^/]+\.webp(\?.*)?$/i, '/0.webp$1');
    }
  }

  if (item.image_url) {
    return item.image_url.replace(/\/[^/]+\.webp(\?.*)?$/i, '/0.webp$1');
  }

  return undefined;
}

function parseColorOptions(rawColors: ExtendedProduct['colors']): Array<{
  name: string;
  hex: string;
  previewUrl?: string;
}> {
  if (!rawColors) return [];

  let parsed = rawColors;
  if (typeof rawColors === 'string') {
    try {
      parsed = JSON.parse(rawColors);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(parsed)) return [];

  return parsed
    .filter((item): item is ProductColorOption => Boolean(item && typeof item === 'object'))
    .map((item) => {
      const displayName = (item.name || item.label || 'Color').trim();
      const rawColorVal = item.hex || item.color || item.color_hex || item.code;
      return {
        name: displayName,
        hex: normalizeHexColor(rawColorVal, displayName),
        previewUrl: resolveColorThumbnail(item),
      };
    });
}

export default function ProductCard({
  product,
  isNew,
}: ProductCardProps) {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);

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

  // 解析 Supabase colors jsonb 欄位
  const colorSwatches = parseColorOptions(product.colors);
  const hasMultipleColors = colorSwatches.length > 1;
  const MAX_VISIBLE_SWATCHES = 4;
  const visibleSwatches = colorSwatches.slice(0, MAX_VISIBLE_SWATCHES);
  const remainingColorCount = Math.max(0, colorSwatches.length - MAX_VISIBLE_SWATCHES);

  const activeSwatch = colorSwatches[selectedColorIndex];
  const displayImage =
    hasMultipleColors && activeSwatch?.previewUrl
      ? activeSwatch.previewUrl
      : product.image_url;

  const productUrl =
    hasMultipleColors && activeSwatch && selectedColorIndex > 0
      ? `/product/${product.slug}?color=${encodeURIComponent(activeSwatch.name)}`
      : `/product/${product.slug}`;

  // 精準對齊 cart.tsx 嘅 addItem(product, quantity, selectedColor) 簽名
  const handleQuickAdd = () => {
    const chosenColorName = activeSwatch?.name;
    const itemPayload: Product = chosenColorName
      ? {
          ...product,
          image_url: displayImage,
        }
      : product;

    addItem(itemPayload, 1, chosenColorName);
  };

  return (
    <div
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
        to={productUrl}
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
          onError={(e) => {
            if (e.currentTarget.src !== product.image_url) {
              e.currentTarget.src = product.image_url;
            }
          }}
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
            to={productUrl}
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

          {/* 固定高度嘅色點區：確保成排卡片高度完全對齊 */}
          <div
            className="h-5 sm:h-6 flex items-center gap-2 mt-1.5 sm:mt-2"
            aria-label={
              hasMultipleColors
                ? `${colorSwatches.length} color options available`
                : undefined
            }
          >
            {hasMultipleColors && (
              <>
                {visibleSwatches.map((swatch, idx) => {
                  const isSelected = selectedColorIndex === idx;
                  return (
                    <button
                      key={`${swatch.name}-${idx}`}
                      type="button"
                      title={swatch.name}
                      aria-label={`Select ${swatch.name}`}
                      aria-pressed={isSelected}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedColorIndex(idx);
                      }}
                      className={`
                        inline-flex
                        items-center
                        justify-center
                        rounded-full
                        transition-all
                        duration-200
                        cursor-pointer
                        [@media(hover:hover)]:hover:scale-110
                        active:scale-95
                        focus:outline-none
                        flex-shrink-0
                        [-webkit-tap-highlight-color:transparent]
                        ${
                          isSelected
                            ? 'ring-2 ring-neutral-900 dark:ring-white ring-offset-1 ring-offset-neutral-100 dark:ring-offset-[#111112]'
                            : 'opacity-80 hover:opacity-100'
                        }
                      `}
                    >
                      <span
                        className="
                          block
                          w-3.5
                          h-3.5
                          sm:w-4
                          sm:h-4
                          rounded-full
                          border
                          border-black/25
                          dark:border-white/35
                          shadow-sm
                        "
                        style={{ backgroundColor: swatch.hex }}
                      />
                    </button>
                  );
                })}

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
                      px-1.5
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
              </>
            )}
          </div>
        </div>

        {/* PRICE + BUTTON */}
        <div
          className="
            flex
            items-center
            justify-between
            pt-2
            sm:pt-3
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
              w-[68px]
              h-[40px]
              flex
              items-center
              justify-center
              flex-shrink-0
            "
          >
            {product.in_stock && (
              <button
                onClick={handleQuickAdd}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
