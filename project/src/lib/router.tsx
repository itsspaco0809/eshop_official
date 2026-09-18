import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
}

const HISTORY_SCROLL_KEY = '__lcpScrollY';
const HISTORY_PATH_KEY = '__lcpPath';
const HISTORY_FROM_PATH_KEY = '__lcpFromPath';
const BROWSER_HISTORY_SCROLL_KEY = 'lcp-browser-history-scroll';

/*
 * Browser Back / Forward must NOT restore the browser's own scroll position.
 * App.tsx owns scroll restoration so that Home can always render at TOP while
 * Store / Instructions / Custom Parts can restore their saved positions.
 *
 * This has to run at module evaluation time, not inside useEffect: Safari and
 * Chromium can perform history scroll restoration around the same time as popstate.
 */
if (
  typeof window !== 'undefined' &&
  'scrollRestoration' in window.history
) {
  window.history.scrollRestoration = 'manual';
}

/*
 * IMPORTANT:
 * Keep the query string in the router path.
 *
 * Examples:
 *   /store?page=3
 *   /instructions?page=2
 *   /custom-parts?page=4
 *
 * This allows each listing page to recover its pagination state.
 */
const getPath = () => {
  if (typeof window === 'undefined') {
    return '/';
  }

  return (
    window.location.pathname +
    window.location.search +
    window.location.hash
  );
};

const getRoutePath = (route: string) =>
  route.split('?')[0].split('#')[0];

const getScrollY = () => {
  if (typeof window === 'undefined') return 0;

  return Math.max(
    window.scrollY || 0,
    window.pageYOffset || 0,
    document.documentElement.scrollTop || 0,
    document.body.scrollTop || 0
  );
};

const isRestorableRoute = (route: string) => {
  const cleanRoute = getRoutePath(route);

  return (
    cleanRoute === '/store' ||
    cleanRoute === '/instructions' ||
    cleanRoute === '/custom-parts'
  );
};

const initialiseHistoryEntry = () => {
  if (typeof window === 'undefined') return;

  const currentPath = getPath();
  const currentState = window.history.state || {};

  window.history.replaceState(
    {
      ...currentState,
      [HISTORY_PATH_KEY]: currentPath,
      [HISTORY_SCROLL_KEY]: 0,
    },
    '',
    window.location.href
  );
};

const RouterContext = createContext<RouterContextType>({
  path: getPath(),
  navigate: () => {},
});

export const RouterProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [path, setPath] = useState(getPath);

  useEffect(() => {
    initialiseHistoryEntry();

    const handlePopState = (event: PopStateEvent) => {
      /*
       * IMPORTANT:
       * getPath() includes ?page=N.
       *
       * Examples:
       *   /store?page=3
       *   /instructions?page=2
       *   /custom-parts?page=4
       */
      const targetPath = getPath();
      const targetState = event.state || {};

      const storedScroll = Number(
        targetState[HISTORY_SCROLL_KEY]
      );

      const targetScroll =
        isRestorableRoute(targetPath) &&
        Number.isFinite(storedScroll) &&
        storedScroll >= 0
          ? storedScroll
          : 0;

      /*
       * Home is never a scroll-restorable route.
       * Reset the native document position BEFORE React receives the new path.
       */
      if (!isRestorableRoute(targetPath)) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant',
        });

        document.documentElement.scrollTop = 0;
        document.documentElement.scrollLeft = 0;
        document.body.scrollTop = 0;
        document.body.scrollLeft = 0;
      }

      try {
        sessionStorage.setItem(
          BROWSER_HISTORY_SCROLL_KEY,
          String(targetScroll)
        );
      } catch {
        // Ignore storage restrictions.
      }

      /*
       * Keep the complete route, including query parameters.
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

  const navigate = (to: string) => {
    /*
     * Start with the requested target.
     */
    let targetPath = to.startsWith('/')
      ? to
      : `/${to}`;

    const currentPath = getPath();
    const currentState = window.history.state || {};
    const currentScroll = getScrollY();

    /*
     * ============================================================
     * IMPORTANT FIX:
     *
     * If the current page was opened FROM:
     *
     *   /store?page=2
     *   /instructions?page=3
     *   /custom-parts?page=4
     *
     * and the app asks to navigate back to the corresponding
     * listing route:
     *
     *   /store
     *   /instructions
     *   /custom-parts
     *
     * restore the exact original URL instead.
     *
     * This means:
     *
     *   /store?page=2
     *      -> product
     *      -> Back to Store
     *      -> /store?page=2
     *
     *   /instructions?page=3
     *      -> detail
     *      -> Back to Instructions
     *      -> /instructions?page=3
     *
     *   /custom-parts?page=4
     *      -> detail
     *      -> Back to Custom Parts
     *      -> /custom-parts?page=4
     *
     * We only do this for these three restorable listing routes.
     * Everything else behaves exactly as before.
     * ============================================================
     */
    const storedFromPath =
      typeof currentState[HISTORY_FROM_PATH_KEY] ===
      'string'
        ? currentState[HISTORY_FROM_PATH_KEY]
        : '';

    const targetRoute = getRoutePath(targetPath);
    const storedFromRoute =
      getRoutePath(storedFromPath);

    if (
      isRestorableRoute(storedFromPath) &&
      targetRoute === storedFromRoute
    ) {
      targetPath = storedFromPath;
    }

    /*
     * Save the CURRENT history entry before creating the next one.
     *
     * The full currentPath is stored, including ?page=N.
     */
    window.history.replaceState(
      {
        ...currentState,
        [HISTORY_PATH_KEY]: currentPath,
        [HISTORY_SCROLL_KEY]:
          isRestorableRoute(currentPath)
            ? currentScroll
            : 0,
      },
      '',
      window.location.href
    );

    /*
     * Create the next history entry.
     *
     * targetPath may contain query parameters, e.g.
     *
     *   /store?page=3
     *   /instructions?page=2
     *   /custom-parts?page=4
     */
    window.history.pushState(
      {
        [HISTORY_PATH_KEY]: targetPath,
        [HISTORY_SCROLL_KEY]: 0,

        /*
         * Keep the exact page the user came from,
         * including ?page=N.
         */
        [HISTORY_FROM_PATH_KEY]: currentPath,
      },
      '',
      targetPath
    );

    try {
      sessionStorage.removeItem(
        BROWSER_HISTORY_SCROLL_KEY
      );
    } catch {
      // Ignore storage restrictions.
    }

    setPath(targetPath);
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

export const useRouter = () =>
  useContext(RouterContext);

interface RouteProps {
  path: string;
  element: React.ReactNode;
}

export const Route: React.FC<RouteProps> = ({
  path: routePath,
  element,
}) => {
  const { path: currentPath } = useRouter();

  /*
   * Route matching must ignore ?query and #hash.
   *
   * Router path keeps query parameters so pages can use them
   * for state, but:
   *
   *   /store?page=3
   *
   * still matches:
   *
   *   <Route path="/store" />
   */
  const matchRoute = (
    pattern: string,
    current: string
  ) => {
    const cleanPattern = getRoutePath(pattern);
    const cleanCurrent = getRoutePath(current);

    if (cleanPattern === cleanCurrent) {
      return true;
    }

    if (cleanPattern.includes(':')) {
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
        (part, i) => {
          if (part.startsWith(':')) {
            return true;
          }

          return part === currentParts[i];
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
  const { navigate } = useRouter();

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();

    if (onClick) {
      onClick();
    }

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