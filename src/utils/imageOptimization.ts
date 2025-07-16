// Image SEO and Optimization Utilities

export interface ImageMetadata {
  src: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
  format?: 'webp' | 'jpg' | 'png' | 'avif';
  quality?: number;
  priority?: boolean;
}

// SEO-optimized file naming conventions
export const generateSEOFileName = (
  description: string,
  category: string,
  index?: number
): string => {
  const cleanDescription = description
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
  
  const cleanCategory = category
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-');
  
  const suffix = index ? `-${index}` : '';
  
  return `${cleanCategory}-${cleanDescription}${suffix}`;
};

// Image compression and format optimization
export const getOptimizedImageUrl = (
  baseUrl: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
  } = {}
): string => {
  const { width = 800, height, quality = 85, format = 'webp' } = options;
  
  // For Pexels images
  if (baseUrl.includes('pexels.com')) {
    const url = new URL(baseUrl);
    url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    url.searchParams.set('auto', 'compress');
    url.searchParams.set('cs', 'tinysrgb');
    url.searchParams.set('fit', 'crop');
    return url.toString();
  }
  
  // For other CDNs, implement similar logic
  return baseUrl;
};

// Generate responsive image srcSet
export const generateSrcSet = (
  baseUrl: string,
  breakpoints: number[] = [400, 800, 1200, 1600]
): string => {
  return breakpoints
    .map(width => `${getOptimizedImageUrl(baseUrl, { width })} ${width}w`)
    .join(', ');
};

// Image lazy loading intersection observer
export const createImageObserver = (
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      callback(entry);
    }
  }, defaultOptions);
};

// Image preloading for critical images
export const preloadImage = (src: string, priority: boolean = false): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    
    if (priority) {
      img.fetchPriority = 'high';
    }
    
    img.src = src;
  });
};

// Generate blur placeholder data URL
export const generateBlurDataURL = (
  width: number = 10,
  height: number = 10,
  color: string = '#f0f0f0'
): string => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Image sitemap generation
export interface SitemapImage {
  url: string;
  caption?: string;
  title?: string;
  license?: string;
  geoLocation?: string;
}

export const generateImageSitemap = (images: SitemapImage[]): string => {
  const imageEntries = images.map(img => `
    <image:image>
      <image:loc>${img.url}</image:loc>
      ${img.caption ? `<image:caption><![CDATA[${img.caption}]]></image:caption>` : ''}
      ${img.title ? `<image:title><![CDATA[${img.title}]]></image:title>` : ''}
      ${img.license ? `<image:license>${img.license}</image:license>` : ''}
      ${img.geoLocation ? `<image:geo_location>${img.geoLocation}</image:geo_location>` : ''}
    </image:image>
  `).join('');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://profitestrategista.com/</loc>
    ${imageEntries}
  </url>
</urlset>`;
};

// Trading-specific image metadata
export const tradingImageMetadata = {
  hero: {
    alt: "Robôs de trading automatizado operando no mercado financeiro brasileiro",
    title: "Automação de Trading - Profit Estrategista",
    category: "hero"
  },
  robots: {
    alt: "Interface do robô de trading mostrando estratégias automatizadas",
    title: "Robôs de Trading - Estratégias Automatizadas",
    category: "product"
  },
  dashboard: {
    alt: "Dashboard de controle dos robôs de trading com métricas de performance",
    title: "Painel de Controle - Robôs de Trading",
    category: "interface"
  },
  charts: {
    alt: "Gráficos de performance dos robôs de trading automatizado",
    title: "Performance dos Robôs - Resultados de Trading",
    category: "analytics"
  },
  setup: {
    alt: "Tutorial de instalação e configuração dos robôs de trading",
    title: "Como Instalar Robôs de Trading - Guia Passo a Passo",
    category: "tutorial"
  }
};

// WebP support detection
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

export default {
  generateSEOFileName,
  getOptimizedImageUrl,
  generateSrcSet,
  createImageObserver,
  preloadImage,
  generateBlurDataURL,
  generateImageSitemap,
  tradingImageMetadata,
  supportsWebP
};