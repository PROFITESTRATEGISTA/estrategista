import React, { useState } from 'react';
import { Check, X, Crown, Zap, User, Star, Shield, Bot, TrendingUp, Clock, Target, MessageSquare, ChevronDown, ChevronUp, ArrowRight, Sparkles } from 'lucide-react';

interface PlansPageProps {
  onAuthClick?: (mode: 'login' | 'register') => void;
}

const PlansPage = ({ onAuthClick }: PlansPageProps = {}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Starter',
      icon: <User className="w-8 h-8 text-gray-500" />,
      price: { monthly: 0, yearly: 0 },
      originalPrice: null,
      description: 'Grátis - Ativos: Apenas WIN',
      color: 'gray',
      popular: false,
      features: [
        { text: 'Opera apenas WIN', included: true },
        { text: 'Opera à tarde, sem filtros', included: true },
        { text: '1 conta permitida', included: true },
        { text: 'Suporte básico', included: true },
        { text: 'Trailing stop', included: false },
        { text: 'Breakeven', included: false },
        { text: 'Múltiplos ativos', included: false },
        { text: 'Suporte técnico direto', included: false }
      ],
      cta: 'Começar Grátis',
      whatsappMessage: 'Olá! Gostaria de começar com o plano Starter gratuito.'
    },
    {
      id: 'pro',
      name: 'PRO',
      icon: <Crown className="w-8 h-8 text-purple-500" />,
      price: { monthly: 800, yearly: 1350 },
      originalPrice: null,
      description: 'WIN + WDO - Recursos intermediários',
      color: 'purple',
      popular: true,
      features: [
        { text: 'Opera WIN + WDO', included: true },
        { text: 'Trailing básico', included: true },
        { text: 'Breakeven simples', included: true },
        { text: 'Stop diário', included: true },
        { text: 'Suporte comunidade', included: true },
        { text: 'Filtros avançados', included: false },
        { text: 'Trailing avançado', included: false },
        { text: 'Suporte técnico direto', included: false }
      ],
      cta: 'Assinar PRO',
      whatsappMessage: 'Olá! Gostaria de assinar o plano PRO por R$ 800/sem.'
    },
    {
      id: 'master',
      name: 'MASTER',
      icon: <Zap className="w-8 h-8 text-orange-500" />,
      price: { monthly: 1200, yearly: 1800 },
      originalPrice: null,
      description: 'Todos os ativos - Recursos completos',
      color: 'orange',
      popular: false,
      features: [
        { text: 'Todos os ativos (WIN, WDO, Ações, BTC)', included: true },
        { text: 'Todos os filtros', included: true },
        { text: 'Trailing avançado', included: true },
        { text: 'Breakeven avançado', included: true },
        { text: 'Zonas de risco', included: true },
        { text: 'Suporte técnico direto', included: true },
        { text: 'Configurações personalizadas', included: true },
        { text: 'Acesso prioritário', included: true }
      ],
      cta: 'Assinar MASTER',
      whatsappMessage: 'Olá! Gostaria de assinar o plano MASTER por R$ 1200/sem.'
    }
  ];

  const faqs = [
    {
      question: 'Preciso ter conhecimento técnico para utilizar os robôs?',
      answer: 'Não é necessário conhecimento técnico avançado. Nossos robôs são desenvolvidos para serem simples de usar, com instalação assistida e configuração guiada. Fornecemos tutoriais completos e suporte técnico para garantir que você consiga operar mesmo sendo iniciante.'
    },
    {
      question: 'Posso operar com capital baixo?',
      answer: 'Sim, é possível começar com capital reduzido. Recomendamos um mínimo de R$ 3.000 a R$ 5.000 para ter uma gestão de risco adequada, mas você pode ajustar o valor por contrato conforme seu capital disponível.'
    },
    {
      question: 'Os robôs funcionam com qualquer corretora?',
      answer: 'Nossos robôs funcionam com qualquer corretora que seja compatível com o Profit da Nelogica ou MetaTrader 5. A maioria das corretoras brasileiras oferece suporte a essas plataformas gratuitamente.'
    },
    {
      question: 'O que é necessário para instalar os robôs?',
      answer: 'Você precisa ter o software Profit instalado (gratuito), uma conta em corretora compatível e seguir nosso tutorial de instalação. O processo leva cerca de 10 minutos e oferecemos suporte completo durante a instalação.'
    },
    {
      question: 'Como recebo suporte técnico?',
      answer: 'Oferecemos suporte via WhatsApp durante horário comercial, tutoriais em vídeo, documentação completa e comunidade de usuários. Nossa equipe ajuda com instalação, configuração e resolução de problemas técnicos.'
    },
    {
      question: 'Qual a diferença entre o Clube de Robôs e o Copy Trade?',
      answer: 'No Clube de Robôs você baixa e instala os robôs em sua própria conta, tendo controle total. No Copy Trade, você replica automaticamente as operações de traders experientes sem precisar instalar nada.'
    },
    {
      question: 'Os robôs são compatíveis com Mesa Proprietária?',
      answer: 'Sim, nossos robôs são totalmente compatíveis com operações de mesa proprietária. Muitos de nossos clientes utilizam os robôs em mesas prop, respeitando as regras específicas de cada mesa.'
    },
    {
      question: 'Qual o retorno médio que posso esperar?',
      answer: 'Os resultados variam conforme o mercado, capital e configuração, mas nossos robôs têm potencial para gerar entre 20% e 40% ao mês em condições favoráveis. Importante ressaltar que resultados passados não garantem retornos futuros.'
    }
  ];

  const benefits = [
    {
      icon: <Bot className="w-6 h-6 text-blue-500" />,
      title: 'Automação 24/7',
      description: 'Robôs operam continuamente, mesmo quando você está dormindo'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-500" />,
      title: 'Estratégias Testadas',
      description: 'Algoritmos baseados em anos de backtesting e otimização'
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-500" />,
      title: 'Gestão de Risco',
      description: 'Stop loss, trailing stop e controles automáticos de risco'
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      title: 'Setup Rápido',
      description: 'Instalação em menos de 5 minutos com suporte completo'
    }
  ];

  const getPlanColor = (color: string) => {
    switch (color) {
      case 'purple': return 'from-purple-600 to-purple-700';
      case 'orange': return 'from-orange-600 to-orange-700';
      case 'gray': return 'from-gray-600 to-gray-700';
      default: return 'from-blue-600 to-blue-700';
    }
  };

  const getPlanBorderColor = (color: string) => {
    switch (color) {
      case 'purple': return 'border-purple-500';
      case 'orange': return 'border-orange-500';
      case 'gray': return 'border-gray-500';
      default: return 'border-blue-500';
    }
  };

  const handlePlanSelect = (plan: typeof plans[0]) => {
    if (plan.id === 'free') {
      // Free plan - open register modal
      onAuthClick('register');
    } else if (plan.id === 'pro') {
      // PRO plan - redirect to Stripe checkout
      window.open('https://buy.stripe.com/dR65nXfTSdnngmY8ww', '_blank');
    } else if (plan.id === 'master') {
      // MASTER plan - redirect to Stripe checkout
      window.open('https://buy.stripe.com/dR63fPfTSfvvb2EcMN', '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600/20 text-blue-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Pack de Robôs para Trading
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Escolha seu
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Pack de Robôs Ideal
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Automatize suas operações com Pack de Robôs da Estrategista Trading Solutions testados e otimizados. 
            Escolha o plano que melhor se adapta ao seu perfil de trader.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-12">
            <div className="bg-gray-800 rounded-lg p-1 flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
               Semestral
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Anual
                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                  -33%
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 bg-gray-950" id="plans-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-gray-900 rounded-2xl p-8 border-2 transition-all duration-300 hover:scale-105 ${
                  plan.popular 
                    ? `${getPlanBorderColor(plan.color)} shadow-lg shadow-${plan.color}-500/20` 
                    : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className={`bg-gradient-to-r ${getPlanColor(plan.color)} text-white px-6 py-2 rounded-full text-sm font-bold flex items-center`}>
                      <Star className="w-4 h-4 mr-1" />
                      MAIS POPULAR
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className="bg-gray-800 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    {plan.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-6">{plan.description}</p>
                  
                  <div className="mb-4">
                    {plan.originalPrice && (
                      <div className="text-gray-500 line-through text-lg mb-1">
                        R$ {billingCycle === 'monthly' ? plan.originalPrice.monthly : plan.originalPrice.yearly}
                        {billingCycle === 'yearly' ? '/ano' : '/sem'}
                      </div>
                    )}
                    <div className="text-4xl font-bold text-white">
                      {plan.price.monthly === 0 ? (
                        'Grátis'
                      ) : (
                        <>
                          R$ {billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                          <span className="text-lg text-gray-400">
                            {billingCycle === 'yearly' ? '/ano' : '/sem'}
                          </span>
                        </>
                      )}
                    </div>
                    {billingCycle === 'yearly' && plan.price.monthly > 0 && (
                      <div className="text-sm text-green-400 mt-1">
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold mr-2">
                          70% OFF
                        </span>
                        Desconto especial
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                      )}
                      <span className={feature.included ? 'text-white' : 'text-gray-500'}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full py-4 px-6 rounded-lg font-bold text-white transition-all duration-300 ${
                    plan.popular
                      ? `bg-gradient-to-r ${getPlanColor(plan.color)} hover:shadow-lg transform hover:scale-105`
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {plan.id !== 'free' && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold mr-2">
                      70% OFF
                    </span>
                  )}
                  {plan.cta}
                  <ArrowRight className="w-5 h-5 inline ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Detailed Plan Comparison */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Comparativo Completo de Planos
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Análise detalhada de todas as funcionalidades disponíveis em cada plano
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="text-left p-4 text-gray-300 font-medium">Funcionalidade</th>
                    <th className="p-4 text-gray-300 font-medium text-center">Starter</th>
                    <th className="p-4 text-gray-300 font-medium text-center bg-purple-900/30">PRO</th>
                    <th className="p-4 text-gray-300 font-medium text-center">MASTER</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Ativos */}
                  <tr className="border-t border-gray-700 bg-gray-800/50">
                    <td colSpan={4} className="p-4 font-semibold text-blue-400">Ativos e Mercados</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Mini Índice (WIN)</td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center bg-purple-900/10"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Mini Dólar (WDO)</td>
                    <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center bg-purple-900/10"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Ações</td>
                    <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center bg-purple-900/10"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Criptomoedas (BTC)</td>
                    <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center bg-purple-900/10"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  
                  {/* Horários */}
                  <tr className="border-t border-gray-700 bg-gray-800/50">
                    <td colSpan={4} className="p-4 font-semibold text-blue-400">Horários de Operação</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Manhã (9h-12h)</td>
                    <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center bg-purple-900/10"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Tarde (14h-17h)</td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center bg-purple-900/10"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Noite (após 17h)</td>
                    <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center bg-purple-900/10"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  
                  {/* Gestão de Risco */}
                  <tr className="border-t border-gray-700 bg-gray-800/50">
                    <td colSpan={4} className="p-4 font-semibold text-blue-400">Gestão de Risco</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Stop Loss Fixo</td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center bg-purple-900/10"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Trailing Stop</td>
                    <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center bg-purple-900/10"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Trailing Stop Avançado</td>
                    <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center bg-purple-900/10"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Breakeven</td>
                    <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center bg-purple-900/10"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Breakeven Avançado</td>
                    <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center bg-purple-900/10"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Stop Diário</td>
                    <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center bg-purple-900/10"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Zonas de Risco</td>
                    <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center bg-purple-900/10"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  
                  {/* Filtros */}
                  <tr className="border-t border-gray-700 bg-gray-800/50">
                    <td colSpan={4} className="p-4 font-semibold text-blue-400">Filtros e Indicadores</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Filtro de Horário</td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center bg-purple-900/10"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Filtro de Volume</td>
                    <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center bg-purple-900/10"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Filtro de Tendência</td>
                    <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center bg-purple-900/10"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Filtro de Volatilidade</td>
                    <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center bg-purple-900/10"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  
                  {/* Suporte */}
                  <tr className="border-t border-gray-700 bg-gray-800/50">
                    <td colSpan={4} className="p-4 font-semibold text-blue-400">Suporte e Atualizações</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Suporte Básico</td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center bg-purple-900/10"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Suporte Comunidade</td>
                    <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center bg-purple-900/10"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Suporte Técnico Direto</td>
                    <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center bg-purple-900/10"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Atualizações</td>
                    <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center bg-purple-900/10"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Acesso Prioritário</td>
                    <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center bg-purple-900/10"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  
                  {/* Limites */}
                  <tr className="border-t border-gray-700 bg-gray-800/50">
                    <td colSpan={4} className="p-4 font-semibold text-blue-400">Limites e Licenciamento</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Número de Contas</td>
                    <td className="p-4 text-center text-gray-300">1 conta</td>
                    <td className="p-4 text-center bg-purple-900/10 text-gray-300">1 conta</td>
                    <td className="p-4 text-center text-gray-300">1 conta</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Limite de Contratos WIN</td>
                    <td className="p-4 text-center text-gray-300">1 contrato</td>
                    <td className="p-4 text-center bg-purple-900/10 text-gray-300">10 contratos</td>
                    <td className="p-4 text-center text-gray-300">20 contratos</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Limite de Contratos WDO</td>
                    <td className="p-4 text-center text-gray-300">-</td>
                    <td className="p-4 text-center bg-purple-900/10 text-gray-300">5 contratos</td>
                    <td className="p-4 text-center text-gray-300">20 contratos</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-4 text-white">Licença Pessoal (CPF)</td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center bg-purple-900/10"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              * Todos os planos incluem acesso ao Profit Pro gratuito via Warren e módulo de automação gratuito
            </p>
          </div>
          
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => handlePlanSelect(plans[0])}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-bold transition-colors"
            >
              Começar Grátis
            </button>
            <button
              onClick={() => handlePlanSelect(plans[1])}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-bold transition-colors"
            >
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold mr-2">
                70% OFF
              </span>
              Assinar PRO
            </button>
            <button
              onClick={() => handlePlanSelect(plans[2])}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-bold transition-colors"
            >
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold mr-2">
                70% OFF
              </span>
              Assinar MASTER
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" id="beneficios-pack-robos">
              Benefícios do Pack de Robôs para Trading
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Tecnologia avançada, estratégias testadas e suporte completo para maximizar seus resultados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-800 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" id="faq-pack-robos">
              FAQ - Planos do Pack de Robôs
            </h2>
            <p className="text-xl text-gray-400">
              Tire suas dúvidas sobre nosso Pack de Robôs e planos
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800 transition-colors duration-200"
                >
                  <span className="font-semibold text-white">{faq.question}</span>
                  {expandedFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                {expandedFAQ === index && (
                  <div className="px-6 pb-4">
                    <div className="text-gray-300 leading-relaxed border-t border-gray-800 pt-4">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6" id="cta-automatizar">
            Comece a Automatizar suas Operações com Pack de Robôs
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a milhares de traders que já automatizaram seus resultados
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.open('https://wa.me/5511999999999?text=Olá! Gostaria de conhecer os planos do Pack de Robôs.', '_blank')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition-colors"
            >
              <MessageSquare className="w-5 h-5 inline mr-2" />
              Falar com Especialista
            </button>
            <button
              onClick={() => handlePlanSelect(plans[1])}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-bold transition-colors"
            >
              <Crown className="w-5 h-5 inline mr-2" />
              Começar com PRO
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlansPage;