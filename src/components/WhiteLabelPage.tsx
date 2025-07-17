import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, TrendingUp, CheckCircle, Target, Zap, Shield, Bot, Copy, ExternalLink, Smartphone, Globe, BarChart as ChartBar, Briefcase, Crown, Code, Database, Palette, DollarSign, MessageSquare, Settings, Monitor, Layers, FileText, X, Send, Mail, User, Phone, ChevronDown, ChevronUp } from 'lucide-react';

const WhiteLabelPage = () => {
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    message: ''
  });

  const targetAudience = [
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
      title: "Traders profissionais",
      description: "que desejam monetizar sua estratégia"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Influenciadores e educadores",
      description: "que desejam lançar um robô próprio"
    },
    {
      icon: <Building2 className="w-8 h-8 text-green-600" />,
      title: "Corretoras e mesas",
      description: "que buscam aumentar LTV e ticket médio"
    },
    {
      icon: <Monitor className="w-8 h-8 text-orange-600" />,
      title: "Plataformas de trading",
      description: "que precisam de execução automatizada"
    },
    {
      icon: <Copy className="w-8 h-8 text-red-600" />,
      title: "Startups de copy trade",
      description: "que querem operar sob marca própria"
    }
  ];

  const includedFeatures = [
    "Nome e logo personalizados",
    "Robô adaptado à sua estratégia",
    "Compatível com Profit, MT5 ou Web",
    "Proteção por CPF / login exclusivo",
    "Painel web ou API (opcional)",
    "Integração com Copy Invest (opcional)",
    "Setup de checkout e ativação",
    "Consultoria comercial e técnica",
    "Suporte contínuo ao parceiro",
    "Relatórios de uso e licenciamento"
  ];

  const models = [
    {
      id: "profit",
      icon: <ChartBar className="w-8 h-8 text-blue-600" />,
      title: "White Label para Profit",
      description: "Robô .pts com nome, logo e estratégia do parceiro",
      price: "A partir de R$ 5.000",
      features: [
        "Entrega em até 7 dias úteis",
        "Compatível com Profit gratuito + assessoria",
        "Instalação assistida e suporte ao cliente final",
        "Dashboard de controle (opcional)"
      ]
    },
    {
      id: "mt5",
      icon: <Code className="w-8 h-8 text-green-600" />,
      title: "MetaTrader 5 / BlackArrow", 
      description: "Código adaptado para execução em MT5 / BlackArrow",
      price: "A partir de R$ 8.000",
      features: [
        "Operação institucional ou varejo",
        "Integração via API ou painel do parceiro",
        "Ideal para gestores ou corretoras"
      ]
    },
    {
      id: "webapp",
      icon: <Globe className="w-8 h-8 text-purple-600" />,
      title: "Web App + Dashboards",
      description: "Robô baseado em web (backend + painel)",
      price: "A partir de R$ 12.000",
      features: [
        "Checkout, painel de clientes, painel do trader",
        "Ideal para startups, comunidades ou plataformas de copy",
        "Suporte técnico + comercial incluído"
      ]
    }
  ];

  const differentials = [
    {
      icon: <Target className="w-6 h-6 text-blue-600" />,
      title: "Equipe com experiência real em estratégias vencedoras"
    },
    {
      icon: <Settings className="w-6 h-6 text-green-600" />,
      title: "Testes, validações e consultoria para escalar"
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-600" />,
      title: "Segurança jurídica e técnica (CPF, logs, bloqueio remoto)"
    },
    {
      icon: <Zap className="w-6 h-6 text-orange-600" />,
      title: "Time ágil com entrega sob demanda"
    },
    {
      icon: <Building2 className="w-6 h-6 text-red-600" />,
      title: "Suporte completo até o pós-lançamento"
    }
  ];

  const monetizationModels = [
    {
      icon: <DollarSign className="w-5 h-5 text-green-500" />,
      text: "Venda avulsa com ativação por CPF"
    },
    {
      icon: <Copy className="w-5 h-5 text-blue-500" />,
      text: "Assinaturas recorrentes (mensal / anual)"
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-purple-500" />,
      text: "Copy Trade com comissão integrada"
    },
    {
      icon: <Users className="w-5 h-5 text-orange-500" />,
      text: "Upsell com mentoria, comunidade ou educacional"
    },
    {
      icon: <Target className="w-5 h-5 text-red-500" />,
      text: "Afiliação com comissionamento automático"
    }
  ];

  const faqs = [
    {
      question: "Quanto tempo leva para desenvolver um White Label?",
      answer: "O prazo varia conforme a complexidade: Profit (7-14 dias), MT5/BlackArrow (14-21 dias), Web App completo (30-45 dias). Projetos simples podem ser entregues em até 1 semana."
    },
    {
      question: "Posso testar antes de fechar o projeto?",
      answer: "Sim! Oferecemos acesso de demonstração para você testar nosso sistema de ativação, licenciamento e operação antes de fechar o contrato."
    },
    {
      question: "Como funciona o licenciamento e proteção?",
      answer: "Cada robô é protegido por CPF/CNPJ ou sistema de login. Incluímos logs de uso, controle remoto de ativação/desativação e relatórios de licenciamento."
    },
    {
      question: "Vocês ajudam com a estratégia comercial?",
      answer: "Sim! Incluímos consultoria comercial para definir preços, modelo de negócio, estratégias de lançamento e crescimento do seu produto."
    },
    {
      question: "Qual o investimento necessário?",
      answer: "Projetos começam em R$ 5.000 (Profit básico) até R$ 15.000+ (Web App completo). O valor final depende das funcionalidades e complexidade desejadas."
    },
    {
      question: "Há suporte pós-lançamento?",
      answer: "Sim! Incluímos 3 meses de suporte técnico gratuito. Após esse período, oferecemos planos de manutenção e evolução contínua."
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Navigate to CreateSolution page instead of WhatsApp
    navigate('/criar-solucao');
    
    setShowContactModal(false);
    setContactForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      projectType: '',
      message: ''
    });
  };

  const handleDemoRequest = () => {
    const message = "Olá! Gostaria de solicitar um acesso de demonstração do sistema White Label.";
    const whatsappUrl = `https://wa.me/5511975333355?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setShowDemoModal(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Fundo Branco */}
      <section className="bg-white text-gray-900 overflow-hidden">
        <div className="mobile-container section-padding">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  <span className="block text-gray-900">Soluções White Label</span>
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tecnologia Personalizada</span>
                </h1>
                
                <h2 className="text-xl sm:text-2xl text-gray-700 mb-6 font-medium" id="subtitulo-white-label">
                  Tecnologia personalizada para empresas e profissionais do mercado financeiro
                </h2>
                
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  A Estrategista Solutions desenvolve tecnologia personalizada: gateways de pagamento, dashboards, 
                  painéis de controle, automações e produtos para o mercado financeiro — tudo com sua marca.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => navigate('/criar-solucao')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 touch-target"
                  >
                    <Settings className="w-5 h-5" />
                    <span>🔧 Solicitar Projeto Personalizado</span>
                  </button>
                  
                  <button 
                    onClick={() => window.open('https://wa.me/5511975333355?text=Olá! Gostaria de falar com um consultor sobre White Label.', '_blank')}
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 touch-target"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>💬 Falar com Consultor</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg">
                  <div className="bg-white rounded-xl p-6 shadow-md">
                    <Bot className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-2">White Label</div>
                      <div className="text-lg font-bold text-gray-900">Sua Marca</div>
                      <div className="text-sm text-gray-600">Sua Estratégia</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* O que é White Label */}
      <section className="section-padding bg-gray-50">
        <div className="mobile-container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6" id="o-que-e-white-label">O que é White Label da Estrategista Trading Solutions?</h2>
            
            <h3 className="text-xl sm:text-2xl text-gray-700 mb-8" id="tecnologia-marca-propria">
              Tecnologia personalizada com sua marca para empresas e profissionais
            </h3>
            
            <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                <strong>Você nos fornece suas necessidades e requisitos de negócio.</strong>
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                A Estrategista Solutions cuida de toda a engenharia, interface e implementação, entregando soluções completas com sua marca, prontas para escalar seu negócio.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                <strong>Você foca no seu core business — nós cuidamos da tecnologia.</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center space-x-3 mb-3">
                  <Target className="w-6 h-6 text-blue-600" />
                  <span className="font-semibold text-gray-900">🧠 Soluções adaptadas às suas necessidades</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center space-x-3 mb-3">
                  <Palette className="w-6 h-6 text-purple-600" />
                  <span className="font-semibold text-gray-900">🎨 Nome, marca e visual 100% personalizados</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center space-x-3 mb-3">
                  <Globe className="w-6 h-6 text-green-600" />
                  <span className="font-semibold text-gray-900">🔗 Dashboards, gateways de pagamento, sites e apps</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="w-6 h-6 text-orange-600" />
                  <span className="font-semibold text-gray-900">🛡️ Segurança e controle de acesso personalizados</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md md:col-span-2 lg:col-span-1">
                <div className="flex items-center space-x-3 mb-3">
                  <TrendingUp className="w-6 h-6 text-red-600" />
                  <span className="font-semibold text-gray-900">📈 Automações corporativas e soluções financeiras</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Para quem é indicado */}
      <section className="section-padding bg-white">
        <div className="mobile-container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12" id="publico-alvo-white-label">Para Quem São Nossas Soluções White Label?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {targetAudience.map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8 text-center hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-white rounded-full p-4 w-20 h-20 mx-auto mb-6 shadow-md">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modelos disponíveis */}
      <section className="section-padding bg-gray-50">
        <div className="mobile-container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12" id="modelos-white-label">Soluções White Label Disponíveis</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {models.map((model, index) => (
                <div key={model.id} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                  <div className="text-center mb-6">
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full p-4 w-20 h-20 mx-auto mb-4">
                      {model.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{model.title}</h3>
                    <p className="text-gray-600 mb-4">{model.description}</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {model.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => navigate('/criar-solucao')}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300"
                  >
                    Solicitar Orçamento
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* O que está incluído */}
      <section className="section-padding bg-white">
        <div className="mobile-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12" id="funcionalidades-incluidas">Funcionalidades Disponíveis nas Soluções White Label</h2>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <h3 className="text-xl font-bold text-white text-center" id="lista-funcionalidades">Ampla Gama de Funcionalidades</h3>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {includedFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-800">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="section-padding bg-gray-50">
        <div className="mobile-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12" id="diferenciais-estrategista-trading">Diferenciais da Estrategista Trading Solutions</h2>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12" id="diferenciais-estrategista-solutions">Diferenciais da Estrategista Solutions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {differentials.map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-3">
                      {item.icon}
                    </div>
                    <span className="text-gray-800 font-medium">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modelos de Monetização */}
      <section className="section-padding bg-white">
        <div className="mobile-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-8" id="modelos-monetizacao">Modelos de Monetização para Soluções White Label</h2>
            
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {monetizationModels.map((model, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    {model.icon}
                    <span className="text-gray-800">{model.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-gray-50">
        <div className="mobile-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12" id="faq-white-label">FAQ - Soluções White Label</h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="font-semibold text-gray-800">{faq.question}</span>
                    {expandedFAQ === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  
                  {expandedFAQ === index && (
                    <div className="px-6 pb-4">
                      <div className="text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Copy Invest */}
      <section className="section-padding bg-white">
        <div className="mobile-container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <Copy className="w-12 h-12 text-blue-600 mx-auto mb-6" />
              
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">🔁 Copy Invest</h2>
              
              <p className="text-lg text-gray-700 mb-8">
                Se preferir, você também pode simplesmente copiar nossas estratégias direto do Profit. 
                Use o Copy Invest da Nelogica com 1 clique.
              </p>
              
              <button 
                onClick={() => window.open('https://www.nelogica.com.br/copy-invest/copy-invest-profit-estrategista-portf%C3%B3lio-de-ia', '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 mx-auto"
              >
                <ExternalLink className="w-5 h-5" />
                <span>🔗 Acessar Copy Invest</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Acesso de Demonstração */}
      <section className="section-padding bg-gray-50">
        <div className="mobile-container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200">
              <FileText className="w-12 h-12 text-orange-600 mx-auto mb-6" />
              
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">🧪 Acesso de Demonstração</h2>
              
              <p className="text-lg text-gray-700 mb-8">
                Você pode testar nosso sistema de ativação, licenciamento e operação antes de fechar seu projeto.
              </p>
              
              <button 
                onClick={() => setShowDemoModal(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                🧪 Solicitar Acesso de Demonstração
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section-padding bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
        <div className="mobile-container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">📞 Pronto para automatizar sua operação?</h2>
            
            <p className="text-xl text-blue-100 mb-8">
              A Estrategista Trading Solutions desenvolve soluções personalizadas para empresas: gateways de pagamento, dashboards, 
              painéis de controle, automações corporativas e produtos para o mercado financeiro — tudo com sua marca.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <button 
                onClick={() => navigate('/criar-solucao')}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 touch-target"
              >
                <Settings className="w-5 h-5" />
                <span>📩 Automatize Sua Operação</span>
              </button>
              
              <button 
                onClick={() => window.open('https://wa.me/5511975333355?text=Olá! Gostaria de falar com um consultor sobre White Label.', '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 touch-target"
              >
                <MessageSquare className="w-5 h-5" />
                <span>💬 Falar com Especialista</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Solicitar Projeto White Label
              </h2>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleContactSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="h-4 w-4 inline mr-1" />
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="h-4 w-4 inline mr-1" />
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={contactForm.phone}
                  onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  <Building2 className="h-4 w-4 inline mr-1" />
                  Empresa/Projeto
                </label>
                <input
                  type="text"
                  id="company"
                  value={contactForm.company}
                  onChange={(e) => setContactForm(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome da empresa ou projeto"
                />
              </div>

              <div>
                <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Projeto *
                </label>
                <select
                  id="projectType"
                  required
                  value={contactForm.projectType}
                  onChange={(e) => setContactForm(prev => ({ ...prev, projectType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione o tipo</option>
                  <option value="profit">White Label para Profit</option>
                  <option value="mt5">MetaTrader 5 / BlackArrow</option>
                  <option value="webapp">Web App + Dashboards</option>
                  <option value="custom">Projeto Personalizado</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Descreva seu projeto
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Conte-nos sobre sua estratégia, público-alvo e objetivos..."
                />
              </div>

              <button
                type="submit"
                onClick={() => navigate('/criar-solucao')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Enviar via WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Solicitar Demonstração
              </h2>
              <button
                onClick={() => setShowDemoModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <FileText className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <p className="text-gray-700">
                  Solicite acesso de demonstração para conhecer nossas soluções antes de fechar o projeto.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleDemoRequest}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Solicitar via WhatsApp
                </button>
                
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhiteLabelPage;