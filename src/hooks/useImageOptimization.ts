import { useState, useEffect, useCallback } from 'react';
import { supportsWebP, preloadImage } from '../utils/imageOptimization';

interface UseImageOptimizationOptions {
  preloadCritical?: boolean;
  enableWebP?: boolean;
  lazyLoadThreshold?: number;
}

interface ImageState {
  isLoaded: boolean;
  hasError: boolean;
  isInView: boolean;
  supportsWebP: boolean;
}

export const useImageOptimization = (
  src: string,
  options: UseImageOptimizationOptions = {}
) => {
  const {
    preloadCritical = false,
    enableWebP = true,
    lazyLoadThreshold = 0.1
  } = options;

  const [imageState, setImageState] = useState<ImageState>({
    isLoaded: false,
    hasError: false,
    isInView: false,
    supportsWebP: false
  });

  // Check WebP support
  useEffect(() => {
    if (enableWebP) {
      supportsWebP().then(supported => {
        setImageState(prev => ({ ...prev, supportsWebP: supported }));
      });
    }
  }, [enableWebP]);

  // Preload critical images
  useEffect(() => {
    if (preloadCritical && src) {
      preloadImage(src, true).catch(() => {
        setImageState(prev => ({ ...prev, hasError: true }));
      });
    }
  }, [src, preloadCritical]);

  // Get optimized image source
  const getOptimizedSrc = useCallback((originalSrc: string, width?: number) => {
    if (!originalSrc) return '';

    // Convert to WebP if supported
    if (imageState.supportsWebP && enableWebP) {
      // For Pexels images, add WebP format
      if (originalSrc.includes('pexels.com')) {
        const url = new URL(originalSrc);
        url.searchParams.set('fm', 'webp');
        if (width) url.searchParams.set('w', width.toString());
        return url.toString();
      }
    }

    return originalSrc;
  }, [imageState.supportsWebP, enableWebP]);

  // Handle image load
  const handleLoad = useCallback(() => {
    setImageState(prev => ({ ...prev, isLoaded: true, hasError: false }));
  }, []);

  // Handle image error
  const handleError = useCallback(() => {
    setImageState(prev => ({ ...prev, hasError: true, isLoaded: false }));
  }, []);

  // Handle intersection (for lazy loading)
  const handleIntersection = useCallback((isIntersecting: boolean) => {
    setImageState(prev => ({ ...prev, isInView: isIntersecting }));
  }, []);

  return {
    imageState,
    getOptimizedSrc,
    handleLoad,
    handleError,
    handleIntersection
  };
};

export default useImageOptimization;