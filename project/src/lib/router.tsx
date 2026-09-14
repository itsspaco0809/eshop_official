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
const BROWSER_HISTORY_SCROLL_KEY = 'lcp-browser-history-scroll';

/*
 * Browser Back / Forward must NOT restore the browser's own scroll position.
 * App.tsx owns scroll restoration so that Home can always render at TOP while
 * Store / Instructions / Custom Parts can restore their saved positions.
 *
 * This has to run at module evaluation time, not inside useEffect: Safari and
 * Chromium can perform history scroll restoration around the same time as
 * popstate. Setting this only after the first paint is too late.
 */
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const getPath = () =>
  typeof window !== 'undefined'
    ? window.location.pathname
    : '/';

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
  const cleanRoute = route.split('?')[0];

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
       * This closes the small window in which the browser can still expose the
       * previous ProductDetail scroll position while <Home /> is mounting.
       *
       * Store / Instructions / Custom Parts are intentionally left to App.tsx
       * because those routes may need their saved position restored after their
       * new layout has mounted.
       */
      if (!isRestorableRoute(targetPath)) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant',
        });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }

      try {
        sessionStorage.setItem(
          BROWSER_HISTORY_SCROLL_KEY,
          String(targetScroll)
        );
      } catch {
        // Ignore storage restrictions.
      }

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
    const targetPath = to.startsWith('/')
      ? to
      : `/${to}`;

    const currentPath = getPath();
    const currentState = window.history.state || {};
    const currentScroll = getScrollY();

    /*
     * Save the CURRENT history entry before creating the next one.
     *
     * Only /store, /instructions and /custom-parts are allowed to
     * restore their previous position. Home and every other route
     * always start at the top when reached through browser history.
     */
    window.history.replaceState(
      {
        ...currentState,
        [HISTORY_PATH_KEY]: currentPath,
        [HISTORY_SCROLL_KEY]: isRestorableRoute(currentPath)
          ? currentScroll
          : 0,
      },
      '',
      window.location.href
    );

    /*
     * Every newly navigated route starts from TOP. The App route
     * restoration layer will override this only for the dedicated
     * ProductDetail -> Store / Instructions / Custom Parts return flow.
     */
    window.history.pushState(
      {
        [HISTORY_PATH_KEY]: targetPath,
        [HISTORY_SCROLL_KEY]: 0,
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

  const matchRoute = (
    pattern: string,
    current: string
  ) => {
    if (pattern === current) {
      return true;
    }

    if (pattern.includes(':')) {
      const patternParts = pattern.split('/');
      const currentParts = current.split('/');

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
