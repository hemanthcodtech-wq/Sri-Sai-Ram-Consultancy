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

    // 3. Social OpenGraph Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', defaultDesc);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage || '/logo.png');

    // 4. Twitter Card Tags
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', defaultDesc);

    // 5. Ensure favicon is set in top tab
    let faviconLink = document.querySelector('link[rel="icon"]');
    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.rel = 'icon';
      faviconLink.type = 'image/svg+xml';
      faviconLink.href = '/favicon.svg';
      document.head.appendChild(faviconLink);
    } else {
      faviconLink.href = '/favicon.svg';
    }

    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [title, description, keywords, ogImage]);

  return null;
};

export default SEOHead;
