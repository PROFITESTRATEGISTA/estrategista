import React, { useState, useEffect } from 'react';
import { Bot, Download, ArrowLeft, ExternalLink, Shield, Zap, TrendingUp, Clock, Target, Lock, Monitor, Smartphone } from 'lucide-react';

interface Robot {
  id: string;
  name: string;
  description: string;
  category: string;
  plans: string[];
  downloadUrl?: string;
  status: 'active' | 'coming_soon' | 'locked';
  performance?: string;
  timeframe?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  features: string[];
}

interface RobotMarketplaceProps {
  userPlan: string;
  onBack: () => void;
}

// Robôs específicos por plano
const robotsByPlan = {
  free: [
    {
      id: 'scalper-1',
      name: 'Scalper 1',
      description: 'Robô scalper gratuito com estratégia validada para iniciantes',
      category: 'scalper',
      plans: ['free', 'pro', 'master'],
      status: 'active' as const,
      performance: '+15.2%',
      timeframe: '1M-3M',
      riskLevel: 'medium' as const,
      features: ['Gratuito', 'Estratégia validada', 'Fácil configuração']
    },
    {
      id: 'scalper-2',
      name: 'Scalper 2',
      description: 'Robô scalper gratuito otimizado para operações de curto prazo',
      category: 'scalper',
      plans: ['free', 'pro', 'master'],
      status: 'active' as const,
      performance: '+12.8%',
      timeframe: '1M-5M',
      riskLevel: 'medium' as const,
      features: ['Gratuito', 'Curto prazo', 'Baixo risco']
    },
    {
      id: 'scalper-3',
      name: 'Scalper 3',
      description: 'Robô scalper gratuito avançado para traders experientes',
      category: 'scalper',
      plans: ['free', 'pro', 'master'],
      status: 'active' as const,
      performance: '+18.5%',
      timeframe: '1M-5M',
      riskLevel: 'medium' as const,
      features: ['Gratuito', 'Avançado', 'Alta performance']
    }
  ],
  pro: [
    {
      id: 'scalper-1',
      name: 'Scalper 1',
      description: 'Robô scalper com parâmetros totalmente personalizáveis para sua estratégia',
      category: 'scalper',
      plans: ['master', 'pro'],
      status: 'active' as const,
      performance: '+25.1%',
      timeframe: '1M-3M',
      riskLevel: 'high' as const,
      features: ['Personalizável', 'Execução perfeita', 'Setup flexível']
    },
    {
      id: 'scalper-2',
      name: 'Scalper 2',
      description: 'Robô scalper otimizado com configurações adaptáveis ao seu perfil de risco',
      category: 'scalper',
      plans: ['master', 'pro'],
      status: 'active' as const,
      performance: '+16.9%',
      timeframe: '1M-5M',
      riskLevel: 'medium' as const,
      features: ['Configurável', 'Precisão alta', 'Controle total']
    },
    {
      id: 'scalper-3',
      name: 'Scalper 3',
      description: 'Robô scalper avançado com parâmetros ajustáveis para máxima performance',
      category: 'scalper',
      plans: ['master', 'pro'],
      status: 'active' as const,
      performance: '+20.8%',
      timeframe: '1M-5M',
      riskLevel: 'medium' as const,
      features: ['Adaptável', 'Performance máxima', 'Customizável']
    }
  ],
  master: [
    {
      id: 'scalper-1',
      name: 'Scalper 1',
      description: 'Robô scalper com parâmetros totalmente personalizáveis',
      category: 'scalper',
      plans: ['master'],
      status: 'active' as const,
      performance: '+25.1%',
      timeframe: '1M-3M',
      riskLevel: 'high' as const,
      features: ['Personalizável', 'Execução perfeita', 'Setup flexível']
    },
    {
      id: 'scalper-2',
      name: 'Scalper 2',
      description: 'Robô scalper otimizado com configurações adaptáveis',
      category: 'scalper',
      plans: ['master'],
      status: 'active' as const,
      performance: '+16.9%',
      timeframe: '1M-5M',
      riskLevel: 'medium' as const,
      features: ['Configurável', 'Precisão alta', 'Controle total']
    },
    {
      id: 'scalper-3',
      name: 'Scalper 3',
      description: 'Robô scalper avançado com parâmetros ajustáveis',
      category: 'global',
      plans: ['master'],
      status: 'active' as const,
      performance: '+20.8%',
      timeframe: '5M-1H',
      riskLevel: 'medium' as const,
      features: ['Adaptável', 'Performance máxima', 'Customizável']
    },
  ]
};

// Links de download por plano
const getDownloadUrlByPlan = (plan: string, robotId: string) => {
  // Links específicos para pack free
  if (plan === 'free') {
    switch (robotId) {
      case 'scalper-1':
        return 'https://nelogica.com.br/estrategias?id=19045';
      case 'scalper-2':
        return 'https://nelogica.com.br/estrategias?id=19046';
      case 'scalper-3':
        return 'https://nelogica.com.br/estrategias?id=19047';
      default:
        return 'https://www.nelogica.com.br/profit/';
    }
  }
  
  if (robotId === 'warren-combo') {
    return 'https://www.nelogica.com.br/profit/';
  }
  
  switch (plan) {
    case 'pro':
      return 'https://mega.nz/folder/85I0XSCL#FcNazLcyauA7SRywQkfZJg';
    case 'master':
      return 'https://mega.nz/folder/ppB1mYTb#Zidz17UQGcSiE-Yktj_nUQ';
    default:
      return '';
  }
};

export function RobotMarketplace({ userPlan, onBack }: RobotMarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);



  // Selecionar robôs baseado no plano do usuário
  const robots = robotsByPlan[userPlan as keyof typeof robotsByPlan] || robotsByPlan.free;
  
  // Mobile restriction screen
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <div className="bg-blue-900/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Monitor className="w-12 h-12 text-blue-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              Desktop Necessário
            </h2>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              O download de robôs está disponível apenas na versão desktop. 
              Use um computador para acessar seus robôs.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={onBack}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Voltar ao Dashboard
              </button>
              
              <p className="text-sm text-gray-400">
                Em mobile, você pode acessar tutoriais e suporte
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isRobotAvailable = (robot: Robot) => {
    return robot.plans.includes(userPlan);
  };

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const handleDownload = (robot: Robot) => {
    const downloadUrl = getDownloadUrlByPlan(userPlan, robot.id);
    
    if (robot.id === 'warren-combo') {
      // Para Warren Combo ou plano free, abrir link externo
      window.open(downloadUrl, '_blank');
      return;
    }
    
    if (userPlan === 'free') {
      // Para plano free, abrir links específicos da Nelogica
      window.open(downloadUrl, '_blank');
      return;
    }

    if (!isRobotAvailable(robot)) {
      alert(`Este robô está disponível apenas nos planos: ${robot.plans.join(', ').toUpperCase()}`);
      return;
    }

    if (downloadUrl) {
      // Abrir pasta do Mega.nz
      window.open(downloadUrl, '_blank');
      alert(`Redirecionando para pasta de download do plano ${userPlan.toUpperCase()}!`);
    }
  };

  return (
    <div className="space-y-8 min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-400" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-white">Meus Robôs</h1>
              <p className="text-gray-400 text-lg">
                Plano {userPlan.toUpperCase()}: <span className="font-medium text-blue-400">{robots.length} robôs da Estrategista Trading Solutions</span>
              </p>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{robots.length}</div>
              <div className="text-sm text-gray-400">Robôs {userPlan.toUpperCase()}</div>
            </div>
          </div>
        </div>

        {/* Plan Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {userPlan === 'pro' ? '👑 3 ROBÔS PRO + PROFIT ULTRA' : userPlan === 'master' ? '⚡ 3 ROBÔS MASTER + PROFIT ULTRA' : '🆓 ROBÔS STARTER + WARREN'}
          </h2>
          <p className="text-gray-400">
            {userPlan === 'pro' 
              ? 'Acesso completo: 3 robôs scalper + Profit Ultra + Módulo Warren'
              : userPlan === 'master'
              ? 'Seleção premium: 3 robôs + Profit Ultra + Módulo Warren premium'
              : 'Versão gratuita: 3 robôs + Módulo de Automação Warren grátis'
            }
          </p>
        </div>

        {/* Robot Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {robots.map((robot) => {
            const available = isRobotAvailable(robot);
            
            return (
              <div
                key={robot.id}
                className={`bg-gray-900 rounded-2xl p-8 border transition-all duration-300 ${
                  available 
                    ? 'border-gray-800 hover:border-blue-600 hover:shadow-xl hover:shadow-blue-600/20' 
                    : 'border-gray-800 opacity-60'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${available ? 'bg-blue-600/20' : 'bg-gray-700/50'}`}>
                      <Bot className={`w-8 h-8 ${available ? 'text-blue-400' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{robot.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400 capitalize">{robot.category}</span>
                        {!available && <Lock className="w-4 h-4 text-gray-500" />}
                      </div>
                    </div>
                  </div>
                  
                  {robot.performance && (
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-400">{robot.performance}</div>
                      <div className="text-xs text-gray-400">Performance</div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {robot.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-800 rounded-xl">
                    <Clock className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                    <div className="text-sm font-medium text-white">{robot.timeframe}</div>
                    <div className="text-xs text-gray-400">Timeframe</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-800 rounded-xl">
                    <Shield className={`w-5 h-5 mx-auto mb-2 ${getRiskColor(robot.riskLevel)}`} />
                    <div className={`text-sm font-medium capitalize ${getRiskColor(robot.riskLevel)}`}>
                      {robot.riskLevel}
                    </div>
                    <div className="text-xs text-gray-400">Risco</div>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-400 mb-3">Características:</div>
                  <div className="flex flex-wrap gap-2">
                    {robot.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs px-3 py-1 bg-gray-800 text-gray-300 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleDownload(robot)}
                  disabled={!available && robot.id !== 'warren-combo'}
                  className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    available || robot.id === 'warren-combo'
                      ? robot.id === 'warren-combo'
                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {robot.id === 'warren-combo' ? (
                    <>
                      <ExternalLink className="w-5 h-5" />
                      <span>Acessar Links</span>
                    </>
                  ) : available ? (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Baixar Robô (.pts)</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Upgrade Necessário</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
          
          {/* Warren Module Card */}
          <div className="bg-gray-900 rounded-2xl p-8 border border-green-600 hover:border-green-500 hover:shadow-xl hover:shadow-green-600/20 transition-all duration-300">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-green-600/20">
                  <Bot className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Módulo Warren</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Automação</span>
                    <span className="text-xs px-2 py-1 bg-green-600 text-white rounded-full font-bold">GRÁTIS</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-green-400">Grátis</div>
                <div className="text-xs text-gray-400">Incluso</div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 mb-6 leading-relaxed">
              Módulo de automação de estratégias Warren com Profit Ultra gratuito para todos os planos
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-800 rounded-xl">
                <Clock className="w-5 h-5 text-green-400 mx-auto mb-2" />
                <div className="text-sm font-medium text-white">Profit Ultra</div>
                <div className="text-xs text-gray-400">Plataforma</div>
              </div>
              
              <div className="text-center p-4 bg-gray-800 rounded-xl">
                <Shield className="w-5 h-5 text-green-400 mx-auto mb-2" />
                <div className="text-sm font-medium text-green-400">Grátis</div>
                <div className="text-xs text-gray-400">Custo</div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-400 mb-3">Características:</div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 bg-gray-800 text-gray-300 rounded-full">
                  Profit Ultra incluso
                </span>
                <span className="text-xs px-3 py-1 bg-gray-800 text-gray-300 rounded-full">
                  Automação Warren
                </span>
                <span className="text-xs px-3 py-1 bg-gray-800 text-gray-300 rounded-full">
                  Setup gratuito
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => window.open('https://warren.com.br/onboarding/elliot/desktop/login?signup=true&advisor=atendimento@elliot.com.br&isAffiliate=true&utm_source=Elliot&utm_medium=YuriDelgado&utm_campaign=PedroPardal&brand=parceiro', '_blank')}
              className="w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-semibold transition-all duration-300 bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Acessar Módulo Warren</span>
            </button>
          </div>
        </div>

        {/* Plan Upgrade CTA */}
        {userPlan === 'free' && (
          <div className="mt-12 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">🚀 Upgrade para mais robôs!</h3>
            <p className="text-emerald-100 mb-6 text-lg">
              Upgrade para PRO ou MASTER e tenha acesso a robôs premium com recursos avançados como trailing stop, breakeven e filtros
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/planos'}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
              >
                💎 Ver Planos PRO
              </button>
              <button 
                onClick={() => window.open('https://wa.me/5511975333355?text=Olá! Gostaria de fazer upgrade para o plano MASTER.', '_blank')}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
              >
                ⚡ Falar sobre MASTER
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}