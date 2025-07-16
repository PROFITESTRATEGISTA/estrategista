import React from 'react';
import { MapPin, Users, TrendingUp, Building2 } from 'lucide-react';

interface LocationContentProps {
  primaryLocation: string;
  serviceAreas: string[];
  className?: string;
}

export const LocationContent: React.FC<LocationContentProps> = ({
  primaryLocation,
  serviceAreas,
  className = ''
}) => {
  const locationSpecificContent = {
    'São Paulo': {
      description: 'Especialistas em robôs de trading automatizado em São Paulo, atendendo traders e investidores da capital paulista e região metropolitana.',
      marketInfo: 'São Paulo concentra o maior volume de traders do Brasil, com mais de 40% dos investidores pessoa física do país.',
      localBenefits: [
        'Suporte técnico local em horário comercial',
        'Conhecimento do mercado financeiro brasileiro',
        'Proximidade com principais corretoras',
        'Atendimento em português brasileiro'
      ]
    },
    'Rio de Janeiro': {
      description: 'Soluções de automação de trading para investidores do Rio de Janeiro, com foco no mercado financeiro carioca.',
      marketInfo: 'Rio de Janeiro é o segundo maior centro financeiro do Brasil, com forte presença de investidores institucionais.',
      localBenefits: [
        'Atendimento especializado para o mercado carioca',
        'Suporte técnico em horário local',
        'Conhecimento das particularidades regionais',
        'Proximidade com instituições financeiras'
      ]
    },
    'Brasil': {
      description: 'Robôs de trading automatizado para todo o Brasil, com suporte técnico nacional e conhecimento profundo do mercado brasileiro.',
      marketInfo: 'O Brasil possui mais de 5 milhões de investidores pessoa física, com crescimento acelerado no trading automatizado.',
      localBenefits: [
        'Cobertura nacional completa',
        'Suporte em português brasileiro',
        'Conhecimento da regulamentação local',
        'Integração com corretoras brasileiras'
      ]
    }
  };

  const currentLocation = locationSpecificContent[primaryLocation as keyof typeof locationSpecificContent] || locationSpecificContent['Brasil'];

  return (
    <section className={`py-12 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Location Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <MapPin className="w-6 h-6 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">
              Robôs de Trading em {primaryLocation}
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {currentLocation.description}
          </p>
        </div>

        {/* Market Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <h3 className="text-xl font-bold text-gray-900">Mercado Local</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {currentLocation.marketInfo}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-8 h-8 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">Nossos Diferenciais</h3>
            </div>
            <ul className="space-y-2">
              {currentLocation.localBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Service Areas */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <Building2 className="w-8 h-8 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-900">Áreas de Atendimento</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {serviceAreas.map((area, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                <span className="text-gray-800 font-medium">{area}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Atendimento Nacional:</strong> Oferecemos suporte técnico e consultoria para todo o Brasil, 
              com especialização no mercado financeiro brasileiro e integração com as principais corretoras nacionais.
            </p>
          </div>
        </div>

        {/* Local SEO Content */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Por que escolher robôs de trading em {primaryLocation}?
          </h3>
          <div className="max-w-4xl mx-auto text-gray-700 leading-relaxed">
            <p className="mb-4">
              Nossa empresa oferece soluções de automação de trading especificamente desenvolvidas para o mercado brasileiro, 
              com profundo conhecimento das particularidades locais e regulamentações da CVM.
            </p>
            <p>
              Atendemos traders de {primaryLocation} e região com suporte técnico especializado, 
              garantindo que seus robôs operem de forma otimizada no mercado nacional.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationContent;