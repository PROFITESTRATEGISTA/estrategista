import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  srcSet?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: string;
  blurDataURL?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  title,
  className = '',
  width,
  height,
  priority = false,
  sizes = '100vw',
  srcSet,
  loading = 'lazy',
  onLoad,
  onError,
  placeholder,
  blurDataURL
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate responsive srcSet if not provided
  const generateSrcSet = (baseSrc: string) => {
    if (srcSet) return srcSet;
    
    const baseUrl = baseSrc.split('?')[0];
    const params = new URLSearchParams(baseSrc.split('?')[1] || '');
    
    // For Pexels images, generate different sizes
    if (baseSrc.includes('pexels.com')) {
      return [
        `${baseUrl}?${params}&w=400 400w`,
        `${baseUrl}?${params}&w=800 800w`,
        `${baseUrl}?${params}&w=1200 1200w`,
        `${baseUrl}?${params}&w=1600 1600w`
      ].join(', ');
    }
    
    return undefined;
  };

  // SEO-optimized file naming
  const getOptimizedSrc = (originalSrc: string) => {
    if (!isInView && !priority) {
      return placeholder || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+';
    }
    return originalSrc;
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder */}
      {blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
          aria-hidden="true"
        />
      )}
      
      {/* Main image */}
      <img
        ref={imgRef}
        src={getOptimizedSrc(src)}
        alt={alt}
        title={title}
        width={width}
        height={height}
        sizes={sizes}
        srcSet={generateSrcSet(src)}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        // SEO attributes
        itemProp="image"
        data-testid="optimized-image"
      />
      
      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <span className="text-gray-500 text-sm">Imagem não disponível</span>
        </div>
      )}
      
      {/* Loading indicator */}
      {!isLoaded && !hasError && isInView && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;