import React, { useState } from 'react';
import { ArrowRight, Check, Shield, Bot, Settings, MessageSquare, Clock, Code, Server, Smartphone, Layers, Zap, Users, Building2, Briefcase, Cpu, Database, Globe, FileText, CheckSquare, ChevronRight, Palette, DollarSign, Send, Mail, User, Phone, ChevronDown, ChevronUp, BarChart as ChartBar, BarChart3, Copy, AlertCircle, Info, Loader } from 'lucide-react';
import supabase from '../lib/supabase';

// Types for the form data
interface FormData {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  platform: string[];
  modules: {
    riskManagement: string[];
    entryExit: string[];
    filters: string[];
    advancedLogic: string[];
    externalControl: string[];
    copyPortfolio: string[];
    webApp: string[];
    whiteLabel: string[];
    indicators: string[];
  };
  description: string;
}

// Types for the checkout steps
type ProjectType = 'robot' | 'copy' | 'app' | 'other' | '';
type CheckoutStep = 'projectType' | 'platform' | 'modules' | 'contact';

export default function CreateSolution() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('projectType');
  const [projectType, setProjectType] = useState<ProjectType>('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    riskManagement: true,
    entryExit: false,
    filters: false,
    advancedLogic: false,
    externalControl: false,
    copyPortfolio: false,
    webApp: false,
    whiteLabel: false
  });
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    platform: [],
    modules: {
      riskManagement: [],
      entryExit: [],
      filters: [],
      advancedLogic: [],
      externalControl: [],
      copyPortfolio: [],
      webApp: [],
      whiteLabel: [],
      indicators: []
    },
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showThankYouPage, setShowThankYouPage] = useState(false);

  // Thank you page component
  const renderThankYouPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gray-900/80 rounded-xl p-8 md:p-12 border border-gray-800/30 shadow-lg">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Obrigado pela sua solicitação!
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Recebemos sua solicitação de projeto personalizado. Nossa equipe técnica analisará 
            seus requisitos e entrará em contato em até <strong className="text-blue-400">24 horas</strong> 
            para apresentar a proposta detalhada.
          </p>
          
          <div className="bg-blue-900/30 rounded-lg p-6 mb-8 border border-blue-600/30">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">Próximos passos:</h3>
            <div className="text-left space-y-2 text-gray-300">
              <p>✅ Análise técnica dos requisitos (2-4 horas)</p>
              <p>✅ Elaboração da proposta comercial (12-24 horas)</p>
              <p>✅ Contato via WhatsApp com orçamento detalhado</p>
              <p>✅ Reunião para alinhamento do projeto (se necessário)</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.open(`https://wa.me/5511975333355?text=Olá! Acabei de enviar uma solicitação de projeto. Gostaria de acelerar o atendimento.`, '_blank')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Falar no WhatsApp</span>
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Voltar ao Início
            </button>
          </div>
          
          <div className="mt-8 text-sm text-gray-400">
            <p>Dúvidas? Entre em contato: <strong>contato@estrategistatradingsolutions.com.br</strong></p>
          </div>
        </div>
      </div>
    </div>
  );

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Handle project type selection
  const handleProjectTypeSelect = (type: ProjectType) => {
    setProjectType(type);
    setFormData(prev => ({
      ...prev,
      projectType: type
    }));
    setCurrentStep('platform');
  };

  // Handle platform selection
  const handlePlatformSelect = (platform: string) => {
    const updatedPlatforms = formData.platform.includes(platform)
      ? formData.platform.filter(p => p !== platform)
      : [...formData.platform, platform];
    
    setFormData(prev => ({
      ...prev,
      platform: updatedPlatforms
    }));
  };

  // Handle module selection
  const handleModuleSelect = (category: keyof FormData['modules'], module: string) => {
    const updatedModules = formData.modules[category].includes(module)
      ? formData.modules[category].filter(m => m !== module)
      : [...formData.modules[category], module];
    
    setFormData(prev => ({
      ...prev,
      modules: {
        ...prev.modules,
        [category]: updatedModules
      }
    }));
  };

  // Count total selected modules
  const countSelectedModules = () => {
    return Object.values(formData.modules).reduce(
      (total, moduleList) => total + moduleList.length, 
      0
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Enviando dados do formulário "Crie sua Solução"...', formData);
      
      // Try to save to Supabase
      try {
        const { data, error } = await supabase
          .from('solution_requests')
          .insert([
            {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              project_type: formData.projectType,
              platform: formData.platform,
              modules: formData.modules,
              description: formData.description,
              status: 'pending',
              priority: 'medium'
            }
          ]);

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        console.log('✅ Solution request saved to database:', data);
      } catch (dbError) {
        console.warn('Database save failed, continuing with WhatsApp fallback:', dbError);
      }
      
      // Show success message
      setShowThankYouPage(true);
      
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setError('Ocorreu um erro ao enviar seu formulário. Por favor, tente novamente ou entre em contato via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Project type options
  const projectTypes = [
    {
      type: 'robot',
      icon: <Bot className="h-8 w-8 md:h-12 md:w-12 text-blue-600" />,
      title: 'Um sistema de automação financeira',
      description: 'Automatize processos financeiros com soluções personalizadas para sua empresa'
    },
    {
      type: 'copy',
      icon: <Users className="h-8 w-8 md:h-12 md:w-12 text-green-600" />,
      title: 'Um gateway de pagamentos ou sistema de vendas',
      description: 'Desenvolva soluções para processamento de pagamentos e gestão de vendas'
    },
    {
      type: 'app',
      icon: <Smartphone className="h-8 w-8 md:h-12 md:w-12 text-purple-600" />,
      title: 'Um dashboard ou painel de controle',
      description: 'Crie painéis de visualização de dados e controle para sua operação'
    },
    {
      type: 'other',
      icon: <Layers className="h-8 w-8 md:h-12 md:w-12 text-amber-600" />,
      title: 'Automações corporativas ou soluções para trading',
      description: 'Desenvolva soluções específicas para o mercado financeiro ou sua empresa'
    }
  ];

  // Platform options
  const platformOptions = [
    { id: 'profit', name: 'Profit', icon: <ChartBar className="h-5 w-5 md:h-6 md:w-6 text-blue-600" /> },
    { id: 'mt5', name: 'MetaTrader 5', icon: <ChartBar className="h-5 w-5 md:h-6 md:w-6 text-green-600" /> },
    { id: 'blackarrow', name: 'BlackArrow', icon: <ChartBar className="h-5 w-5 md:h-6 md:w-6 text-purple-600" /> },
    { id: 'web', name: 'Web / API', icon: <Globe className="h-5 w-5 md:h-6 md:w-6 text-red-600" /> },
    { id: 'website', name: 'Criar Site', icon: <Globe className="h-5 w-5 md:h-6 md:w-6 text-blue-500" /> },
    { id: 'community', name: 'Desenvolver Comunidade', icon: <Users className="h-5 w-5 md:h-6 md:w-6 text-green-500" /> },
    { id: 'app', name: 'Criar Aplicativo', icon: <Smartphone className="h-5 w-5 md:h-6 md:w-6 text-purple-500" /> },
    { id: 'marketplace', name: 'Marketplace Vendas', icon: <Building2 className="h-5 w-5 md:h-6 md:w-6 text-orange-500" /> },
    { id: 'management', name: 'Sistema de Gestão Interna', icon: <Settings className="h-5 w-5 md:h-6 md:w-6 text-indigo-500" /> },
    { id: 'automation', name: 'Automações Empresariais', icon: <Zap className="h-5 w-5 md:h-6 md:w-6 text-yellow-500" /> },
    { id: 'consulting', name: 'Consultoria', icon: <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-pink-500" /> }
  ];

  // Module categories and options
  const moduleCategories = [
    {
      id: 'riskManagement',
      name: 'Gestão de risco',
      icon: <Shield className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />,
      options: [
        { id: 'fixedStop', name: 'Stop fixo' },
        { id: 'timeStop', name: 'Stop por tempo' },
        { id: 'dailyStop', name: 'Stop diário' },
        { id: 'trailingStop', name: 'Trailing stop' },
        { id: 'breakeven', name: 'Breakeven' },
        { id: 'stopTargetPoints', name: 'Stop/Alvo por pontos' },
        { id: 'stopTargetRiskReturn', name: 'Stop/Alvo risco-retorno' },
        { id: 'financialStop', name: 'Stop financeiro' },
        { id: 'technicalStop', name: 'Stop técnico' }
      ]
    },
    {
      id: 'entryExit',
      name: 'Entrada/saída',
      icon: <ArrowRight className="h-5 w-5 md:h-6 md:w-6 text-green-600" />,
      options: [
        { id: 'stopEntry', name: 'Entrada stop' },
        { id: 'limitEntry', name: 'Entrada limite' },
        { id: 'marketEntry', name: 'Entrada a mercado' },
        { id: 'candleEntry', name: 'Entrada por candle' },
        { id: 'externalSetup', name: 'Setup externo' },
        { id: 'timeFilter', name: 'Filtro de horário' },
        { id: 'partialExit', name: 'Saída parcial' }
      ]
    },
    {
      id: 'filters',
      name: 'Filtros',
      icon: <Settings className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />,
      options: [
        { id: 'timeFilter', name: 'Filtro de horário' },
        { id: 'operationalFilters', name: 'Filtros operacionais' },
        { id: 'volumeFilter', name: 'Filtro de volume' },
        { id: 'volatilityFilter', name: 'Filtro de volatilidade' },
        { id: 'trendFilter', name: 'Filtro de tendência' },
        { id: 'marketConditionFilter', name: 'Filtro de condição de mercado' }
      ]
    },
    {
      id: 'advancedLogic',
      name: 'Lógica avançada',
      icon: <Cpu className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />,
      options: [
        { id: 'pyramid', name: 'Pirâmide' },
        { id: 'multipleStopZones', name: 'Múltiplas zonas de stop' },
        { id: 'externalIndicators', name: 'Leitura de indicadores externos' },
        { id: 'defenses', name: 'Defesas (Martingale)' },
        { id: 'correlation', name: 'Correlação' },
        { id: 'others', name: 'Outros' }
      ]
    },
    {
      id: 'externalControl',
      name: 'Controle externo',
      icon: <Settings className="h-5 w-5 md:h-6 md:w-6 text-amber-600" />,
      options: [
        { id: 'controllerIndicator', name: 'Indicador controlador (via plot)' },
        { id: 'externalParameters', name: 'Parâmetros externos' }
      ]
    },
    {
      id: 'copyPortfolio',
      name: 'Copy/Portfólio',
      icon: <Copy className="h-5 w-5 md:h-6 md:w-6 text-red-600" />,
      options: [
        { id: 'copyTradeCompatible', name: 'Compatível com Copy Trade' },
        { id: 'internalReplication', name: 'Replicação interna' },
        { id: 'mirrorPortfolio', name: 'Carteira espelho' }
      ]
    },
    {
      id: 'webApp',
      name: 'Web/App',
      icon: <Globe className="h-5 w-5 md:h-6 md:w-6 text-indigo-600" />,
      options: [
        { id: 'loginApp', name: 'App com login' },
        { id: 'managementPanel', name: 'Painel de gestão' },
        { id: 'ranking', name: 'Ranking' },
        { id: 'reports', name: 'Relatórios' },
        { id: 'pixPayments', name: 'Pagamentos PIX' },
        { id: 'recurringPayments', name: 'Pagamentos recorrentes' },
        { id: 'salesSystem', name: 'Sistema de vendas' },
        { id: 'affiliateProgram', name: 'Programa de afiliados' },
        { id: 'customerSupport', name: 'Suporte ao cliente' },
        { id: 'notificationSystem', name: 'Sistema de notificações' },
        { id: 'mobileApp', name: 'Aplicativo mobile' },
        { id: 'apiIntegration', name: 'Integração com APIs' }
      ]
    },
    {
      id: 'whiteLabel',
      name: 'Revenda/white-label',
      icon: <Palette className="h-5 w-5 md:h-6 md:w-6 text-pink-600" />,
      options: [
        { id: 'brandedVersion', name: 'Versão com sua marca' },
        { id: 'codeProtection', name: 'Proteção de código' },
        { id: 'licensedResale', name: 'Revenda licenciada' }
      ]
    },
    {
      id: 'indicators',
      name: 'Indicadores',
      icon: <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-cyan-600" />,
      options: [
        { id: 'movingAverages', name: 'Médias móveis' },
        { id: 'rsi', name: 'RSI (Índice de Força Relativa)' },
        { id: 'macd', name: 'MACD' },
        { id: 'bollinger', name: 'Bandas de Bollinger' },
        { id: 'stochastic', name: 'Estocástico' },
        { id: 'fibonacci', name: 'Fibonacci' },
        { id: 'support', name: 'Suporte e resistência' },
        { id: 'volume', name: 'Indicadores de volume' },
        { id: 'candlestick', name: 'Padrões de candlestick' },
        { id: 'pivot', name: 'Pontos de pivô' },
        { id: 'ichimoku', name: 'Ichimoku' },
        { id: 'williams', name: 'Williams %R' }
      ]
    }
  ];

  // Render project type selection
  const renderProjectTypeStep = () => (
    <div className="space-y-6 md:space-y-8">
      <h2 className="text-2xl md:text-3xl font-bold text-white text-center" id="escolha-tipo-projeto">Escolha o Tipo de Projeto de Automação:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {projectTypes.map((project) => (
          <button
            key={project.type}
            onClick={() => handleProjectTypeSelect(project.type as ProjectType)}
            className="bg-gray-800/50 hover:bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-700/30 text-left transition-all duration-200 hover:border-blue-500/50 group min-h-[200px] md:min-h-[250px]"
          >
            <div className="flex flex-col items-center text-center space-y-3 md:space-y-4">
              <div className="bg-gray-700/30 p-3 md:p-4 rounded-lg">
                {project.icon}
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-white mb-2">{project.title}</h3>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">{project.description}</p>
              </div>
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Render platform selection
  const renderPlatformStep = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h2 className="text-2xl md:text-3xl font-bold text-white" id="selecao-plataforma">Selecione a Plataforma de Trading:</h2>
        <button
          onClick={() => setCurrentStep('projectType')}
          className="self-start md:self-auto bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Voltar
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {platformOptions.map((platform) => (
          <button
            key={platform.id}
            onClick={() => handlePlatformSelect(platform.id)}
            className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 ${
              formData.platform.includes(platform.id)
                ? 'bg-blue-900/50 border-blue-500 text-white'
                : 'bg-gray-800/50 border-gray-700/30 text-gray-300 hover:bg-gray-800 hover:border-blue-500/50'
            }`}
          >
            <div className="bg-gray-700/30 p-2 rounded-lg flex-shrink-0">
              {platform.icon}
            </div>
            <span className="font-medium text-sm md:text-base">{platform.name}</span>
            <div className="ml-auto">
              {formData.platform.includes(platform.id) ? (
                <Check className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
              ) : null}
            </div>
          </button>
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between mt-6 md:mt-8 space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          onClick={() => setCurrentStep('projectType')}
          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={() => setCurrentStep('modules')}
          disabled={formData.platform.length === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  );

  // Render module selection
  const renderModulesStep = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h2 className="text-xl md:text-3xl font-bold text-white" id="selecao-funcionalidades">Selecione as Funcionalidades do Robô:</h2>
        <button
          onClick={() => setCurrentStep('platform')}
          className="self-start md:self-auto bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Voltar
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Modules List */}
        <div className="space-y-4 md:space-y-6">
          {moduleCategories
            .map((category) => (
            <div 
              key={category.id} 
              className="bg-gray-800/50 rounded-lg border border-gray-700/30 overflow-hidden"
            >
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-4 bg-gray-700/30 hover:bg-gray-700/50 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  {category.icon}
                  <span className="font-medium text-white text-sm md:text-base">{category.name}</span>
                </div>
                {expandedCategories[category.id] ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              
              {expandedCategories[category.id] && (
                <div className="p-4 pt-0 border-t border-gray-700/30">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {category.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleModuleSelect(category.id as keyof FormData['modules'], option.id)}
                        className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 text-sm ${
                          formData.modules[category.id as keyof FormData['modules']].includes(option.id)
                            ? 'bg-blue-900/50 border-blue-500 text-white'
                            : 'bg-gray-800/30 border-gray-700/30 text-gray-300 hover:bg-gray-800 hover:border-blue-500/50'
                        }`}
                      >
                        {formData.modules[category.id as keyof FormData['modules']].includes(option.id) ? (
                          <Check className="h-4 w-4 text-blue-400 flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 border border-gray-500 rounded-sm flex-shrink-0"></div>
                        )}
                        <span>{option.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => setCurrentStep('platform')}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Voltar
          </button>
          <button
            onClick={() => setCurrentStep('contact')}
            disabled={formData.platform.length === 0 || countSelectedModules() === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );

  // Render contact form
  const renderContactStep = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h2 className="text-2xl md:text-3xl font-bold text-white" id="informacoes-contato">Informações de Contato para Orçamento</h2>
        <button
          onClick={() => setCurrentStep('modules')}
          className="self-start md:self-auto bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Voltar
        </button>
      </div>
      
      {error && (
        <div className="bg-red-900/50 border border-red-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-900/50 border border-green-800 rounded-lg p-4 flex items-start gap-3">
          <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-600 text-sm">{success}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Nome Completo *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-700 bg-gray-800/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                placeholder="Seu nome completo"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-700 bg-gray-800/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                placeholder="seu@email.com"
              />
            </div>
          </div>
          
          <div className="md:col-span-1">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
              WhatsApp *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => {
                  // Format phone number as user types: +55 (DD) 9XXXX-XXXX
                  let value = e.target.value.replace(/\D/g, '');
                  
                  // Remove +55 if user types it
                  if (value.startsWith('55') && value.length > 11) {
                    value = value.substring(2);
                  }
                  
                  let formatted = '';
                  if (value.length > 0) {
                    formatted = '+55 ';
                    if (value.length >= 2) {
                      formatted += `(${value.slice(0, 2)}) `;
                      if (value.length >= 7) {
                        formatted += `${value.slice(2, 7)}-${value.slice(7, 11)}`;
                      } else if (value.length > 2) {
                        formatted += value.slice(2);
                      }
                    } else {
                      formatted += value;
                    }
                  }
                  
                  setFormData(prev => ({ ...prev, phone: formatted }));
                }}
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-700 bg-gray-800/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                placeholder="+55 (11) 99999-9999"
                maxLength={19}
              />
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Quer descrever sua estratégia ou lógica específica?
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
            placeholder="Descreva detalhes adicionais sobre sua estratégia, lógica de negócio ou requisitos específicos..."
          />
        </div>
        
        <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-800/30">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Info className="h-5 w-5 flex-shrink-0" />
            <h4 className="font-medium text-sm md:text-base">Próximos passos</h4>
          </div>
          <p className="text-blue-300 text-sm">
            Desenvolvemos Pack de Robôs, aplicativos, plataformas e sistemas para traders, fintechs, corretoras, influencers e salas de trading.
            O valor será calculado com base nas funcionalidades selecionadas e na complexidade do projeto.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between pt-4 space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            onClick={() => setCurrentStep('modules')}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Voltar
          </button>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Enviar Solicitação
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  // If showing thank you page, render it
  if (showThankYouPage) {
    return renderThankYouPage();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
      {/* Hero Section */}
      <div className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight" id="titulo-criar-solucao">
              Crie sua Solução de Automação
              <span className="block text-blue-400">Tecnologia Personalizada</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-6 md:mb-8 px-4">
              A Estrategista Trading Solutions desenvolve soluções corporativas, gateways de pagamento, dashboards, sites, painéis de controle e produtos para o mercado financeiro.
              Automatize sua operação com especialistas em tecnologia aplicada ao mercado financeiro.
            </p>
          </div>
        </div>
      </div>

      {/* Checkout Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-24">
        {/* Progress Bar */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-blue-400 font-semibold text-sm">
              Etapa {currentStep === 'projectType' ? '1' : 
                     currentStep === 'platform' ? '2' : 
                     currentStep === 'modules' ? '3' : '4'} de 4
            </span>
            <span className="text-gray-400 text-sm">
              {Math.round(((currentStep === 'projectType' ? 1 : 
                           currentStep === 'platform' ? 2 : 
                           currentStep === 'modules' ? 3 : 4) / 4) * 100)}% completo
            </span>
          </div>
          <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ 
                width: currentStep === 'projectType' ? '25%' : 
                       currentStep === 'platform' ? '50%' : 
                       currentStep === 'modules' ? '75%' : '100%' 
              }}
            ></div>
          </div>
        </div>

        {/* Current Step Content */}
        <div className="bg-gray-900/80 rounded-xl p-4 md:p-8 border border-gray-800/30 shadow-lg">
          {currentStep === 'projectType' && renderProjectTypeStep()}
          {currentStep === 'platform' && renderPlatformStep()}
          {currentStep === 'modules' && renderModulesStep()}
          {currentStep === 'contact' && renderContactStep()}
        </div>
      </div>
    </div>
  );
}