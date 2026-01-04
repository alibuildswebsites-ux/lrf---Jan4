/**
 * Optimizes Image URLs for performance.
 * - Unsplash: Resizes and converts to WebP.
 * - Cloudinary: Injects transformations (f_auto, q_auto, width) into the URL.
 */
export const getOptimizedImageUrl = (url: string, width: number = 800, quality: number = 80): string => {
  if (!url) return '';

  // Handle Unsplash
  if (url.includes('unsplash.com')) {
    // Strip existing params to ensure a clean slate
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?auto=format&fit=crop&q=${quality}&w=${width}&fm=webp`;
  }

  // Handle Cloudinary
  if (url.includes('cloudinary.com')) {
    // Check if it already has transformations (avoid double transformation injection)
    if (url.includes('/upload/f_auto')) return url;

    // Split URL at '/upload/' to inject params
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/f_auto,q_auto,w_${width},c_limit/${parts[1]}`;
    }
  }

  return url;
};

interface SEOMetadata {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
}

/**
 * Updates document title and meta tags dynamically for SEO.
 */
export const updateSEO = ({ title, description, image, url, type = 'website' }: SEOMetadata) => {
  // Update Title
  document.title = title;

  // Helper to update or create meta tags
  const updateMeta = (name: string, content: string, isProperty: boolean = false) => {
    let element = document.querySelector(isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(isProperty ? 'property' : 'name', name);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // Standard Meta
  updateMeta('description', description);

  // Open Graph / Facebook
  updateMeta('og:title', title, true);
  updateMeta('og:description', description, true);
  updateMeta('og:type', type, true);
  if (image) updateMeta('og:image', image, true);
  if (url) updateMeta('og:url', url, true);

  // Twitter
  updateMeta('twitter:card', 'summary_large_image');
  updateMeta('twitter:title', title);
  updateMeta('twitter:description', description);
  if (image) updateMeta('twitter:image', image);
  
  // Canonical Link
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  if (url) link.setAttribute('href', url);
};

/**
 * Injects JSON-LD Structured Data into the head.
 */
export const injectJSONLD = (schema: object) => {
  let script = document.querySelector('script[type="application/ld+json"][data-dynamic="true"]');
  
  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-dynamic', 'true');
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(schema);
};