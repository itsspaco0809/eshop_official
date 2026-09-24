import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
}

const HISTORY_SCROLL_KEY = '__lcpScrollY';
const HISTORY_PATH_KEY = '__lcpPath';
const HISTORY_FROM_PATH_KEY = '__lcpFromPath';

const BROWSER_HISTORY_SCROLL_KEY =
  'lcp-browser-history-scroll';

/*
 * ============================================================
 * Browser scroll restoration
 * ============================================================
 *
 * The browser must NOT restore its own scroll position.
 * Our application handles it instead.
 *
 * This is intentionally executed at module evaluation time,
 * before React effects start running.
 * ============================================================
 */

if (
  typeof window !== 'undefined' &&
  'scrollRestoration' in window.history
) {
  window.history.scrollRestoration = 'manual';
}

/*
 * ============================================================
 * Path helpers
 * ============================================================
 */

const getPath = (): string => {
  if (typeof window === 'undefined') {
    return '/';
  }

  return (
    window.location.pathname +
    window.location.search +
    window.location.hash
  );
};

/*
 * Remove query string and hash.
 *
 * Example:
 *
 * /store?page=3
 *      ↓
 * /store
 */
const getRoutePath = (route: string): string => {
  return route.split('?')[0].split('#')[0];
};

/*
 * ============================================================
 * Scroll helper
 * ============================================================
 */

const getScrollY = (): number => {
  if (typeof window === 'undefined') {
    return 0;
  }

  return Math.max(
    window.scrollY || 0,
    window.pageYOffset || 0,
    document.documentElement.scrollTop || 0,
    document.body.scrollTop || 0
  );
};

/*
 * ============================================================
 * Restorable listing routes
 * ============================================================
 *
 * These routes are allowed to restore their previous scroll
 * position.
 *
 * Home / ProductDetail / Checkout etc. always start at top.
 * ============================================================
 */

const isRestorableRoute = (route: string): boolean => {
  const cleanRoute = getRoutePath(route);

  return (
    cleanRoute === '/store' ||
    cleanRoute === '/instructions' ||
    cleanRoute === '/custom-parts'
  );
};

/*
 * ============================================================
 * Reset document scroll
 * ============================================================
 */

const resetScrollToTop = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'instant',
  });

  document.documentElement.scrollTop = 0;
  document.documentElement.scrollLeft = 0;

  document.body.scrollTop = 0;
  document.body.scrollLeft = 0;
};

/*
 * ============================================================
 * Safely get current history state
 * ============================================================
 */

const getCurrentHistoryState = (): Record<
  string,
  unknown
> => {
  if (
    typeof window === 'undefined' ||
    !window.history.state
  ) {
    return {};
  }

  return window.history.state;
};

/*
 * ============================================================
 * Initialise the current history entry
 * ============================================================
 *
 * IMPORTANT:
 *
 * The old implementation always did:
 *
 *   HISTORY_SCROLL_KEY: 0
 *
 * That could overwrite an existing history entry which had
 * already been assigned a scroll position.
 *
 * This version ONLY initializes an entry if it has not already
 * been initialized by our router.
 * ============================================================
 */

const initialiseHistoryEntry = () => {
  if (typeof window === 'undefined') {
    return;
  }

  const currentPath = getPath();
  const currentState = getCurrentHistoryState();

  const alreadyInitialized =
    typeof currentState[HISTORY_PATH_KEY] ===
      'string' &&
    Object.prototype.hasOwnProperty.call(
      currentState,
      HISTORY_SCROLL_KEY
    );

  /*
   * VERY IMPORTANT:
   *
   * Never overwrite an existing router-managed entry.
   */
  if (alreadyInitialized) {
    return;
  }

  const initialScroll =
    isRestorableRoute(currentPath)
      ? getScrollY()
      : 0;

  window.history.replaceState(
    {
      ...currentState,

      [HISTORY_PATH_KEY]: currentPath,

      [HISTORY_SCROLL_KEY]: initialScroll,
    },
    '',
    window.location.href
  );
};

/*
 * ============================================================
 * Router context
 * ============================================================
 */

const RouterContext =
  createContext<RouterContextType>({
    path: getPath(),
    navigate: () => {},
  });

/*
 * ============================================================
 * Router Provider
 * ============================================================
 */

export const RouterProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [path, setPath] = useState<string>(
    getPath()
  );

  /*
   * ==========================================================
   * Browser Back / Forward
   * ==========================================================
   */

  useEffect(() => {
    /*
     * Initialise ONLY once.
     *
     * This will not overwrite an already-managed history
     * entry.
     */
    initialiseHistoryEntry();

    const handlePopState = (
      event: PopStateEvent
    ) => {
      /*
       * IMPORTANT:
       *
       * Do NOT reconstruct the previous URL manually.
       *
       * Browser history already knows exactly which entry
       * the user returned to.
       *
       * Therefore:
       *
       * Page 3
       *   ↓
       * ProductDetail
       *   ↓ browser back
       * Page 3
       *
       * will naturally return:
       *
       * /store?page=3
       */
      const targetPath = getPath();

      const targetState =
        event.state || {};

      /*
       * Read the scroll position stored on the exact
       * history entry that the browser returned to.
       */
      const storedScroll = Number(
        targetState[HISTORY_SCROLL_KEY]
      );

      const hasStoredScroll =
        Object.prototype.hasOwnProperty.call(
          targetState,
          HISTORY_SCROLL_KEY
        ) &&
        Number.isFinite(storedScroll) &&
        storedScroll >= 0;

      const targetScroll =
        isRestorableRoute(targetPath) &&
        hasStoredScroll
          ? storedScroll
          : 0;

      /*
       * Store this temporarily so App.tsx / listing pages can
       * consume the exact target scroll if they need to.
       */
      try {
        sessionStorage.setItem(
          BROWSER_HISTORY_SCROLL_KEY,
          String(targetScroll)
        );
      } catch {
        // Ignore storage restrictions.
      }

      /*
       * For non-restorable pages, immediately force the
       * document to the top.
       *
       * This prevents browser/native restoration from leaving
       * the old listing scroll position visible during the
       * React route transition.
       */
      if (!isRestorableRoute(targetPath)) {
        resetScrollToTop();
      }

      /*
       * IMPORTANT:
       *
       * The complete path is retained, including:
       *
       * /store?page=3
       *
       * /instructions?page=2
       *
       * /custom-parts?page=4
       */
      setPath(targetPath);
    };

    window.addEventListener(
      'popstate',
      handlePopState
    );

    return () => {
      window.removeEventListener(
        'popstate',
        handlePopState
      );
    };
  }, []);

  /*
   * ==========================================================
   * Programmatic navigation
   * ==========================================================
   */

  const navigate = (to: string) => {
    if (
      typeof window === 'undefined'
    ) {
      return;
    }

    /*
     * --------------------------------------------------------
     * Normalize target path
     * --------------------------------------------------------
     */

    let targetPath = to.startsWith('/')
      ? to
      : `/${to}`;

    const currentPath = getPath();

    const currentState =
      getCurrentHistoryState();

    /*
     * --------------------------------------------------------
     * ProductDetail → Listing "Back" button
     * --------------------------------------------------------
     *
     * ProductDetail stores the exact URL it came from in:
     *
     *   __lcpFromPath
     *
     * If its Back button navigates to the listing route, do NOT
     * create a new history entry.
     *
     * IMPORTANT:
     *
     * The ProductDetail Back button may use:
     *
     *   /store
     *
     * while the actual original page was:
     *
     *   /store?page=3
     *
     * Therefore we compare the ROUTE PATH only:
     *
     *   /store?page=3 → /store
     *
     * becomes:
     *
     *   /store → /store
     *
     * Once confirmed, we use the browser's real history.back()
     * so the original URL, pagination and scroll position are
     * all preserved.
     *
     * Example:
     *
     *   /store?page=3
     *       ↓
     *   /product/foo
     *       ↓ Back to Kits
     *   history.back()
     *       ↓
     *   /store?page=3 + original scroll
     *
     * This also applies to:
     *
     *   /instructions?page=N
     *   /custom-parts?page=N
     */
    const storedFromPath =
      typeof currentState[HISTORY_FROM_PATH_KEY] === 'string'
        ? currentState[HISTORY_FROM_PATH_KEY]
        : '';

    const isProductDetail =
      getRoutePath(currentPath).startsWith('/product/');

    const isReturningToOriginalListing =
      isProductDetail &&
      isRestorableRoute(storedFromPath) &&
      getRoutePath(storedFromPath) ===
        getRoutePath(targetPath);

    if (isReturningToOriginalListing) {
      /*
       * IMPORTANT:
       *
       * Do NOT use:
       *
       *   history.pushState('/store')
       *
       * because that would create:
       *
       *   /store
       *
       * and lose:
       *
       *   /store?page=3
       *
       * Instead, use the browser's real history entry.
       *
       * The browser will return to the exact entry that was
       * originally saved when the user clicked the product.
       */
      window.history.back();
      return;
    }

    const currentScroll =
      getScrollY();

    /*
     * --------------------------------------------------------
     * Save the current history entry
     * --------------------------------------------------------
     *
     * This is the most important part for:
     *
     * /store?page=3
     *       ↓
     * ProductDetail
     *
     * Before leaving Page 3, save:
     *
     *   path  = /store?page=3
     *   scroll = current scroll position
     *
     * Therefore Browser Back can return to the exact entry.
     * --------------------------------------------------------
     */

    const updatedCurrentState = {
      ...currentState,

      [HISTORY_PATH_KEY]:
        currentPath,

      [HISTORY_SCROLL_KEY]:
        isRestorableRoute(currentPath)
          ? currentScroll
          : 0,
    };

    window.history.replaceState(
      updatedCurrentState,
      '',
      window.location.href
    );

    /*
     * --------------------------------------------------------
     * Create the next history entry
     * --------------------------------------------------------
     */

    const nextState = {
      [HISTORY_PATH_KEY]:
        targetPath,

      /*
       * New pages start at the top.
       *
       * If targetPath is a listing page and it contains
       * ?page=N, the listing page itself will determine its
       * initial position.
       *
       * We do NOT copy the previous scroll here.
       */
      [HISTORY_SCROLL_KEY]: 0,

      /*
       * Remember exactly where this page came from.
       *
       * Example:
       *
       * ProductDetail
       *     from:
       * /store?page=3
       *
       * This is useful for ProductDetail's own "Back to Store"
       * button.
       */
      [HISTORY_FROM_PATH_KEY]:
        currentPath,
    };

    window.history.pushState(
      nextState,
      '',
      targetPath
    );

    /*
     * Clear temporary browser-back scroll data.
     *
     * A normal Link navigation is NOT a browser Back operation.
     */
    try {
      sessionStorage.removeItem(
        BROWSER_HISTORY_SCROLL_KEY
      );
    } catch {
      // Ignore storage restrictions.
    }

    /*
     * New route.
     */
    setPath(targetPath);

    /*
     * IMPORTANT:
     *
     * Programmatic navigation to another page should start
     * from the top.
     *
     * This is especially important when going:
     *
     * Store → ProductDetail
     *
     * otherwise the ProductDetail could briefly appear at the
     * old Store scroll position.
     */
    if (!isRestorableRoute(targetPath)) {
      resetScrollToTop();
    }
  };

  return (
    <RouterContext.Provider
      value={{
        path,
        navigate,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

/*
 * ============================================================
 * useRouter
 * ============================================================
 */

export const useRouter = () =>
  useContext(RouterContext);

/*
 * ============================================================
 * Route
 * ============================================================
 */

interface RouteProps {
  path: string;
  element: React.ReactNode;
}

export const Route: React.FC<RouteProps> = ({
  path: routePath,
  element,
}) => {
  const {
    path: currentPath,
  } = useRouter();

  /*
   * ----------------------------------------------------------
   * Route matching
   * ----------------------------------------------------------
   *
   * Query parameters and hashes do NOT affect route matching.
   *
   * Therefore:
   *
   * /store
   *
   * matches:
   *
   * /store?page=1
   * /store?page=2
   * /store?page=3
   *
   * etc.
   * ----------------------------------------------------------
   */

  const matchRoute = (
    pattern: string,
    current: string
  ): boolean => {
    const cleanPattern =
      getRoutePath(pattern);

    const cleanCurrent =
      getRoutePath(current);

    /*
     * Exact route.
     */
    if (
      cleanPattern === cleanCurrent
    ) {
      return true;
    }

    /*
     * Dynamic route.
     *
     * Example:
     *
     * /product/:id
     *
     * matches:
     *
     * /product/123
     */
    if (
      cleanPattern.includes(':')
    ) {
      const patternParts =
        cleanPattern.split('/');

      const currentParts =
        cleanCurrent.split('/');

      if (
        patternParts.length !==
        currentParts.length
      ) {
        return false;
      }

      return patternParts.every(
        (part, index) => {
          if (
            part.startsWith(':')
          ) {
            return true;
          }

          return (
            part ===
            currentParts[index]
          );
        }
      );
    }

    return false;
  };

  if (
    matchRoute(
      routePath,
      currentPath
    )
  ) {
    return <>{element}</>;
  }

  return null;
};

/*
 * ============================================================
 * Link
 * ============================================================
 */

export const Link: React.FC<{
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({
  to,
  children,
  className,
  onClick,
}) => {
  const {
    navigate,
  } = useRouter();

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();

    /*
     * Preserve existing Link onClick behaviour.
     */
    if (onClick) {
      onClick();
    }

    /*
     * Use our SPA router instead of browser navigation.
     */
    navigate(to);
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
};
