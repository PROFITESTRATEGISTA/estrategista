import React, { useState, useEffect } from 'react';
import OptimizedImage from './OptimizedImage';
import { generateSrcSet, tradingImageMetadata } from '../utils/imageOptimization';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: string;
  width?: number;
  height?: number;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  className?: string;
  columns?: number;
  showTitles?: boolean;
  lazyLoad?: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  className = '',
  columns = 3,
  showTitles = true,
  lazyLoad = true
}) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (imageId: string) => {
    setLoadedImages(prev => new Set([...prev, imageId]));
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`image-gallery ${className}`}>
      {/* Gallery Grid */}
      <div className={`grid gap-4 ${gridCols[columns as keyof typeof gridCols]}`}>
        {images.map((image, index) => (
          <div
            key={image.id}
            className="group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => setSelectedImage(image)}
          >
            <div className="aspect-w-16 aspect-h-9 relative">
              <OptimizedImage
                src={image.src}
                alt={image.alt}
                title={image.title}
                width={image.width || 800}
                height={image.height || 450}
                priority={index < 3} // First 3 images are priority
                loading={lazyLoad && index >= 3 ? 'lazy' : 'eager'}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="group-hover:scale-105 transition-transform duration-300"
                onLoad={() => handleImageLoad(image.id)}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Image Title */}
            {showTitles && (
              <div className="p-4 bg-white">
                <h3 className="font-semibold text-gray-900 text-sm">{image.title}</h3>
                <p className="text-gray-600 text-xs mt-1">{image.category}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <OptimizedImage
              src={selectedImage.src}
              alt={selectedImage.alt}
              title={selectedImage.title}
              className="max-w-full max-h-full object-contain"
              priority={true}
              sizes="90vw"
            />
            
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h3 className="text-lg font-semibold">{selectedImage.title}</h3>
              <p className="text-sm opacity-80">{selectedImage.alt}</p>
            </div>
          </div>
        </div>
      )}

      {/* Structured Data for Images */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "Galeria de Robôs de Trading",
            "description": "Imagens dos robôs de trading automatizado e interfaces do sistema",
            "image": images.map(img => ({
              "@type": "ImageObject",
              "url": img.src,
              "name": img.title,
              "description": img.alt,
              "width": img.width || 800,
              "height": img.height || 450
            }))
          })
        }}
      />
    </div>
  );
};

export default ImageGallery;