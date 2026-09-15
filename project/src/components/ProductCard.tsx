import { Plus } from 'lucide-react';
import type { Product } from '@/lib/supabase';
import { useCart } from '@/lib/cart';
import { useCurrency } from '@/lib/currency';
import { Link } from '@/lib/router';

interface ProductCardProps {
  product: Product;
  isNew?: boolean;
  isReady?: boolean;
}

export default function ProductCard({
  product,
  isNew,
}: ProductCardProps) {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();

  const isKit =
    product.section?.toLowerCase() === 'kits' ||
    product.section?.toLowerCase() === 'kit';

  const rawIsNew =
    isNew ??
    (product.is_new || product.isNew || false);

  const showNewBadge =
    isKit && rawIsNew;

  const isInstruction =
    product.section?.toLowerCase() === 'instructions' ||
    product.section?.toLowerCase() === 'instruction';


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
        to={`/product/${product.slug}`}
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
          src={product.image_url}
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


        {showNewBadge && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <span
              className="
                px-2
                py-0.5
                sm:px-3
                sm:py-1
                text-neutral-950
                text-[10px]
                sm:text-xs
                font-black
                uppercase
                tracking-wider
                rounded-full
                shadow-md
              "
              style={{
                backgroundColor:'#D2FF00',
              }}
            >
              NEW IN
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
              text-neutral-500
              dark:text-neutral-400
              text-xs
              sm:text-sm
              mt-1
              truncate
            "
          >
            {
              isInstruction
                ? product.theme
                : `${product.piece_count} Pieces · ${product.theme}`
            }
          </p>


        </div>



        {/* PRICE + BUTTON */}
        <div
          className="
            flex
            items-center
            justify-between
            pt-3
            sm:pt-4
            gap-2
            mt-auto
            min-h-[42px]
          "
        >

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



          {/* 
            Keep the same space even when sold out.
            Button disappears but card height stays equal.
          */}
          <div
            className="
              w-[68px]
              h-[40px]
              flex
              justify-end
            "
          >

            {product.in_stock && (
              <button
                onClick={() =>
                  addItem(product)
                }
                className="
                  flex
                  items-center
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
