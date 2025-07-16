import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare, Search, Bot, Shield, TrendingUp, Clock, DollarSign, Settings, Users, HelpCircle } from 'lucide-react';

const FAQPage = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Todas', icon: <HelpCircle className="w-5 h-5" /> },
    { id: 'getting-started', name: 'Primeiros Passos', icon: <Bot className="w-5 h-5" /> },
    { id: 'plans', name: 'Planos e Preços', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'technical', name: 'Técnico', icon: <Settings className="w-5 h-5" /> },
    { id: 'trading', name: 'Trading', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'security', name: 'Segurança', icon: <Shield className="w-5 h-5" /> }
  ];

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'Como funcionam os robôs de trading?',
      answer: 'Nossos robôs são algoritmos automatizados que executam operações baseadas em estratégias pré-programadas. Eles analisam o mercado 24/7 usando indicadores técnicos, padrões de preço e volume para identificar oportunidades de entrada e saída. Quando as condições ideais são detectadas, o robô executa a operação automaticamente, sem necessidade de intervenção manual.',
      tags: ['robôs', 'automação', 'trading', 'algoritmo']
    },
    {
      id: 2,
      category: 'getting-started',
      question: 'Preciso ter experiência em trading para usar os robôs?',
      answer: 'Não é necessário ter experiência prévia em trading. Nossos robôs foram desenvolvidos para traders de todos os níveis, desde iniciantes até profissionais. Fornecemos tutoriais completos, configuração assistida, suporte técnico dedicado e documentação detalhada para garantir que você consiga operar mesmo sendo iniciante.',
      tags: ['iniciante', 'experiência', 'tutorial', 'suporte']
    },
    {
      id: 3,
      category: 'technical',
      question: 'Qual plataforma é necessária para usar os robôs?',
      answer: 'Nossos robôs funcionam principalmente no Profit da Nelogica (gratuito), que é nossa recomendação por ser confiável, gratuito e amplamente usado no Brasil. Também oferecemos versões para MetaTrader 5, BlackArrow e outras plataformas. Para projetos personalizados, desenvolvemos soluções web e APIs customizadas.',
      tags: ['profit', 'nelogica', 'metatrader', 'plataforma']
    },
    {
      id: 4,
      category: 'plans',
      question: 'Qual a diferença entre os planos Starter, Master e PRO?',
      answer: 'Starter (Grátis): Acesso ao Warren Combo e tutoriais básicos. Master (R$ 197/mês): 4 robôs premium otimizados (Take GO, Take 33, GR Global, Warren Combo completo). PRO (R$ 297/mês): Todos os 6 robôs + estratégias Hunter exclusivas (Pivot Hunter, Trap Hunter) + suporte VIP. Cada plano atende diferentes perfis e necessidades de traders.',
      tags: ['planos', 'preços', 'diferenças', 'robôs']
    },
    {
      id: 5,
      category: 'plans',
      question: 'Posso cancelar minha assinatura a qualquer momento?',
      answer: 'Sim, você pode cancelar sua assinatura a qualquer momento sem multas ou taxas adicionais. O acesso permanece ativo até o final do período já pago. Você pode reativar sua assinatura quando desejar, e todos os seus robôs e configurações estarão disponíveis novamente.',
      tags: ['cancelamento', 'assinatura', 'flexibilidade']
    },
    {
      id: 6,
      category: 'trading',
      question: 'Há garantia de lucro com os robôs?',
      answer: 'Trading envolve riscos inerentes e não podemos garantir lucros. No entanto, nossos robôs são baseados em estratégias testadas, backtesting extensivo e otimização contínua. Fornecemos histórico de performance transparente, mas é importante entender que resultados passados não garantem resultados futuros. Sempre recomendamos começar com valores pequenos e usar gestão de risco adequada.',
      tags: ['lucro', 'risco', 'garantia', 'performance']
    },
    {
      id: 7,
      category: 'technical',
      question: 'Como instalar e configurar os robôs?',
      answer: 'A instalação é simples: 1) Baixe o arquivo .pts da área de membros, 2) Abra o Profit, vá em Robôs > Gerenciar Robôs > Importar, 3) Configure valor por contrato, horários e stops, 4) Ative o robô. Fornecemos tutoriais em vídeo, documentação passo-a-passo e suporte técnico para auxiliar na configuração.',
      tags: ['instalação', 'configuração', 'tutorial', 'profit']
    },
    {
      id: 8,
      category: 'technical',
      question: 'Posso usar os robôs em conta demo primeiro?',
      answer: 'Sim, recomendamos fortemente testar em conta demo antes de operar com dinheiro real. Todos os nossos robôs funcionam perfeitamente em contas demo, permitindo que você se familiarize com o sistema, teste diferentes configurações e ganhe confiança antes de partir para operações reais.',
      tags: ['demo', 'teste', 'simulação', 'prática']
    },
    {
      id: 9,
      category: 'technical',
      question: 'Preciso deixar o computador ligado 24 horas?',
      answer: 'Para operação contínua, sim, o computador com o Profit deve permanecer ligado e conectado à internet. Alternativamente, recomendamos usar uma VPS (Servidor Virtual Privado) que fica online 24/7. Oferecemos orientação para configuração de VPS e parcerias com provedores confiáveis.',
      tags: ['vps', 'computador', '24h', 'servidor']
    },
    {
      id: 10,
      category: 'trading',
      question: 'Qual o valor mínimo para começar a operar?',
      answer: 'Recomendamos começar com pelo menos R$ 5.000 a R$ 10.000 para ter uma gestão de risco adequada. Com valores menores, configure contratos pequenos (R$ 500-1000 por operação). O importante é nunca arriscar mais de 2-3% do capital por operação e sempre usar stop loss.',
      tags: ['capital', 'valor mínimo', 'gestão de risco']
    },
    {
      id: 11,
      category: 'security',
      question: 'Os robôs são seguros? Como protegem meu dinheiro?',
      answer: 'Nossos robôs incluem múltiplas camadas de proteção: stop loss automático, controle de drawdown, limites diários de perda, trailing stop e breakeven. Eles operam apenas através da sua corretora regulamentada - nunca temos acesso ao seu dinheiro. Todas as operações são registradas e auditáveis.',
      tags: ['segurança', 'proteção', 'stop loss', 'risco']
    },
    {
      id: 12,
      category: 'technical',
      question: 'Como funciona o suporte técnico?',
      answer: 'Oferecemos suporte via WhatsApp para todos os planos, com prioridade para Master e PRO. Nossa equipe ajuda com: instalação e configuração, resolução de problemas técnicos, otimização de parâmetros, dúvidas sobre estratégias e orientação sobre melhores práticas. Horário de atendimento: 9h às 18h, dias úteis.',
      tags: ['suporte', 'whatsapp', 'ajuda', 'técnico']
    },
    {
      id: 13,
      category: 'trading',
      question: 'Posso modificar os parâmetros dos robôs?',
      answer: 'Sim, todos os robôs permitem ajustes de parâmetros como: valor por contrato, horários de operação, stops, targets, filtros de mercado e gestão de risco. Fornecemos orientação sobre quais parâmetros ajustar e como otimizar para seu perfil de risco. Mudanças devem ser feitas com cuidado e preferencialmente fora do horário de mercado.',
      tags: ['parâmetros', 'configuração', 'personalização', 'otimização']
    },
    {
      id: 14,
      category: 'plans',
      question: 'Posso fazer upgrade ou downgrade do meu plano?',
      answer: 'Sim, você pode alterar seu plano a qualquer momento. Para upgrade, a diferença é cobrada proporcionalmente. Para downgrade, o valor é creditado para o próximo ciclo. Entre em contato via WhatsApp para solicitar a alteração, e nossa equipe fará o ajuste imediatamente.',
      tags: ['upgrade', 'downgrade', 'mudança de plano']
    },
    {
      id: 15,
      category: 'trading',
      question: 'Os robôs operam em quais mercados e horários?',
      answer: 'Nossos robôs operam principalmente no mercado brasileiro (Bovespa) em índices como WIN (mini índice) e WDO (mini dólar). Horários recomendados: 9h-11h e 14h-17h (maior liquidez). O GR Global também opera em forex e criptomoedas. Evitamos horários de baixa liquidez como almoço (12h-14h) e após 17h30.',
      tags: ['mercados', 'horários', 'bovespa', 'índices']
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const quickActions = [
    {
      title: 'Começar Agora',
      description: 'Crie sua conta e comece com o plano Starter gratuito',
      icon: <Bot className="w-6 h-6 text-green-500" />,
      action: () => window.open('https://wa.me/5511999999999?text=Olá! Gostaria de começar com o plano Starter gratuito.', '_blank')
    },
    {
      title: 'Falar com Suporte',
      description: 'Tire suas dúvidas diretamente com nossa equipe',
      icon: <MessageSquare className="w-6 h-6 text-blue-500" />,
      action: () => window.open('https://wa.me/5511999999999?text=Olá! Tenho algumas dúvidas sobre os robôs de trading.', '_blank')
    },
    {
      title: 'Ver Tutoriais',
      description: 'Acesse nossos tutoriais completos e aprenda passo a passo',
      icon: <Clock className="w-6 h-6 text-purple-500" />,
      action: () => window.open('/', '_blank')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Central de
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ajuda
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12">
            Encontre respostas para suas dúvidas sobre os produtos da Estrategista Trading Solutions, planos e configurações
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por palavra-chave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Ações Rápidas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="bg-gray-800 hover:bg-gray-700 rounded-xl p-6 text-left transition-all duration-300 hover:scale-105 border border-gray-700 hover:border-gray-600"
              >
                <div className="flex items-center mb-4">
                  {action.icon}
                  <h3 className="text-lg font-semibold text-white ml-3">{action.title}</h3>
                </div>
                <p className="text-gray-400">{action.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {category.icon}
                <span className="ml-2">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Nenhuma pergunta encontrada</h3>
              <p className="text-gray-400 mb-6">Tente ajustar sua busca ou categoria</p>
              <button
                onClick={() => window.open('https://wa.me/5511999999999?text=Olá! Gostaria de começar com o plano Starter gratuito.', '_blank')}
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Ver Todas as Perguntas
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {filteredFAQs.length} pergunta{filteredFAQs.length !== 1 ? 's' : ''} encontrada{filteredFAQs.length !== 1 ? 's' : ''}
                </h2>
                {searchTerm && (
                  <p className="text-gray-400">
                    Resultados para: "<span className="text-blue-400">{searchTerm}</span>"
                  </p>
                )}
              </div>

              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800 transition-colors duration-200"
                    >
                      <span className="font-semibold text-white pr-4">{faq.question}</span>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    
                    {expandedFAQ === faq.id && (
                      <div className="px-6 pb-4">
                        <div className="text-gray-300 leading-relaxed border-t border-gray-800 pt-4 mb-4">
                          {faq.answer}
                        </div>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {faq.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Não encontrou sua resposta?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Nossa equipe está pronta para ajudar você com qualquer dúvida
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.open('https://wa.me/5511999999999?text=Olá! Tenho uma dúvida que não encontrei no FAQ.', '_blank')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition-colors flex items-center justify-center"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Falar com Suporte
            </button>
            
            <button
              onClick={() => window.open('mailto:contato@profitestrategista.com', '_blank')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold transition-colors flex items-center justify-center"
            >
              <Users className="w-5 h-5 mr-2" />
              Enviar Email
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;