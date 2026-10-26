import { useEffect } from 'react';

type SEOProps = {
  title: string;
  description: string;
  canonicalPath?: string;
  image?: string;
  noindex?: boolean;
  type?: 'website' | 'product';
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
};

const SITE_NAME = 'LCP.works';
const DEFAULT_IMAGE = '/LCP_logo_black.webp';

function absoluteUrl(value: string) {
  if (/^https?:\/\//i.test(value)) return value;
  if (typeof window === 'undefined') return value;
  return new URL(value, window.location.origin).href;
}

export default function SEO({
  title,
  description,
  canonicalPath,
  image = DEFAULT_IMAGE,
  noindex = false,
  type = 'website',
  structuredData,
}: SEOProps) {
  useEffect(() => {
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://lcpworks.com';

    const canonical = new URL(
      canonicalPath || window.location.pathname,
      origin
    );

    canonical.search = '';
    canonical.hash = '';

    const imageUrl = absoluteUrl(image);

    document.title = title;

    const setMeta = (
      selector: string,
      attribute: 'name' | 'property',
      key: string,
      content: string
    ) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta(
      'meta[name="robots"]',
      'name',
      'robots',
      noindex ? 'noindex, nofollow' : 'index, follow'
    );

    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta(
      'meta[property="og:description"]',
      'property',
      'og:description',
      description
    );
    setMeta('meta[property="og:type"]', 'property', 'og:type', type);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonical.href);
    setMeta('meta[property="og:image"]', 'property', 'og:image', imageUrl);

    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta(
      'meta[name="twitter:description"]',
      'name',
      'twitter:description',
      description
    );
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl);

    let canonicalLink =
      document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }

    canonicalLink.href = canonical.href;

    const oldSchema = document.head.querySelector(
      'script[data-lcp-seo-schema="true"]'
    );
    oldSchema?.remove();

    if (structuredData) {
      const schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.dataset.lcpSeoSchema = 'true';
      schemaScript.textContent = JSON.stringify(structuredData);
      document.head.appendChild(schemaScript);
    }

    return () => {
      document.head
        .querySelector('script[data-lcp-seo-schema="true"]')
        ?.remove();
    };
  }, [
    title,
    description,
    canonicalPath,
    image,
    noindex,
    type,
    structuredData,
  ]);

  return null;
}

export { SITE_NAME };
