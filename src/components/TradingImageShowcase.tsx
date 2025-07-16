import React from 'react';
import OptimizedImage from './OptimizedImage';
import { tradingImageMetadata, generateSEOFileName } from '../utils/imageOptimization';

export const TradingImageShowcase: React.FC = () => {
  // Trading-specific images with SEO optimization
  const tradingImages = [
    {
      id: 'hero-trading-robots',
      src: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg',
      ...tradingImageMetadata.hero,
      width: 1200,
      height: 675,
      priority: true
    },
    {
      id: 'trading-dashboard',
      src: 'https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg',
      ...tradingImageMetadata.dashboard,
      width: 800,
      height: 450
    },
    {
      id: 'financial-charts',
      src: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg',
      ...tradingImageMetadata.charts,
      width: 800,
      height: 450
    },
    {
      id: 'trading-setup',
      src: 'https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg',
      ...tradingImageMetadata.setup,
      width: 800,
      height: 450
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Robôs de Trading em Ação
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Veja como nossos robôs automatizam suas operações de trading com precisão e eficiência
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-12">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <OptimizedImage
              src={tradingImages[0].src}
              alt={tradingImages[0].alt}
              title={tradingImages[0].title}
              width={tradingImages[0].width}
              height={tradingImages[0].height}
              priority={tradingImages[0].priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              className="w-full h-auto"
            />
            
            {/* Overlay Content */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Automação Profissional</h3>
                <p className="text-lg opacity-90">
                  Robôs que operam 24/7 com estratégias validadas por especialistas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tradingImages.slice(1).map((image, index) => (
            <div key={image.id} className="group">
              <div className="relative rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <OptimizedImage
                  src={image.src}
                  alt={image.alt}
                  title={image.title}
                  width={image.width}
                  height={image.height}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h4 className="font-semibold text-sm">{image.title}</h4>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Image SEO Benefits */}
        <div className="mt-12 bg-white rounded-xl p-8 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Benefícios da Otimização de Imagens
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">85%</div>
              <div className="text-sm text-gray-600">Redução no tamanho</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">3x</div>
              <div className="text-sm text-gray-600">Velocidade de carregamento</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-sm text-gray-600">Responsividade</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">SEO+</div>
              <div className="text-sm text-gray-600">Otimização para buscadores</div>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Data for Image Showcase */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "Showcase de Pack de Robôs da Profit Estrategista",
            "description": "Galeria de imagens mostrando Pack de Robôs da Profit Estrategista para trading automatizado em operação",
            "publisher": {
              "@type": "Organization",
              "name": "Estrategista Trading Solutions",
              "url": "https://estrategistatradingsolutions.com.br"
            },
            "image": tradingImages.map(img => ({
              "@type": "ImageObject",
              "url": img.src,
              "name": img.title,
              "description": img.alt,
              "width": img.width,
              "height": img.height,
              "encodingFormat": "image/jpeg",
              "contentUrl": img.src,
              "acquireLicensePage": "https://pexels.com/license/"
            }))
          })
        }}
      />
    </section>
  );
};

export default TradingImageShowcase;