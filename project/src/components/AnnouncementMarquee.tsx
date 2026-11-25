import { useLayoutEffect } from 'react';
import { useRouter } from '@/lib/router';

const ALLOWED_PATHS = new Set([
  '/',
  '/store',
  '/instructions',
  '/custom-parts',
  '/contact',
]);

const MARQUEE_ITEMS = [
  '✈️ Free Worldwide Shipping on orders $99+ (or eqvilent)',
  '🧱 Buy any 2 kits & get a FREE random polybag!',
];

export function shouldShowMarquee(routePath: string): boolean {
  const clean = routePath.split('?')[0].split('#')[0];
  const normalized =
    clean.length > 1 ? clean.replace(/\/+$/, '').toLowerCase() : '/';
  return ALLOWED_PATHS.has(normalized);
}

export default function AnnouncementMarquee() {
  const { path } = useRouter();
  const visible = shouldShowMarquee(path);

  useLayoutEffect(() => {
    document.documentElement.style.setProperty(
      '--lcp-marquee-height',
      visible ? '2.25rem' : '0px'
    );

    return () => {
      document.documentElement.style.setProperty(
        '--lcp-marquee-height',
        '0px'
      );
    };
  }, [visible]);

  if (!visible) {
    return null;
  }

  const repeatedItems = [
    ...MARQUEE_ITEMS,
    ...MARQUEE_ITEMS,
    ...MARQUEE_ITEMS,
    ...MARQUEE_ITEMS,
  ];

  return (
    <div
      className="
        w-full
        bg-neutral-950
        dark:bg-white
        text-white
        dark:text-neutral-950
        border-b
        border-neutral-800/80
        dark:border-neutral-200/80
        pt-[env(safe-area-inset-top)]
        overflow-hidden
        select-none
        relative
        z-50
      "
    >
      <style>{`
        @keyframes lcp-marquee-scroll {
          0% {
            transform: translate3d(0%, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .lcp-marquee-track {
          display: flex;
          width: max-content;
          animation: lcp-marquee-scroll 28s linear infinite;
          will-change: transform;
        }

        .lcp-marquee-wrapper:hover .lcp-marquee-track {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .lcp-marquee-track {
            animation: none;
          }
        }
      `}</style>

      <div className="lcp-marquee-wrapper h-9 flex items-center overflow-hidden">
        <div className="lcp-marquee-track">
          {repeatedItems.map((text, idx) => (
            <div
              key={idx}
              className="flex items-center whitespace-nowrap text-xs sm:text-[13px] font-semibold tracking-wider uppercase"
            >
              <span className="mx-6">{text}</span>
              <span
                aria-hidden="true"
                className="text-neutral-500 dark:text-neutral-400"
              >
                •
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
