import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { CartProvider } from '@/lib/cart';
import { AuthProvider } from '@/lib/auth';
import { CurrencyProvider } from '@/lib/currency';
import { ThemeProvider } from '@/lib/theme';

import {
  RouterProvider,
  useRouter,
} from '@/lib/router';

import { supabase } from '@/lib/supabase';
import { ArrowUp } from 'lucide-react';

import Navbar from '@/components/Navbar';
import IntroOverlay from '@/components/IntroOverlay';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';

import Home from '@/pages/Home';
import Store from '@/pages/Store';
import Instructions from '@/pages/Instructions';
import CustomParts from '@/pages/CustomParts';
import Contact from '@/pages/Contact';
import ProductDetail from '@/pages/ProductDetail';
import Checkout from '@/pages/Checkout';
import OrderHistory from '@/pages/OrderHistory';
import Admin from '@/pages/Admin';
import AdminProducts from '@/pages/AdminProducts';
import AdminDigitalProducts from '@/pages/AdminDigitalProducts';
import AdminOrdersAndItems from '@/pages/AdminOrdersAndItems';
import AdminMessages from '@/pages/AdminMessages';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import ShippingInfo from '@/pages/ShippingInfo';

import Lenis from 'lenis';
import { setGlobalLenis } from '@/lib/lenis';


/* =========================================================
   SCROLL HELPERS
   ========================================================= */

const getDocumentScrollTop = () => {
  if (typeof window === 'undefined') return 0;

  return Math.max(
    window.scrollY || 0,
    window.pageYOffset || 0,
    document.documentElement.scrollTop || 0,
    document.body.scrollTop || 0
  );
};

const getBackToTopThreshold = () => {
  if (typeof window === 'undefined') return 300;

  // Show only after the user has moved beyond one responsive viewport.
  // This avoids the button appearing during the first screen on phones.
  return Math.max(300, Math.round(window.innerHeight));
};


/* =========================================================
   ROUTES
   ========================================================= */

function Routes({
  onProductLoadingChange,
}: {
  onProductLoadingChange: (loading: boolean) => void;
}) {
  const { path } = useRouter();

  const cleanPath =
    path.split('?')[0];


  if (cleanPath === '/') {
    return <Home />;
  }


  if (cleanPath === '/store') {
    return <Store />;
  }


  if (cleanPath === '/instructions') {
    return <Instructions />;
  }


  if (cleanPath === '/custom-parts') {
    return <CustomParts />;
  }


  if (cleanPath === '/contact') {
    return <Contact />;
  }


  if (cleanPath === '/checkout') {
    return <Checkout />;
  }


  if (cleanPath === '/orders') {
    return <OrderHistory />;
  }


  if (cleanPath === '/admin') {
    return <Admin />;
  }


  if (cleanPath === '/admin/products') {
    return <AdminProducts />;
  }


  if (cleanPath === '/admin/digital-products') {
    return <AdminDigitalProducts />;
  }


  if (cleanPath === '/admin/ordersanditems') {
    return <AdminOrdersAndItems />;
  }


  if (cleanPath === '/admin/messages') {
    return <AdminMessages />;
  }


  if (cleanPath === '/privacy-policy') {
    return <PrivacyPolicy />;
  }


  if (cleanPath === '/terms-of-service') {
    return <TermsOfService />;
  }


  if (cleanPath === '/shipping-info') {
    return <ShippingInfo />;
  }


  /* =======================================================
     PRODUCT DETAIL
     ======================================================= */

  if (cleanPath.startsWith('/product/')) {

    const slug =
      cleanPath.replace(
        '/product/',
        ''
      );


    return (
      <ProductDetail
        slug={slug}
        onLoadingChange={
          onProductLoadingChange
        }
      />
    );
  }


  if (cleanPath.startsWith('/orders/')) {
    return <OrderHistory />;
  }


  return <Home />;
}


/* =========================================================
   APP CONTENT
   ========================================================= */

const SCROLL_RESTORE_PATHS = new Set([
  '/store',
  '/instructions',
  '/custom-parts',
]);

const shouldRememberScroll = (routePath: string) =>
  SCROLL_RESTORE_PATHS.has(routePath.split('?')[0]);

function AppContent() {

  const { path } =
    useRouter();


  const cleanPath =
    path.split('?')[0];


  /* =======================================================
     LENIS
     ======================================================= */

  const lenisRef =
    useRef<Lenis | null>(null);



  const currentPathRef =
    useRef(path);

  const isRestoringRef =
    useRef(false);


  /* =======================================================
     GENERAL STATE
     ======================================================= */

  const [
    showScrollTop,
    setShowScrollTop,
  ] = useState(false);


  /* =======================================================
     PRODUCT LOADING STATE
     ======================================================= */

  const isProductPage =
    cleanPath.startsWith('/product/');


  /*
   * Important:
   *
   * If current route is already a product page,
   * start with loading = true.
   *
   * This prevents the first render from being
   * scrollable before ProductDetail reports its
   * loading state.
   */

  const [
    productLoading,
    setProductLoading,
  ] = useState(isProductPage);


  /* =======================================================
     INTRO STATE
     ======================================================= */

  const [
    isIntroFinished,
    setIsIntroFinished,
  ] = useState(() => {

    if (
      typeof window === 'undefined'
    ) {
      return false;
    }


    if (cleanPath !== '/') {
      return true;
    }


    const completed =
      sessionStorage.getItem(
        'lcp_intro_v2_completed'
      );


    return completed === 'true';

  });


  const showIntro =
    cleanPath === '/' &&
    !isIntroFinished;


  /* =======================================================
     PRODUCT ROUTE CHANGE
     =======================================================

     When navigating:

       /store
          ↓
       /product/a

     or:

       /product/a
          ↓
       /product/b

     immediately lock the page before paint.

     This prevents a short scroll window while the
     new ProductDetail component is mounting.
     ======================================================= */

  useLayoutEffect(() => {

    const isProduct =
      cleanPath.startsWith('/product/');


    setProductLoading(
      isProduct
    );

  }, [cleanPath]);


  /* =======================================================
     INTRO COMPLETE
     ======================================================= */

  useEffect(() => {

    const handleIntroComplete = () => {

      sessionStorage.setItem(
        'lcp_intro_v2_completed',
        'true'
      );


      setIsIntroFinished(
        true
      );


      requestAnimationFrame(() => {

        /*
         * Do not force Lenis to start if
         * ProductDetail is still loading.
         */

        if (
          lenisRef.current &&
          !isProductPage &&
          !productLoading
        ) {

          lenisRef.current.resize();

          lenisRef.current.start();

        }


        window.dispatchEvent(
          new Event('resize')
        );

      });

    };


    window.addEventListener(
      'introComplete',
      handleIntroComplete
    );


    return () => {

      window.removeEventListener(
        'introComplete',
        handleIntroComplete
      );

    };

  }, [
    isProductPage,
    productLoading,
  ]);


  /* =======================================================
     ROUTE / INTRO STATE
     ======================================================= */

  useEffect(() => {

    if (
      cleanPath !== '/'
    ) {

      setIsIntroFinished(
        true
      );

    }

  }, [cleanPath]);

  /* =======================================================
     PRODUCT DETAIL VIEWPORT SURFACE

     ProductDetail itself uses neutral-950 (#0a0a0a). Mark the
     document before paint so Safari's bottom safe-area uses the
     same surface on direct navigation and SPA route changes.
     ======================================================= */

  useLayoutEffect(() => {
    const isProductDetail = cleanPath.startsWith('/product/');
    const root = document.documentElement;

    root.classList.toggle(
      'product-detail-open',
      isProductDetail
    );

    window.dispatchEvent(
      new Event('lcp-surface-change')
    );
  }, [cleanPath]);


  /* =======================================================
     INTRO CLASS ONLY
     =======================================================

     IMPORTANT:
     Do NOT control body overflow here.

     Product loading and Intro loading are controlled
     together by the scroll-lock effect below.

     This avoids one effect accidentally unlocking
     another effect's scroll lock.
     ======================================================= */

  useEffect(() => {

    if (showIntro) {

      document.documentElement.classList.add(
        'intro-active'
      );

    } else {

      document.documentElement.classList.remove(
        'intro-active'
      );

    }

  }, [showIntro]);


  /* =======================================================
     PRODUCT DETAIL SCROLL LOCK
     =======================================================

     Lock while:

       Product route
            AND
       ProductDetail loading / not ready

     Unlock only when:

       productLoading === false
     ======================================================= */

  useLayoutEffect(() => {

    const shouldLockProduct =
      isProductPage &&
      productLoading;


    if (shouldLockProduct) {

      /*
       * CSS state
       */

      document.documentElement.classList.add(
        'product-loading'
      );


      /*
       * Native browser scrolling
       */

      document.body.style.overflow =
        'hidden';

      document.body.style.touchAction =
        'none';


      document.documentElement.style.overscrollBehavior =
        'none';


      /*
       * Stop Lenis
       */

      if (lenisRef.current) {

        lenisRef.current.stop();

      }

    } else {

      /*
       * Remove Product loading class
       */

      document.documentElement.classList.remove(
        'product-loading'
      );


      /*
       * If Intro is still active,
       * keep body locked.
       */

      if (!showIntro) {

        document.body.style.overflow =
          '';

        document.body.style.touchAction =
          '';

        document.documentElement.style.overscrollBehavior =
          '';


        /*
         * Restart Lenis on next frame.
         */

        requestAnimationFrame(() => {

          /*
           * Product page can only reach here
           * after ProductDetail is ready.
           */

          if (
            lenisRef.current
          ) {

            lenisRef.current.resize();

            lenisRef.current.start();

          }

        });

      }

    }

  }, [
    isProductPage,
    productLoading,
    showIntro,
  ]);


  /* =======================================================
     PAGE VIEW TRACKING
     ======================================================= */

  useEffect(() => {

    let visitorId =
      localStorage.getItem(
        'visitor_id'
      );


    if (!visitorId) {

      visitorId =
        crypto.randomUUID();


      localStorage.setItem(
        'visitor_id',
        visitorId
      );

    }


    supabase.functions
      .invoke('record-page-view', {
        body: {
          path: cleanPath,
          visitor_id: visitorId,
        },
      })
      .catch(() => {
        // Analytics must never block navigation or page rendering.
      });

  }, [cleanPath]);


  /* =======================================================
     REMOVE BOLT / STACKBLITZ BADGE
     ======================================================= */

  useEffect(() => {

    const removeBadge = () => {

      const selectors = [

        'a[href*="bolt.new"]',

        'a[href*="stackblitz"]',

        '#bolt-badge',

        '[data-bolt-badge]',

        '[class*="bolt-badge"]',

        '[id*="bolt"]',

        'div[style*="z-index: 99999"]',

        'div[style*="z-index: 2147483647"]',

      ];


      selectors.forEach(
        (selector) => {

          document
            .querySelectorAll(
              selector
            )
            .forEach(
              (el) => el.remove()
            );

        }
      );

    };


    removeBadge();


    const observer =
      new MutationObserver(() => {

        removeBadge();

      });


    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true,
      }
    );


    return () => {

      observer.disconnect();

    };

  }, []);


  /* =======================================================
     DESKTOP STICKY FOOTER HEIGHT
     =======================================================

     Desktop:
       >= 1024px

     Footer:
       fixed
       bottom: 0
       z-index: 0

     Main:
       z-index: 10
       margin-bottom = footer height

     Mobile / Tablet:
       < 1024px
       footer normal flow
       variable = 0px
     ======================================================= */

  useEffect(() => {

    const footer =
      document.querySelector(
        '[data-sticky-footer]'
      );


    if (!footer) {
      return;
    }


    const updateFooterHeight =
      () => {

        const isDesktop =
          window.innerWidth >= 1024;


        if (isDesktop) {

          const height =
            footer.getBoundingClientRect()
              .height;


          document.documentElement.style.setProperty(
            '--lcp-footer-height',
            `${height}px`
          );

        } else {

          document.documentElement.style.setProperty(
            '--lcp-footer-height',
            '0px'
          );

        }

      };


    updateFooterHeight();


    const resizeObserver =
      new ResizeObserver(() => {

        updateFooterHeight();

      });


    resizeObserver.observe(
      footer
    );


    window.addEventListener(
      'resize',
      updateFooterHeight
    );


    return () => {

      resizeObserver.disconnect();


      window.removeEventListener(
        'resize',
        updateFooterHeight
      );


      document.documentElement.style.setProperty(
        '--lcp-footer-height',
        '0px'
      );

    };

  }, []);


  /* =======================================================
     LENIS
     ======================================================= */

  useEffect(() => {

    if (
      'scrollRestoration' in
      window.history
    ) {

      window.history.scrollRestoration =
        'manual';

    }


    // Keep native scrolling on touch devices. Lenis is only used on
    // desktop pointer devices so Android/iOS browsers always retain
    // their native vertical touch scrolling.
    const isTouchDevice =
      window.matchMedia('(pointer: coarse)').matches ||
      navigator.maxTouchPoints > 0 ||
      'ontouchstart' in window;

    if (isTouchDevice) {
      /*
       * Touch devices use the browser's native scroller.
       *
       * IMPORTANT:
       * Previously we returned here without installing a native
       * scroll listener, so Back To Top never became visible on
       * iOS/Android even though the page itself was scrolling.
       */
      lenisRef.current = null;
      setGlobalLenis(null);

      let scrollFrame = 0;

      const handleNativeScroll = () => {
        if (scrollFrame) return;

        scrollFrame = requestAnimationFrame(() => {
          scrollFrame = 0;

          const scrollTop = getDocumentScrollTop();

          setShowScrollTop(
            scrollTop > getBackToTopThreshold()
          );

          const activePath = currentPathRef.current;

          if (
            activePath &&
            shouldRememberScroll(activePath) &&
            !isRestoringRef.current
          ) {
            try {
              sessionStorage.setItem(
                `sp_${activePath}`,
                scrollTop.toString()
              );
            } catch {
              // Ignore storage restrictions.
            }
          }
        });
      };

      // Listen on both the viewport and document capture phase.
      // Safari and some Android WebViews differ in where the native
      // document scroll event is delivered.
      window.addEventListener('scroll', handleNativeScroll, {
        passive: true,
        capture: true,
      });
      document.addEventListener('scroll', handleNativeScroll, {
        passive: true,
        capture: true,
      });
      window.visualViewport?.addEventListener(
        'scroll',
        handleNativeScroll,
        { passive: true }
      );
      window.addEventListener('resize', handleNativeScroll, {
        passive: true,
      });

      handleNativeScroll();

      return () => {
        window.removeEventListener(
          'scroll',
          handleNativeScroll,
          true
        );
        document.removeEventListener(
          'scroll',
          handleNativeScroll,
          true
        );
        window.visualViewport?.removeEventListener(
          'scroll',
          handleNativeScroll
        );
        window.removeEventListener('resize', handleNativeScroll);

        if (scrollFrame) {
          cancelAnimationFrame(scrollFrame);
        }
      };
    }

    const lenis =
      new Lenis({
        duration: 1.2,
        smoothWheel: true,
        syncTouch: false,
      });

    lenisRef.current = lenis;
    setGlobalLenis(lenis);


    const handleScroll = (
      e: {
        scroll: number;
      }
    ) => {

      setShowScrollTop(
        e.scroll > getBackToTopThreshold()
      );


      const activePath =
        currentPathRef.current;


      if (
        shouldRememberScroll(activePath) &&
        !isRestoringRef.current
      ) {

        sessionStorage.setItem(
          `sp_${activePath}`,
          e.scroll.toString()
        );

      }

    };


    lenis.on(
      'scroll',
      handleScroll
    );


    let rafId = 0;


    const raf = (
      time: number
    ) => {

      lenis.raf(
        time
      );


      rafId =
        requestAnimationFrame(
          raf
        );

    };


    rafId =
      requestAnimationFrame(
        raf
      );


    /*
     * Immediately stop Lenis if:
     *
     * - Intro is active
     * - Product page is loading
     */

    if (
      showIntro ||
      (
        isProductPage &&
        productLoading
      )
    ) {

      lenis.stop();

    }


    return () => {

      cancelAnimationFrame(
        rafId
      );


      lenis.destroy();


      lenisRef.current =
        null;


      setGlobalLenis(
        null
      );

    };

  }, []);


  /* =======================================================
     LENIS START / STOP AFTER STATE CHANGES
     ======================================================= */

  useLayoutEffect(() => {

    if (
      !lenisRef.current
    ) {
      return;
    }


    const shouldStop =
      showIntro ||
      (
        isProductPage &&
        productLoading
      );


    if (shouldStop) {

      lenisRef.current.stop();

    } else {

      requestAnimationFrame(() => {

        if (
          lenisRef.current
        ) {

          lenisRef.current.resize();

          lenisRef.current.start();

        }

      });

    }

  }, [
    showIntro,
    isProductPage,
    productLoading,
  ]);


  /* =======================================================
     ROUTE SCROLL RESTORATION
     ======================================================= */

  useLayoutEffect(() => {

    /*
     * Product page is still loading.
     *
     * Do not perform scroll restoration yet.
     */

    // Capture the route we were on before this navigation. This is kept
    // separate from currentPathRef because ProductDetail can render through
    // a loading phase before this effect is allowed to perform scrolling.
    const previousPath = currentPathRef.current;

    /*
     * ---------------------------------------------------------
     * BROWSER BACK / FORWARD SCROLL RESTORATION
     * ---------------------------------------------------------
     *
     * router.tsx stores the scroll position of each history
     * entry and marks browser Back / Forward navigation in
     * sessionStorage.
     *
     * This must run before the normal navigation-to-top logic.
     */
    let browserHistoryScroll: number | null = null;

    try {
      const value = sessionStorage.getItem(
        'lcp-browser-history-scroll'
      );

      if (value !== null) {
        const parsed = Number(value);

        if (Number.isFinite(parsed) && parsed >= 0) {
          browserHistoryScroll = parsed;
        }

        sessionStorage.removeItem(
          'lcp-browser-history-scroll'
        );
      }
    } catch {
      browserHistoryScroll = null;
    }

    if (browserHistoryScroll !== null) {
      /*
       * Browser Back / Forward is intentionally different from the
       * ProductDetail return flow.
       *
       * Only Store / Instructions / Custom Parts may restore a saved
       * position. Home and every other route MUST be a true TOP render.
       * This prevents Home from inheriting a stale history/body offset.
       */
      const targetScroll = shouldRememberScroll(path)
        ? browserHistoryScroll
        : 0;

      isRestoringRef.current = true;

      if (lenisRef.current) {
        lenisRef.current.stop();
      }

      window.scrollTo({
        top: targetScroll,
        left: 0,
        behavior: 'instant',
      });

      document.documentElement.scrollTop = targetScroll;
      document.body.scrollTop = targetScroll;

      if (lenisRef.current) {
        lenisRef.current.resize();
        lenisRef.current.scrollTo(targetScroll, {
          immediate: true,
        });
      }

      setShowScrollTop(
        targetScroll > getBackToTopThreshold()
      );

      currentPathRef.current = path;
      isRestoringRef.current = false;

      if (
        lenisRef.current &&
        !showIntro &&
        !(isProductPage && productLoading)
      ) {
        lenisRef.current.start();
      }

      return;
    }

    if (
      isProductPage &&
      productLoading
    ) {
      return;
    }


    if (showIntro) {
      return;
    }


    const isTargetProduct =
      path.startsWith(
        '/product/'
      );

    const isComingFromProduct =
      previousPath !== null &&
      previousPath.startsWith('/product/');

    const canRestoreForTarget =
      shouldRememberScroll(path);

    let navbarRequestedTop = false;

    try {
      navbarRequestedTop =
        sessionStorage.getItem('lcp-navbar-force-top') === 'true';

      if (navbarRequestedTop) {
        sessionStorage.removeItem('lcp-navbar-force-top');
      }
    } catch {
      // Ignore storage restrictions.
    }

    const savedPosition =
      canRestoreForTarget
        ? sessionStorage.getItem(`sp_${path}`)
        : null;

    // Scroll restoration is intentionally very narrow:
    // ONLY ProductDetail -> Store / Instructions / Custom Parts.
    // A deliberate Navbar navigation always starts at 0, even if the
    // previous route happens to be a ProductDetail page.
    const shouldRestore =
      !navbarRequestedTop &&
      isComingFromProduct &&
      canRestoreForTarget &&
      savedPosition !== null;

    const targetScroll =
      shouldRestore
        ? parseFloat(savedPosition)
        : 0;


    isRestoringRef.current =
      true;


    if (
      lenisRef.current
    ) {

      lenisRef.current.stop();

    }


    window.scrollTo({
      top: targetScroll,
      left: 0,
      behavior: 'instant',
    });
    document.documentElement.scrollTop = targetScroll;
    document.body.scrollTop = targetScroll;


    let restoreFrame = 0;
    let restoreTimer: number | null = null;
    let restoreObserver: ResizeObserver | null = null;
    let restoreFinished = false;
    const restoreStartedAt = performance.now();

    const applyRestore = () => {
      if (restoreFinished) return;

      window.scrollTo({
        top: targetScroll,
        left: 0,
        behavior: 'instant',
      });
      document.documentElement.scrollTop = targetScroll;
      document.body.scrollTop = targetScroll;

      if (lenisRef.current) {
        lenisRef.current.resize();
        lenisRef.current.scrollTo(targetScroll, { immediate: true });
      }

      const actual = getDocumentScrollTop();
      const reachedTarget =
        targetScroll <= 0 ||
        Math.abs(actual - targetScroll) <= 2;

      const timedOut =
        performance.now() - restoreStartedAt > 2000;

      setShowScrollTop(
        targetScroll > getBackToTopThreshold()
      );

      if (reachedTarget || timedOut || isTargetProduct) {
        restoreFinished = true;
        isRestoringRef.current = false;
        if (restoreObserver) restoreObserver.disconnect();
        if (restoreTimer !== null) {
          window.clearTimeout(restoreTimer);
          restoreTimer = null;
        }

        if (lenisRef.current && !showIntro && !(isProductPage && productLoading)) {
          lenisRef.current.start();
        }
        return;
      }

      // The route may still be loading data. Re-apply after layout changes
      // rather than accepting the browser's temporary clamped position.
      restoreTimer = window.setTimeout(applyRestore, 100);
    };

    restoreFrame = requestAnimationFrame(() => {
      applyRestore();
    });

    if (shouldRestore) {
      const mainContent = document.getElementById('main-content');
      if (mainContent && typeof ResizeObserver !== 'undefined') {
        restoreObserver = new ResizeObserver(() => {
          if (!restoreFinished) applyRestore();
        });
        restoreObserver.observe(mainContent);
      }
    }


    currentPathRef.current =
      path;


    return () => {
      cancelAnimationFrame(restoreFrame);
      if (restoreTimer !== null) {
        window.clearTimeout(restoreTimer);
      }
      restoreObserver?.disconnect();
    };

  }, [
    path,
    showIntro,
    isProductPage,
    productLoading,
  ]);


  /* =======================================================
     BACK TO TOP
     ======================================================= */

  const scrollToTop = () => {

    /*
     * Never allow Back To Top to work while
     * ProductDetail is still loading.
     */

    if (
      isProductPage &&
      productLoading
    ) {

      return;

    }


    if (
      lenisRef.current
    ) {

      lenisRef.current.scrollTo(
        0,
        {
          duration: 1.2,
        }
      );

    } else {

      setShowScrollTop(false);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

    }

  };


  /* =======================================================
     APP SHELL
     ======================================================= */

  return (

    <div
      id="app-shell"
      className="
        min-h-[100dvh]
        min-h-screen
        bg-white
        dark:bg-[#121212]
        text-neutral-900
        dark:text-neutral-100
        flex
        flex-col
        relative
      "
    >

      <div
        id="app-wrapper"
        className="
          flex-1
          flex
          flex-col
          relative
          bg-white
          dark:bg-[#121212]
          min-w-0
        "
      >

        {/* =================================================
            INTRO
            ================================================= */}

        {showIntro && (
          <IntroOverlay />
        )}


        {/* =================================================
            NAVBAR
            ================================================= */}

        <Navbar
          isIntroFinished={
            isIntroFinished
          }
        />


        {/* =================================================
            MAIN CONTENT
            ================================================= */}

        <main
          id="main-content"
          className="
            relative
            z-10
            flex-none
            w-full
            bg-white
            dark:bg-[#121212]
            min-h-[100dvh]
            min-h-screen
            mb-0
            lg:mb-[var(--lcp-footer-height)]
          "
        >

          <div key={path}>

            <Routes
              onProductLoadingChange={
                setProductLoading
              }
            />

          </div>

        </main>


        {/* =================================================
            FOOTER
            ================================================= */}

        <Footer
          hidden={showIntro}
        />


        {/* =================================================
            BACK TO TOP
            ================================================= */}

        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className={`
            fixed
            bottom-[max(1.5rem,env(safe-area-inset-bottom))]
            right-6
            z-40
            p-3
            bg-neutral-100/90
            dark:bg-neutral-900/90
            border
            border-neutral-300
            dark:border-neutral-800
            text-neutral-900
            dark:text-white
            rounded-full
            shadow-2xl
            backdrop-blur-md
            transition-all
            duration-300
            hover:scale-110

            ${
              showScrollTop &&
              !showIntro &&
              !(
                isProductPage &&
                productLoading
              )
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4 pointer-events-none'
            }
          `}
        >

          <ArrowUp
            className="w-5 h-5"
          />

        </button>

      </div>


      {/* ===================================================
          CART
          =================================================== */}

      <CartDrawer />

    </div>

  );
}


/* =========================================================
   APP PROVIDERS
   ========================================================= */

export default function App() {

  return (

    <RouterProvider>

      <AuthProvider>

        <CurrencyProvider>

          <ThemeProvider>

            <CartProvider>

              <AppContent />

            </CartProvider>

          </ThemeProvider>

        </CurrencyProvider>

      </AuthProvider>

    </RouterProvider>

  );
}