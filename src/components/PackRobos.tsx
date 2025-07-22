import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, TrendingUp, Shield, Zap, ArrowRight, Target, Clock, Check, Star, Crown, Gift, Download, Settings, Play, Building2, Users, Award, X, Quote, AlertTriangle, Monitor, Copy, ExternalLink, ChevronDown, ChevronUp, CreditCard, Wrench, BarChart3, Menu } from 'lucide-react';

const PackRobos = ({ onAuthClick }) => {
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleFAQ = (index: number) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  const strategies = [
    { name: "Scalper 1", acerto: "72%", profit: "1.8", payoff: "2.4" },
    { name: "Scalper 2", acerto: "65%", profit: "1.6", payoff: "2.1" },
    { name: "Scalper 3", acerto: "58%", profit: "1.3", payoff: "1.8" },
    { name: "Scalper 4", acerto: "71%", profit: "1.4", payoff: "1.9" },
    { name: "Scalper 5", acerto: "69%", profit: "1.5", payoff: "2.0" },
    { name: "Scalper 6", acerto: "68%", profit: "1.2", payoff: "1.6" }
  ];

  const aboutFeatures = [
    {
      icon: <Target className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />,
      title: "Exclusivos para Profit",
      description: "Compatibilidade total com Starter, PRO e MASTER"
    },
    {
      icon: <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />,
      title: "6 Setups Otimizados",
      description: "Estratégias prontas para day trade"
    },
    {
      icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />,
      title: "Controle de Risco",
      description: "Foco em velocidade e consistência"
    },
    {
      icon: <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />,
      title: "Lógica Comprovada",
      description: "Projetados para traders reais"
    }
  ];

  const setups = [
    { nome: "Scalper 1", tipo: "Scalper", observacoes: "Alvo Moderado" },
    { nome: "Scalper 2", tipo: "Scalper", observacoes: "Alvo Curto" },
    { nome: "Scalper 3", tipo: "Scalper", observacoes: "Alvo Longo" },
    { nome: "Scalper 4", tipo: "Scalper", observacoes: "Fluxo" }, 
      { nome: "Scalper 5", tipo: "Scalper", observacoes: "Movimentos Ágeis" },
    { nome: "Scalper 6", tipo: "Scalper", observacoes: "Entrada curta" } 
    
  ];

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'Scalper': return 'bg-blue-100 text-blue-800';
      case 'Tendência': return 'bg-emerald-100 text-emerald-800';
      case 'HFT': return 'bg-purple-100 text-purple-800';
      case 'Reversão': return 'bg-orange-100 text-orange-800';
      case 'Direcional': return 'bg-slate-100 text-slate-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const steps = [
    {
      number: "01",
      icon: <Download className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />,
      title: "Escolha o Plano",
      description: "Starter grátis, PRO ou MASTER conforme sua necessidade",
      color: "from-blue-500 to-blue-600"
    },
    {
      number: "02",
      icon: <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />,
      title: "Instale via Profit",
      description: "Configuração automática em menos de 3 minutos",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      number: "03",
      icon: <Play className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />,
      title: "Ative sua Automação",
      description: "Defina horários, ativos e deixe os robôs trabalharem",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: "Grátis",
      period: "",
      ativos: "Apenas WIN",
      recursos: "Opera à tarde, sem filtros, 1 conta",
      icon: <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />,
      color: "border-emerald-200 hover:border-emerald-300",
      bgColor: "bg-emerald-50",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700"
    },
    {
      name: "PRO",
      price: "R$800",
      period: "sem",
      yearlyPrice: "R$1350",
      ativos: "WIN + WDO",
      recursos: "Trailing básico, breakeven simples, stop diário, suporte comunidade",
      icon: <Star className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />,
      color: "border-blue-200 hover:border-blue-300",
      bgColor: "bg-blue-50",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      popular: true
    },
    {
      name: "MASTER",
      price: "R$1200",
      period: "sem",
      yearlyPrice: "R$1800",
      ativos: "Todos (WIN, WDO, Ações, BTC)",
      recursos: "Todos os filtros, trailing avançado, breakeven avançado, zonas de risco, suporte técnico direto",
      icon: <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />,
      color: "border-purple-200 hover:border-purple-300",
      bgColor: "bg-purple-50",
      buttonColor: "bg-purple-600 hover:bg-purple-700"
    }
  ];

  const includedFeatures = [
    "Profit Pro gratuito",
    "Módulo de automação gratuito via Warren",
    "1 licença pessoal (CPF)"
  ];

  const guarantees = [
    {
      icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />,
      title: "Sem Surpresas",
      description: "Suporte incluso, sem taxas ocultas, sem fidelidade obrigatória"
    },
    {
      icon: <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />,
      title: "Cancelamento Livre",
      description: "Você decide se renova. Sem compromisso de permanência"
    },
    {
      icon: <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />,
      title: "Suporte Dedicado",
      description: "Equipe técnica especializada para ajudar no setup e dúvidas"
    },
    {
      icon: <Award className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />,
      title: "Estratégias Validadas",
      description: "Desenvolvidas por traders profissionais com anos de experiência"
    }
  ];

  const comparisonFeatures = [
    {
      feature: "Ativos permitidos",
      starter: "WIN",
      pro: "WIN + WDO", 
      master: "Todos",
      personalizado: "Todos + Mais"
    },
    {
      feature: "Horário de operação",
      starter: "14h–17h",
      pro: "Completo",
      master: "Completo",
      personalizado: "Personalizado"
    },
    {
      feature: "Trailing Stop",
      starter: false,
      pro: "✅ (1 tipo)",
      master: "✅ (todos os modos)",
      personalizado: "✅ (avançado)"
    },
    {
      feature: "Breakeven",
      starter: false,
      pro: "✅ (simples)",
      master: "✅ (2 tipos)",
      personalizado: "✅ (customizado)"
    },
    {
      feature: "Stop Diário",
      starter: true,
      pro: true,
      master: "✅ com zonas",
      personalizado: true
    },
    {
      feature: "Meta Diário",
      starter: true,
      pro: true,
      master: true,
      personalizado: true
    },
    {
      feature: "Stop Financeiro",
      starter: false,
      pro: true,
      master: true,
      personalizado: true
    },
    {
      feature: "Stop Técnico",
      starter: false,
      pro: false,
      master: true,
      personalizado: true
    },
    {
      feature: "Filtros técnicos",
      starter: false,
      pro: false,
      master: true,
      personalizado: "✅ (todos)"
    },
    {
      feature: "Suporte",
      starter: "Área de Membros",
      pro: "Área de Membros",
      master: "Técnico direto",
      personalizado: "Dedicado"
    },
    {
      feature: "Atualizações",
      starter: false,
      pro: true,
      master: "✅ com prioridade",
      personalizado: "✅ vitalícias"
    },
    {
      feature: "Licenciamento",
      starter: "1 conta",
      pro: "1 conta",
      master: "1 conta",
      personalizado: "Ilimitado"
    },
    {
      feature: "Limite de contratos",
      starter: "2 WIN",
      pro: "5 WDO / 10 WIN",
      master: "10 WDO / 20 WIN",
      personalizado: "Ilimitado"
    },
    {
      feature: "Revenda liberada",
      starter: false,
      pro: false,
      master: "❌ (via White Label)",
      personalizado: "✅ (total)"
    }
  ];

  const renderComparisonValue = (value: any) => {
    if (value === true) {
      return <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 mx-auto" />;
    }
    if (value === false) {
      return <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mx-auto" />;
    }
    return <span className="text-slate-700 text-xs sm:text-sm">{value}</span>;
  };

  const testimonials = [
    {
      name: "Ricardo M.",
      role: "Trader desde 2021",
      text: "Instalei em 3 minutos e o trailing me salvou de 2 stops. Master vale cada centavo.",
      rating: 5,
      plan: "MASTER"
    },
    {
      name: "Ana Clara S.",
      role: "Day Trader",
      text: "Finalmente fechei no positivo! O controle de risco do PRO mudou minha operação completamente.",
      rating: 5,
      plan: "PRO"
    },
    {
      name: "Felipe R.",
      role: "Iniciante",
      text: "Comecei com o Starter grátis e em 2 semanas já estava operando com segurança. Recomendo!",
      rating: 5,
      plan: "Starter"
    },
    {
      name: "Marina L.",
      role: "Swing Trader",
      text: "Os 6 setups cobrem todas as situações de mercado. Nunca mais opero manualmente.",
      rating: 5,
      plan: "MASTER"
    }
  ];

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Starter': return 'bg-emerald-100 text-emerald-800';
      case 'PRO': return 'bg-blue-100 text-blue-800';
      case 'MASTER': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const faqs = [
    {
      question: "Posso revender os robôs?",
      answer: "❌ Não. Para revenda existe o modelo White Label com desenvolvimento personalizado."
    },
    {
      question: "Os robôs funcionam no MetaTrader ou MT5?",
      answer: "❌ Não. Os robôs Pack (Starter, PRO e MASTER) são exclusivos para Profit da Nelogica. Para outras plataformas, use o Robô Personalizado."
    },
    {
      question: "Em quanto tempo recebo após a compra?",
      answer: "⚡ Ativação imediata após confirmação do pagamento. Você recebe os dados de acesso por email."
    },
    {
      question: "Posso usar em mais de uma conta?",
      answer: "📋 Cada licença é válida para 1 conta/CPF. Para múltiplas contas, consulte nossos planos empresariais."
    },
    {
      question: "Preciso deixar o computador ligado?",
      answer: "💻 Sim, o Profit precisa estar rodando para os robôs operarem. Recomendamos VPS para maior estabilidade."
    },
    {
      question: "Qual a diferença entre os planos?",
      answer: "📊 Starter: WIN apenas, básico. PRO: WIN+WDO, trailing e breakeven. MASTER: todos ativos + filtros avançados."
    },
    {
      question: "Os robôs operam 24 horas?",
      answer: "⏰ Não. Cada estratégia tem horários específicos otimizados. Starter opera das 14h às 17h."
    },
    {
      question: "Há garantia de resultados?",
      answer: "⚠️ Trading envolve riscos. Mostramos backtests e estatísticas, mas não garantimos lucros futuros."
    },
    {
      question: "Posso cancelar quando quiser?",
      answer: "🔄 Sim, não há fidelidade. Planos mensais podem ser cancelados a qualquer momento."
    },
    {
      question: "Preciso de conhecimento técnico?",
      answer: "🎯 Não. Os robôs vêm pré-configurados. Basta escolher o ativo e horário de operação."
    }
  ];

  const finalCTAButtons = [
    {
      text: "🔓 Começar com Starter Grátis",
      icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: "bg-emerald-600 hover:bg-emerald-700"
    },
    {
      text: "💳 Assinar PRO",
      icon: <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      text: "🛡️ Assinar MASTER",
      icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      text: "🧩 Criar Solução Sob Medida",
      icon: <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: "bg-orange-600 hover:bg-orange-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-emerald-600/10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/[0.02] to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header Badge */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="inline-flex items-center space-x-2 bg-blue-600/20 border border-blue-400/30 rounded-full px-4 py-2 sm:px-6 sm:py-3 backdrop-blur-sm">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <span className="text-blue-300 font-medium text-sm sm:text-base">Pack de Robôs - Estrategista Solutions</span>
              </div>
            </div>

            {/* Main Title */}
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 sm:mb-8 leading-[0.9]">
                <span className="block text-white mb-2 sm:mb-3">Robôs que</span>
                <span className="block bg-gradient-to-r from-emerald-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent mb-2 sm:mb-3">
                  OPERAM
                </span>
                <span className="block text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                  para você
                </span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-light">
                Pack com 6 estratégias validadas por traders profissionais.<br />
                <span className="text-emerald-400 font-medium">Comece grátis</span> com o Starter ou 
                <span className="text-blue-400 font-medium"> libere todo o potencial</span> com os planos PRO e MASTER.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">6</div>
                <div className="text-slate-400 text-sm sm:text-base">Estratégias Validadas</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">100%</div>
                <div className="text-slate-400 text-sm sm:text-base">Controle de Risco</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">24/7</div>
                <div className="text-slate-400 text-sm sm:text-base">Automação Completa</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Starter */}
                <button 
                  onClick={() => onAuthClick?.('register')}
                  className="group relative w-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:via-emerald-500 hover:to-teal-500 text-white rounded-2xl sm:rounded-3xl font-semibold transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 shadow-2xl hover:shadow-emerald-500/25 border border-white/20 backdrop-blur-sm overflow-hidden min-h-[44px] min-w-[44px]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="relative p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center justify-center mb-3 sm:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-white" />
                      </div>
                    </div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">Starter</div>
                    <div className="text-emerald-100 text-sm sm:text-base lg:text-lg font-medium mb-3 sm:mb-4">Começar Grátis</div>
                    <div className="flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </button>

                {/* PRO */}
                <button 
                  onClick={() => window.open('https://buy.stripe.com/dR65nXfTSdnngmY8ww', '_blank')}
                  className="group relative w-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-400 hover:via-blue-500 hover:to-indigo-500 text-white rounded-2xl sm:rounded-3xl font-semibold transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 shadow-2xl hover:shadow-blue-500/25 border border-white/20 backdrop-blur-sm overflow-hidden min-h-[44px] min-w-[44px]">
                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-blue-800 font-bold text-xs sm:text-sm rotate-12">POPULAR</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="relative p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center justify-center mb-3 sm:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-white" />
                      </div>
                    </div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">PRO</div>
                    <div className="text-blue-100 text-sm sm:text-base lg:text-lg font-medium mb-3 sm:mb-4">
                      <div>R$ 800/sem</div>
                      <div className="text-xs sm:text-sm opacity-75">R$ 1.350/ano</div>
                    </div>
                    <div className="flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </button>

                {/* MASTER */}
                <button 
                  onClick={() => window.open('https://buy.stripe.com/dR63fPfTSfvvb2EcMN', '_blank')}
                  className="group relative w-full bg-gradient-to-br from-purple-500 via-purple-600 to-violet-600 hover:from-purple-400 hover:via-purple-500 hover:to-violet-500 text-white rounded-2xl sm:rounded-3xl font-semibold transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 shadow-2xl hover:shadow-purple-500/25 border border-white/20 backdrop-blur-sm overflow-hidden min-h-[44px] min-w-[44px]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="relative p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center justify-center mb-3 sm:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-white" />
                      </div>
                    </div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">MASTER</div>
                    <div className="text-purple-100 text-sm sm:text-base lg:text-lg font-medium mb-3 sm:mb-4">
                      <div>R$ 1.200/sem</div>
                      <div className="text-xs sm:text-sm opacity-75">R$ 1.800/ano</div>
                    </div>
                    <div className="flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </button>

                {/* Sob Medida */}
                <button 
                  onClick={() => window.location.href = '/white-label'}
                  className="group relative w-full bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 hover:from-orange-400 hover:via-red-400 hover:to-pink-400 text-white rounded-2xl sm:rounded-3xl font-semibold transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 shadow-2xl hover:shadow-orange-500/25 border border-white/20 backdrop-blur-sm overflow-hidden min-h-[44px] min-w-[44px]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="relative p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center justify-center mb-3 sm:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Bot className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-white" />
                      </div>
                    </div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">White Label</div>
                    <div className="text-orange-100 text-sm sm:text-base lg:text-lg font-medium mb-3 sm:mb-4">Sua Marca</div>
                    <div className="flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Trust Indicator */}
            <div className="text-center mt-12 sm:mt-16">
              <p className="text-slate-400 text-xs sm:text-sm">
                ✅ Compatível exclusivamente com Profit • ⚡ Configuração em 5 minutos • 🛡️ Suporte técnico incluído
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-3 sm:mb-4">Performance Comprovada dos Robôs de Trading</h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
              Resultados médios das estratégias baseados em backtests e dados reais dos últimos 6 meses
            </p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 sm:mb-8 text-center">Resultados por Estratégia de Trading Automatizado</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {strategies.map((strategy, index) => (
                <div key={index} className="bg-slate-50 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:bg-slate-100 transition-colors duration-200">
                  <h4 className="font-semibold text-slate-800 mb-3 sm:mb-4 text-sm sm:text-base">{strategy.name}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600 text-xs sm:text-sm">Taxa de acerto:</span>
                      <span className="font-semibold text-emerald-600 text-xs sm:text-sm">{strategy.acerto}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 text-xs sm:text-sm">Fator de lucro:</span>
                      <span className="font-semibold text-blue-600 text-xs sm:text-sm">{strategy.profit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 text-xs sm:text-sm">Payoff:</span>
                      <span className="font-semibold text-purple-600 text-xs sm:text-sm">{strategy.payoff}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-slate-500">
              * Resultados passados não garantem resultados futuros. Trading envolve riscos.
            </p>
          </div>
        </div>
      </section>

      {/* About Robots Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-3 sm:mb-4">Como Funcionam os Robôs de Trading Automatizado</h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
              Estratégias automatizadas com tecnologia de ponta para maximizar seus resultados no trading
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {aboutFeatures.map((feature, index) => (
              <div key={index} className="text-center p-4 sm:p-6 rounded-lg sm:rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-300">
                <div className="flex justify-center mb-3 sm:mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm sm:text-base">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 sm:mb-8 text-center">Estratégias e Setups Incluídos</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-semibold text-slate-700 text-sm sm:text-base">Nome do Setup</th>
                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-semibold text-slate-700 text-sm sm:text-base">Tipo</th>
                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-semibold text-slate-700 text-sm sm:text-base">Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {setups.map((setup, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-white transition-colors duration-200">
                      <td className="py-3 sm:py-4 px-3 sm:px-6 font-medium text-slate-800 text-sm sm:text-base">{setup.nome}</td>
                      <td className="py-3 sm:py-4 px-3 sm:px-6">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getTypeColor(setup.tipo)}`}>
                          {setup.tipo}
                        </span>
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-6 text-slate-600 text-sm sm:text-base">{setup.observacoes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Como Começar com Robôs de Trading em 3 Passos</h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto">
              Comece a automatizar seus trades em menos de 5 minutos
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Connector Line - Hidden on mobile */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-full w-8 z-10">
                      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 mx-auto" />
                    </div>
                  )}
                  
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center hover:bg-opacity-20 transition-all duration-300 border border-white border-opacity-20">
                    {/* Step Number */}
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-white font-bold text-lg sm:text-xl`}>
                      {step.number}
                    </div>
                    
                    {/* Icon */}
                    <div className="flex justify-center mb-3 sm:mb-4">
                      {step.icon}
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{step.title}</h3>
                    <p className="text-slate-300 leading-relaxed text-sm sm:text-base">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 sm:mt-16 text-center">
            <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Ativação Imediata dos Robôs</h3>
              <p className="text-base sm:text-lg text-blue-100 mb-4 sm:mb-6">
                Após a compra, você recebe acesso instantâneo ao robô e pode começar a operar no mesmo dia
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-6 sm:space-x-8">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-400 rounded-full"></div>
                  <span className="text-sm sm:text-base">Instalação automática</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-400 rounded-full"></div>
                  <span className="text-sm sm:text-base">Suporte no setup</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-400 rounded-full"></div>
                  <span className="text-sm sm:text-base">Configurações pré-definidas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Trust Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-3 sm:mb-4">Garantias e Benefícios Inclusos</h2>
              <p className="text-lg sm:text-xl text-slate-600">Transparência total em todos os nossos serviços</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
              {guarantees.map((guarantee, index) => (
                <div key={index} className="text-center p-4 sm:p-6 rounded-lg sm:rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-300">
                  <div className="flex justify-center mb-3 sm:mb-4">
                    {guarantee.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">{guarantee.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{guarantee.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-emerald-200">
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">Benefícios Inclusos em Todos os Planos de Robôs</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <span className="text-white font-bold text-lg sm:text-xl">💎</span>
                    </div>
                    <h4 className="font-bold text-slate-800 mb-2 text-sm sm:text-base">Profit Pro GRÁTIS</h4>
                    <p className="text-slate-600 text-xs sm:text-sm">Acesso completo à plataforma profissional via Warren</p>
                  </div>
                  
                  <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <span className="text-white font-bold text-lg sm:text-xl">⚙️</span>
                    </div>
                    <h4 className="font-bold text-slate-800 mb-2 text-sm sm:text-base">Módulo Automação</h4>
                    <p className="text-slate-600 text-xs sm:text-sm">Sistema de automação integrado sem custo adicional</p>
                  </div>
                  
                  <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <span className="text-white font-bold text-lg sm:text-xl">👤</span>
                    </div>
                    <h4 className="font-bold text-slate-800 mb-2 text-sm sm:text-base">Licença Pessoal</h4>
                    <p className="text-slate-600 text-xs sm:text-sm">1 licença individual vinculada ao seu CPF</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-3 sm:mb-4">Comparativo Técnico dos Planos de Robôs</h2>
            <p className="text-lg sm:text-xl text-slate-600">Comparação detalhada entre todos os planos</p>
          </div>

          <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-semibold text-slate-700 text-sm sm:text-base">Recurso / Plano</th>
                  <th className="text-center py-3 sm:py-4 px-3 sm:px-6 font-semibold text-emerald-700 bg-emerald-50 rounded-t-lg text-sm sm:text-base">Starter</th>
                  <th className="text-center py-3 sm:py-4 px-3 sm:px-6 font-semibold text-blue-700 bg-blue-50 rounded-t-lg text-sm sm:text-base">PRO</th>
                  <th className="text-center py-3 sm:py-4 px-3 sm:px-6 font-semibold text-purple-700 bg-purple-50 rounded-t-lg text-sm sm:text-base">MASTER</th>
                  <th className="text-center py-3 sm:py-4 px-3 sm:px-6 font-semibold text-orange-700 bg-orange-50 rounded-t-lg text-sm sm:text-base">Personalizado</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((item, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-white transition-colors duration-200">
                    <td className="py-3 sm:py-4 px-3 sm:px-6 font-medium text-slate-800 text-sm sm:text-base">{item.feature}</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-center bg-emerald-25">
                      {renderComparisonValue(item.starter)}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-center bg-blue-25">
                      {renderComparisonValue(item.pro)}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-center bg-purple-25">
                      {renderComparisonValue(item.master)}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-center bg-orange-25">
                      {renderComparisonValue(item.personalizado)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-3 sm:mb-4">Depoimentos de Usuários dos Robôs de Trading</h2>
            <p className="text-lg sm:text-xl text-slate-600">Depoimentos reais de traders que transformaram seus resultados</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-all duration-300 border border-slate-100">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 italic">
                      "{testimonial.text}"
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-800 text-sm sm:text-base">{testimonial.name}</div>
                        <div className="text-slate-600 text-xs sm:text-sm">{testimonial.role}</div>
                      </div>
                      
                      <div className="text-right">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getPlanColor(testimonial.plan)} mb-2 inline-block`}>
                          {testimonial.plan}
                        </span>
                        <div className="flex space-x-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 sm:mt-16 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-emerald-200">
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">Comunidade de Traders Automatizados</h3>
              <p className="text-slate-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Junte-se à comunidade de traders que já automatizaram seus resultados
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-center">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-600">2.500+</div>
                  <div className="text-slate-600 text-sm sm:text-base">Usuários Ativos</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600">R$ 12M+</div>
                  <div className="text-slate-600 text-sm sm:text-base">Volume Operado</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600">98%</div>
                  <div className="text-slate-600 text-sm sm:text-base">Satisfação</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compatibility Section */}
      <section className="py-12 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 sm:p-8 rounded-lg">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">Compatibilidade de Plataformas de Trading</h2>
                  <div className="space-y-3 sm:space-y-4">
                    <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                      <strong>Os robôs Starter, PRO e MASTER são compatíveis exclusivamente com Profit.</strong>
                    </p>
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                      Para <strong>MetaTrader 5, BlackArrow e Dashboards Quanticos</strong>, utilize o modelo <strong>White Label</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 sm:mt-8 bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-lg">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                <Monitor className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                <h3 className="text-lg sm:text-xl font-semibold text-slate-800">Robôs para Plataforma Profit</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center p-3 sm:p-4 bg-emerald-50 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-emerald-600 mb-1 sm:mb-2">Starter</div>
                  <div className="text-xs sm:text-sm text-slate-600">Operações básicas</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1 sm:mb-2">PRO</div>
                  <div className="text-xs sm:text-sm text-slate-600">Recursos avançados</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-purple-600 mb-1 sm:mb-2">MASTER</div>
                  <div className="text-xs sm:text-sm text-slate-600">Máximo desempenho</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Copy Invest Section */}
      <section className="py-12 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-blue-200">
              <div className="text-center">
                <div className="flex justify-center mb-4 sm:mb-6">
                  <Copy className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500" />
                </div> 
                
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3 sm:mb-4">Copy Invest - Alternativa aos Robôs</h2>
                <h3 className="text-lg sm:text-xl text-slate-600 mb-4 sm:mb-6">Copie Estratégias Automaticamente</h3>
                
                <p className="text-base sm:text-lg text-slate-700 mb-1 sm:mb-2">
                  <strong>Prefere copiar nossas estratégias direto pelo Profit?</strong>
                </p>
                <p className="text-slate-600 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                  Use o Copy Invest da Nelogica e replique nossos resultados com 1 clique.
                </p>
                
                <button 
                  onClick={() => window.open('https://www.nelogica.com.br/copy-invest/copy-invest-profit-estrategista-portf%C3%B3lio-de-ia', '_blank')}
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl min-h-[44px] min-w-[44px] text-sm sm:text-base"
                >
                  <span>🔗 Acessar Copy Invest</span>
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-3 sm:mb-4">Perguntas Frequentes sobre Robôs de Trading</h2>
            <p className="text-lg sm:text-xl text-slate-600">Tire suas dúvidas sobre os robôs de trading</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-3 sm:space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg sm:rounded-xl border border-slate-200 overflow-hidden">
                  <button 
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
                  >
                    <span className="font-semibold text-slate-800 pr-4 text-sm sm:text-base">{faq.question}</span>
                    {openFAQIndex === index ? (
                      <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 flex-shrink-0" />
                    )}
                  </button>
                  
                  {openFAQIndex === index && (
                    <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                      <div className="text-slate-600 leading-relaxed border-t border-slate-100 pt-3 sm:pt-4 text-sm sm:text-base">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 sm:mt-16 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">Suporte Técnico Especializado</h3>
              <p className="text-slate-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Nossa equipe de suporte está pronta para ajudar você a escolher o melhor plano.
              </p>
              <button 
                onClick={() => onAuthClick('register')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300"
              >
                💬 Falar com Suporte
              </button>
            </div>
          </div>
        </div>
      </section>

    
    </div>
  );
};

export default PackRobos;