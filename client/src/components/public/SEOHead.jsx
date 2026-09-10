import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_DOMAIN = 'https://srisairamconsultancy.com';

const SEOHead = ({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  noindex = false,
  schema = null,
}) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Format and set page title
    const formattedTitle = title
      ? (title.includes('Sri Sai Ram Consultancy') ? title : `${title} | Sri Sai Ram Consultancy`)
      : 'Sri Sai Ram Consultancy | Premium Captain, Driver & Helper Staffing Services';
    document.title = formattedTitle;

    // Helper to update meta tag content or create it if missing
    const setMetaTag = (selector, nameAttr, nameVal, content) => {
      if (content === undefined || content === null) return;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(nameAttr, nameVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper to update link tag
    const setLinkTag = (rel, href) => {
      if (!href) return;
      let link = document.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    // 2. Canonical URL resolution
    const canonicalUrl = canonical
      ? (canonical.startsWith('http') ? canonical : `${BASE_DOMAIN}${canonical.startsWith('/') ? '' : '/'}${canonical}`)
      : `${BASE_DOMAIN}${location.pathname === '/' ? '/' : location.pathname.replace(/\/$/, '')}`;
    
    setLinkTag('canonical', canonicalUrl);

    // 3. Robots meta tag
    if (noindex) {
      setMetaTag('meta[name="robots"]', 'name', 'robots', 'noindex, nofollow');
    } else {
      setMetaTag('meta[name="robots"]', 'name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }

    // 4. Meta description & keywords
    const defaultDesc =
      description ||
      'Sri Sai Ram Consultancy (SSRC) - Call +91 9505151527. 100% Background-verified Captain, Driver, and Helper staffing services in Hyderabad LB Nagar.';
    const defaultKeywords =
      keywords ||
      'Sri Sai Ram Consultancy, 9505151527, Driver hiring Hyderabad, Helper staffing LB Nagar, Captain chauffeurs Hyderabad, corporate driver staffing';

    setMetaTag('meta[name="description"]', 'name', 'description', defaultDesc);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', defaultKeywords);

    // 5. OpenGraph Image Resolution
    let resolvedImage = ogImage || `${BASE_DOMAIN}/og-image.png`;
    if (!resolvedImage.startsWith('http')) {
      resolvedImage = `${BASE_DOMAIN}${resolvedImage.startsWith('/') ? '' : '/'}${resolvedImage}`;
    }

    // 6. OpenGraph Meta Tags
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Sri Sai Ram Consultancy');
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', formattedTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', defaultDesc);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', resolvedImage);
    setMetaTag('meta[property="og:image:secure_url"]', 'property', 'og:image:secure_url', resolvedImage);
    setMetaTag('meta[property="og:image:type"]', 'property', 'og:image:type', 'image/png');
    setMetaTag('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
    setMetaTag('meta[property="og:image:height"]', 'property', 'og:image:height', '630');
    setMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', 'Sri Sai Ram Consultancy');
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 'en_IN');

    // 7. Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', formattedTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', defaultDesc);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', resolvedImage);
    setMetaTag('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', 'Sri Sai Ram Consultancy');

    // 8. Dynamic Page-Level Structured Data (JSON-LD)
    const scriptId = 'page-schema-jsonld';
    let scriptEl = document.getElementById(scriptId);
    if (schema) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = scriptId;
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(schema);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    // 9. Ensure Favicon Links
    setLinkTag('icon', '/favicon.ico?v=7');
    setLinkTag('shortcut icon', '/favicon.ico?v=7');
    setLinkTag('apple-touch-icon', '/apple-touch-icon.png?v=7');

    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [title, description, keywords, canonical, ogImage, ogType, noindex, schema, location.pathname]);

  return null;
};

export default SEOHead;
