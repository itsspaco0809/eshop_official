import React, { createContext, useContext, useLayoutEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getSurfaceColors = (theme: Theme) => {
  const isDark = theme === 'dark';
  const pageBackground = isDark ? '#121212' : '#ffffff';
  const overlayBackground = isDark ? '#0a0a0a' : '#ffffff';
  const html = typeof document !== 'undefined' ? document.documentElement : null;

  const isProductDetail = html?.classList.contains('product-detail-open') ??
    (typeof window !== 'undefined' && window.location.pathname.startsWith('/product/'));
  const isMobileMenuOpen = html?.classList.contains('mobile-menu-open') ?? false;
  const isCartOpen = html?.classList.contains('cart-open') ?? false;

  // Visible fixed surfaces take priority over the normal page canvas.
  const activeSurface =
    isMobileMenuOpen || isCartOpen || isProductDetail
      ? overlayBackground
      : pageBackground;

  return {
    pageBackground,
    overlayBackground,
    activeSurface,
  };
};

const syncThemeDocument = (theme: Theme) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const { pageBackground, overlayBackground, activeSurface } =
    getSurfaceColors(theme);
  const isDark = theme === 'dark';

  root.classList.toggle('dark', isDark);
  root.style.colorScheme = isDark ? 'dark' : 'light';

  // These variables are the single source of truth for all viewport/safe-area
  // surfaces. ProductDetail, Hamburger and CartDrawer all use #0a0a0a in dark mode.
  root.style.backgroundColor = activeSurface;
  root.style.setProperty('--app-background', pageBackground);
  root.style.setProperty('--safe-area-background', activeSurface);
  root.style.setProperty('--mobile-menu-background', overlayBackground);
  root.style.setProperty('--cart-background', overlayBackground);
  root.style.setProperty('--browser-chrome-background', activeSurface);
  root.style.setProperty('--ios-edge-background', activeSurface);
  root.style.setProperty('--footer-background', pageBackground);

  document.body?.style.setProperty('--app-background', pageBackground);
  document.body?.style.setProperty('--safe-area-background', activeSurface);
  document.body?.style.setProperty('--mobile-menu-background', overlayBackground);
  document.body?.style.setProperty('--cart-background', overlayBackground);
  document.body?.style.setProperty('--browser-chrome-background', activeSurface);
  document.body?.style.setProperty('--ios-edge-background', activeSurface);
  document.body?.style.setProperty('--footer-background', pageBackground);

  // Keep one stable theme-color element. Older iOS Safari versions use
  // this value for browser chrome/overscroll. Removing and recreating the
  // tag can leave Safari displaying the previous color until the next
  // navigation or compositing pass.
  let meta = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]'
  );

  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.id = 'lcp-theme-color';
    document.head.appendChild(meta);
  }

  meta.setAttribute('content', activeSurface);

  // iOS Safari/WebKit repaint nudge from the old working version.
  // A tiny fixed node forces the browser-edge/safe-area compositor to
  // sample the newly applied html background on the same frame.
  const dummyNode = document.createElement('div');
  dummyNode.style.cssText =
    'position:fixed;top:0;left:0;width:1px;height:1px;pointer-events:none;z-index:99999;';
  document.body?.appendChild(dummyNode);

  requestAnimationFrame(() => {
    dummyNode.remove();
  });

  try {
    sessionStorage.setItem('theme', theme);
  } catch {
    // Ignore storage restrictions.
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = sessionStorage.getItem('theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useLayoutEffect(() => {
    syncThemeDocument(theme);
  }, [theme]);

  useLayoutEffect(() => {
    const handleSurfaceChange = () => syncThemeDocument(theme);
    window.addEventListener('lcp-surface-change', handleSurfaceChange);
    return () => window.removeEventListener('lcp-surface-change', handleSurfaceChange);
  }, [theme]);

  const setTheme = (nextTheme: Theme) => {
    // Apply before React re-renders. This is important when Safari is displaying
    // a fixed safe-area while Hamburger/Cart/ProductDetail is already visible.
    syncThemeDocument(nextTheme);
    setThemeState(nextTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
