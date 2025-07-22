import React from 'react';
import { ArrowLeft, Server, ExternalLink, Star, Shield, Zap, Clock, CheckCircle } from 'lucide-react';

interface VPSServicesPageProps {
  onBack: () => void;
}

const VPSServicesPage: React.FC<VPSServicesPageProps> = ({ onBack }) => {
  const vpsPlans = [
    {
      id: 'essential',
      name: 'VPS Essential',
      originalPrice: 145,
      discountPrice: 110,
      popular: false,
      features: [
        '4GB RAM DDR4',
        '2 vCPUs otimizadas',
        '80GB SSD NVMe',
        'Latência < 10ms',
        'Suporte 24/7',
        'MT4/MT5 pré-configurado',
        'Windows Server'
      ],
      link: 'https://www.musthost.com.br/sac/cart.php?a=confproduct&i=0'
    },
    {
      id: 'professional',
      name: 'VPS Professional',
      originalPrice: 245,
      discountPrice: 210,
      popular: true,
      features: [
        '8GB RAM DDR4',
        '4 vCPUs otimizadas',
        '160GB SSD NVMe',
        'Latência < 5ms',
        'Suporte prioritário',
        'MT4/MT5 + Expert Advisors',
        'Backup automático',
        'Windows Server'
      ],
      link: 'https://www.musthost.com.br/sac/cart.php?a=confproduct&i=1'
    }
  ];

  const benefits = [
    {
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      title: 'Latência Ultra-Baixa',
      description: 'Servidores no Brasil com latência menor que 10ms para execução instantânea'
    },
    {
      icon: <Shield className="w-6 h-6 text-green-500" />,
      title: 'Segurança Máxima',
      description: 'Backup automático e proteção contra falhas para seus robôs'
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-500" />,
      title: 'Operação 24/7',
      description: 'Seus robôs funcionam continuamente, mesmo com seu PC desligado'
    },
    {
      icon: <Server className="w-6 h-6 text-orange-500" />,
      title: 'Pré-Configurado',
      description: 'MT4, MT5 e Profit já instalados e otimizados para trading'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={onBack}
            className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-400" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white">Serviços VPS</h1>
            <p className="text-gray-400 text-lg">VPS especializada para Trading Profissional</p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            VPS Otimizada para Pack de Robôs
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Servidores dedicados com latência ultra-baixa para day trade, scalping e operações automatizadas. 
            Compatível com MetaTrader, Profit e todas as principais plataformas.
          </p>
          
          <div className="bg-green-900/20 rounded-xl p-6 border border-green-600/30 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Star className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-bold text-lg">Desconto Exclusivo Profit Estrategista</span>
            </div>
            <p className="text-green-300">
              Clientes da Estrategista Trading Solutions têm desconto especial em todas as VPS
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
              <div className="bg-gray-800 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
              <p className="text-gray-400 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* VPS Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {vpsPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-gray-900 rounded-xl p-8 border transition-all duration-300 hover:shadow-lg ${
                plan.popular 
                  ? 'border-orange-500 shadow-orange-500/20' 
                  : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="flex items-center justify-center mb-6">
                  <span className="bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Mais Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <div className="bg-gray-800 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Server className="w-10 h-10 text-blue-400" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                
                <div className="mb-4">
                  <div className="text-gray-500 line-through text-lg mb-1">
                    Preço normal: R$ {plan.originalPrice}
                  </div>
                  <div className="text-4xl font-bold text-white">
                    R$ {plan.discountPrice}
                    <span className="text-lg text-gray-400">/mês</span>
                  </div>
                  <div className="text-sm text-green-400 mt-1">
                    Desconto Exclusivo Estrategista Trading Solutions
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => window.open(plan.link, '_blank')}
                className={`w-full py-4 px-6 rounded-lg font-bold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
                  plan.popular
                    ? 'bg-orange-600 hover:bg-orange-700 hover:shadow-lg transform hover:scale-105'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <ExternalLink className="w-5 h-5" />
                <span>Contratar na Loja</span>
              </button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-blue-900/20 rounded-xl p-8 border border-blue-600/30">
          <div className="flex items-center space-x-3 mb-6">
            <Server className="w-8 h-8 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">Por que usar VPS para Trading?</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
            <div className="space-y-3">
              <p>• <strong>Latência otimizada:</strong> Servidores no Brasil para menor latência</p>
              <p>• <strong>Operação contínua:</strong> Robôs funcionam 24/7 sem interrupção</p>
              <p>• <strong>Configuração incluída:</strong> Profit pré-instalado e configurado</p>
            </div>
            <div className="space-y-3">
              <p>• <strong>Backup automático:</strong> Seus robôs e configurações sempre seguros</p>
              <p>• <strong>Suporte especializado:</strong> Equipe técnica com experiência em trading</p>
              <p>• <strong>Monitoramento 24/7:</strong> Uptime garantido para suas operações</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VPSServicesPage;