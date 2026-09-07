import { useEffect } from 'react';

const SEOHead = ({ title, description, keywords, ogImage }) => {
  useEffect(() => {
    // 1. Set page title for top browser tab
    const fullTitle = title
      ? `${title} | Sri Sai Ram Consultancy`
      : 'Sri Sai Ram Consultancy | Premium Captain, Driver & Helper Staffing';
    document.title = fullTitle;

    // Helper to update meta tag content or create it if missing
    const setMetaTag = (selector, nameAttr, nameVal, content) => {
      if (!content) return;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(nameAttr, nameVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Meta description & keywords
    const defaultDesc = description || "Sri Sai Ram Consultancy (SSRC) - Call +91 9505151527. Verified Captain, Driver & Helper placement in LB Nagar, Hyderabad.";
    const defaultKeywords = keywords || "Sri Sai Ram Consultancy, 9505151527, Driver hiring Hyderabad, Helper staffing LB Nagar, Captain chauffeurs";

    setMetaTag('meta[name="description"]', 'name', 'description', defaultDesc);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', defaultKeywords);

    // 3. Absolute URL resolution for social share image
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://srisairamconsultancy.com';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://srisairamconsultancy.com';
    
    let resolvedImage = ogImage || '/og-image.png';
    if (!resolvedImage.startsWith('http')) {
      resolvedImage = `${origin}${resolvedImage.startsWith('/') ? '' : '/'}${resolvedImage}`;
    }

    // 4. Social OpenGraph Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', defaultDesc);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', resolvedImage);
    setMetaTag('meta[property="og:image:secure_url"]', 'property', 'og:image:secure_url', resolvedImage);
    setMetaTag('meta[property="og:image:type"]', 'property', 'og:image:type', 'image/png');
    setMetaTag('meta[property="og:image:width"]', 'property', 'og:image:width', '600');
    setMetaTag('meta[property="og:image:height"]', 'property', 'og:image:height', '600');
    setMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', 'Sri Sai Ram Consultancy SSR Logo');
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', currentUrl);

    // 5. Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', defaultDesc);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', resolvedImage);
    setMetaTag('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', 'Sri Sai Ram Consultancy SSR Logo');

    // 6. Ensure browser tab favicon icons are set to SSR emblem favicon
    const updateIconLink = (rel, type, href) => {
      let link = document.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        if (type) link.type = type;
        document.head.appendChild(link);
      }
      link.href = `${href}?v=7`;
    };

    updateIconLink('icon', 'image/x-icon', '/favicon.ico');
    updateIconLink('shortcut icon', 'image/x-icon', '/favicon.ico');
    updateIconLink('apple-touch-icon', 'image/png', '/apple-touch-icon.png');

    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [title, description, keywords, ogImage]);

  return null;
};

export default SEOHead;
