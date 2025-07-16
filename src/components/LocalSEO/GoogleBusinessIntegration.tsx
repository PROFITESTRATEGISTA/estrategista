import React from 'react';
import { Star, MapPin, Clock, Phone, ExternalLink } from 'lucide-react';

interface GoogleBusinessIntegrationProps {
  businessName: string;
  googleBusinessUrl?: string;
  averageRating?: number;
  totalReviews?: number;
  className?: string;
}

export const GoogleBusinessIntegration: React.FC<GoogleBusinessIntegrationProps> = ({
  businessName,
  googleBusinessUrl,
  averageRating = 4.8,
  totalReviews = 127,
  className = ''
}) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className={`bg-white rounded-xl p-6 shadow-lg border border-gray-200 ${className}`}>
      {/* Google Business Profile Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Google Business Profile</h3>
            <p className="text-gray-600 text-sm">Encontre-nos no Google</p>
          </div>
        </div>
        
        {googleBusinessUrl && (
          <a
            href={googleBusinessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span className="text-sm font-medium">Ver Perfil</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Business Info */}
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">{businessName}</h4>
          <p className="text-gray-600 text-sm">
            Especialistas em Robôs de Trading Automatizado
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {renderStars(averageRating)}
          </div>
          <span className="font-semibold text-gray-900">{averageRating}</span>
          <span className="text-gray-600 text-sm">({totalReviews} avaliações)</span>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
            className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm font-medium">Ligar</span>
          </button>
          
          <button
            onClick={() => window.open('https://maps.google.com', '_blank')}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Localizar</span>
          </button>
        </div>

        {/* Business Hours */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Horário de Atendimento</span>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Segunda - Sexta:</span>
              <span>09:00 - 18:00</span>
            </div>
            <div className="flex justify-between">
              <span>Sábado:</span>
              <span>09:00 - 12:00</span>
            </div>
            <div className="flex justify-between">
              <span>Domingo:</span>
              <span>Fechado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-800 text-sm text-center">
          <strong>Deixe sua avaliação!</strong> Sua opinião nos ajuda a melhorar nossos serviços.
        </p>
      </div>
    </div>
  );
};

export default GoogleBusinessIntegration;