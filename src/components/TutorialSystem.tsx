import React, { useState } from 'react';
import { ArrowLeft, Play, CheckCircle, ChevronRight, Clock, Users, Star, Wrench, Lightbulb, FileText, Bot, Settings, Shield, BarChart3, MessageSquare } from 'lucide-react';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'interactive';
  completed?: boolean;
  steps?: TutorialStep[];
  icon: React.ReactNode;
}

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  image?: string;
  completed?: boolean;
}

interface TutorialSystemProps {
  onBack: () => void;
}

export function TutorialSystem({ onBack }: TutorialSystemProps) {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTechnicalManual, setShowTechnicalManual] = useState(false);
  const [selectedManualSection, setSelectedManualSection] = useState(0);

  const tutorials: Tutorial[] = [
    {
      id: 'quick-start',
      title: '🚀 Início Rápido',
      description: 'Configure seu primeiro robô em menos de 5 minutos',
      duration: '5 min',
      difficulty: 'beginner',
      type: 'interactive',
      icon: <Play className="w-8 h-8 text-green-500" />,
      steps: [
        {
          id: 'step-1',
          title: '1. Download do Profit',
          content: 'Primeiro, você precisa ter o software Profit instalado. Baixe a versão mais recente do site oficial da Nelogica: www.nelogica.com.br/profit',
          completed: false
        },
        {
          id: 'step-2',
          title: '2. Download do Robô',
          content: 'Na área de membros, vá em "Meus Robôs" e clique no botão "Baixar Robô" do robô desejado. O arquivo .pts será baixado.',
          completed: false
        },
        {
          id: 'step-3',
          title: '3. Instalação no Profit',
          content: 'Abra o Profit, vá no menu "Robôs" > "Gerenciar Robôs" > "Importar" e selecione o arquivo .pts baixado.',
          completed: false
        },
        {
          id: 'step-4',
          title: '4. Configuração Básica',
          content: 'Configure o valor por contrato (ex: R$ 1000), defina o horário de operação e configure seu stop loss conforme sua estratégia.',
          completed: false
        },
        {
          id: 'step-5',
          title: '5. Ativação',
          content: 'Clique em "Ativar" no robô. Ele começará a operar automaticamente nos horários definidos. Mantenha o Profit aberto!',
          completed: false
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: '🔧 Solução de Problemas',
      description: 'Resolva os problemas mais comuns rapidamente',
      duration: '8 min',
      difficulty: 'intermediate',
      type: 'interactive',
      icon: <Wrench className="w-8 h-8 text-orange-500" />,
      steps: [
        {
          id: 'problem-1',
          title: '1. Robô não opera',
          content: 'Verifique: 1) Profit está conectado à corretora, 2) Horário de operação configurado corretamente, 3) Robô está ativado (botão verde), 4) Conta tem saldo suficiente.',
          completed: false
        },
        {
          id: 'problem-2',
          title: '2. Erro de importação',
          content: 'Se der erro ao importar: 1) Verifique se é arquivo .pts, 2) Baixe novamente da área de membros, 3) Reinicie o Profit, 4) Execute como administrador.',
          completed: false
        },
        {
          id: 'problem-3',
          title: '3. Robô para de operar',
          content: 'Causas comuns: 1) Perda de conexão com internet, 2) Stop diário atingido, 3) Profit foi fechado, 4) Computador entrou em modo sleep.',
          completed: false
        },
        {
          id: 'problem-4',
          title: '4. Performance baixa',
          content: 'Para melhorar: 1) Verifique latência da internet, 2) Use VPS se possível, 3) Não altere configurações durante mercado aberto, 4) Respeite o horário recomendado.',
          completed: false
        },
        {
          id: 'problem-5',
          title: '5. Suporte Técnico',
          content: 'Se problemas persistirem: Entre em contato via WhatsApp com: Nome do robô, print da tela de erro, versão do Profit e descrição detalhada.',
          completed: false
        }
      ]
    },
    {
      id: 'optimization',
      title: '📈 Otimização de Robôs',
      description: 'Maximize a performance dos seus robôs',
      duration: '12 min',
      difficulty: 'advanced',
      type: 'interactive',
      icon: <Lightbulb className="w-8 h-8 text-purple-500" />,
      steps: [
        {
          id: 'opt-1',
          title: '1. Gestão de Risco',
          content: 'Configure stop loss adequado (2-3% do capital), defina valor por contrato conservador (máx 5% da conta), use trailing stop quando disponível.',
          completed: false
        },
        {
          id: 'opt-2',
          title: '2. Horários Otimizados',
          content: 'Opere nos horários de maior liquidez: 9h-11h e 14h-17h. Evite 12h-14h (almoço) e após 17h30. Ajuste conforme volatilidade do mercado.',
          completed: false
        },
        {
          id: 'opt-3',
          title: '3. Configuração de VPS',
          content: 'Use VPS com latência <50ms, Windows Server, mínimo 2GB RAM. Configure auto-start do Profit, mantenha sempre conectado, monitore consumo.',
          completed: false
        },
        {
          id: 'opt-4',
          title: '4. Monitoramento',
          content: 'Acompanhe diariamente: número de operações, win rate, profit factor, drawdown máximo. Ajuste parâmetros mensalmente baseado nos resultados.',
          completed: false
        },
        {
          id: 'opt-5',
          title: '5. Estratégias Avançadas',
          content: 'Para usuários PRO: Combine múltiplos robôs, diversifique horários, use correlação negativa, implemente gestão dinâmica de risco.',
          completed: false
        }
      ]
    }
  ];

  const technicalManual = {
    id: 'technical-manual',
    title: '📋 Manual Técnico',
    description: 'Guia completo de especificações e configurações técnicas',
    duration: '15 min',
    difficulty: 'intermediate' as const,
    type: 'interactive' as const,
    icon: <FileText className="w-8 h-8 text-blue-500" />,
    sections: [
      {
        id: 'overview',
        title: 'Visão Geral dos Robôs Scalper',
        content: {
          description: 'Os robôs Scalper 1, 2 e 3 são sistemas automatizados desenvolvidos para operações de alta frequência no mercado brasileiro.',
          specifications: [
            { label: 'Plataforma Principal', value: 'Profit (Nelogica)' },
            { label: 'Mercados Suportados', value: 'WIN, WDO, Ações' },
            { label: 'Timeframes', value: '1M, 3M, 5M, 1H' },
            { label: 'Tipo de Estratégia', value: 'Scalping Automatizado' },
            { label: 'Execução', value: 'Totalmente Automatizada' }
          ],
          features: [
            'Parâmetros totalmente personalizáveis',
            'Execução perfeita e precisa',
            'Setup flexível para diferentes perfis',
            'Controle total sobre configurações',
            'Performance máxima otimizada'
          ]
        }
      },
      {
        id: 'technical-specs',
        title: 'Especificações Técnicas',
        content: {
          description: 'Requisitos técnicos e especificações detalhadas para operação otimizada dos robôs.',
          specifications: [
            { label: 'Sistema Operacional', value: 'Windows 10/11 (64-bit)' },
            { label: 'RAM Mínima', value: '4GB (Recomendado: 8GB)' },
            { label: 'Processador', value: 'Intel i3 ou AMD equivalente' },
            { label: 'Conexão Internet', value: 'Banda larga estável' },
            { label: 'Latência Máxima', value: '< 50ms (Ideal: < 20ms)' },
            { label: 'Espaço em Disco', value: '2GB livres' }
          ],
          features: [
            'Compatível com VPS Windows',
            'Suporte a múltiplas contas',
            'Backup automático de configurações',
            'Logs detalhados de operações',
            'Monitoramento em tempo real'
          ]
        }
      },
      {
        id: 'risk-management',
        title: 'Sistema de Gestão de Risco',
        content: {
          description: 'Controles avançados de risco integrados para proteção do capital e otimização de resultados.',
          specifications: [
            { label: 'Stop Loss', value: 'Configurável por pontos/R$' },
            { label: 'Trailing Stop', value: 'Dinâmico e personalizável' },
            { label: 'Breakeven', value: 'Automático após lucro' },
            { label: 'Stop Diário', value: 'Limite de perda/ganho' },
            { label: 'Meta Diária', value: 'Objetivo configurável' },
            { label: 'Controle de Drawdown', value: 'Proteção automática' }
          ],
          features: [
            'Stop loss por pontos ou valor financeiro',
            'Trailing stop com incremento personalizável',
            'Breakeven automático configurável',
            'Controle de horário de operação',
            'Limite máximo de contratos simultâneos',
            'Proteção contra gaps de mercado'
          ]
        }
      },
      {
        id: 'advanced-config',
        title: 'Configuração Avançada',
        content: {
          description: 'Parâmetros avançados para personalização completa da estratégia de trading.',
          specifications: [
            { label: 'Horário de Operação', value: '09:00 - 17:30 (Configurável)' },
            { label: 'Filtros de Mercado', value: 'Volume, Volatilidade, Tendência' },
            { label: 'Tamanho de Posição', value: '1-20 contratos (WIN/WDO)' },
            { label: 'Intervalo entre Operações', value: 'Configurável (segundos)' },
            { label: 'Modo de Entrada', value: 'Market, Limit, Stop' },
            { label: 'Gestão de Posição', value: 'Parcial ou Total' }
          ],
          features: [
            'Configuração de horários específicos',
            'Filtros de volatilidade do mercado',
            'Ajuste de agressividade da estratégia',
            'Controle de frequência de operações',
            'Personalização de sinais de entrada',
            'Gestão inteligente de posições'
          ]
        }
      },
      {
        id: 'monitoring',
        title: 'Monitoramento e Relatórios',
        content: {
          description: 'Sistema completo de acompanhamento de performance e geração de relatórios detalhados.',
          specifications: [
            { label: 'Relatórios', value: 'Diário, Semanal, Mensal' },
            { label: 'Métricas', value: 'Win Rate, Profit Factor, Drawdown' },
            { label: 'Alertas', value: 'WhatsApp, Email, Telegram' },
            { label: 'Dashboard', value: 'Tempo real via web' },
            { label: 'Backup', value: 'Automático na nuvem' },
            { label: 'Histórico', value: 'Ilimitado' }
          ],
          features: [
            'Dashboard em tempo real',
            'Relatórios automáticos por email',
            'Alertas personalizáveis',
            'Análise de performance detalhada',
            'Backup automático de dados',
            'Exportação para Excel/PDF'
          ]
        }
      }
    ]
  };
  const handleStepComplete = (stepIndex: number) => {
    if (selectedTutorial?.steps) {
      const updatedSteps = [...selectedTutorial.steps];
      updatedSteps[stepIndex].completed = true;
      setSelectedTutorial({
        ...selectedTutorial,
        steps: updatedSteps
      });
    }
  };

  if (selectedTutorial) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSelectedTutorial(null)}
            className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">{selectedTutorial.title}</h1>
            <p className="text-gray-400 text-lg">Aprenda a configurar e otimizar os produtos da Estrategista Trading Solutions</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex justify-between text-sm text-gray-400 mb-3">
            <span>Progresso</span>
            <span>{currentStep + 1} de {selectedTutorial.steps?.length}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / (selectedTutorial.steps?.length || 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Current Step */}
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
          <h3 className="text-2xl font-semibold text-white mb-6">
            {selectedTutorial.steps?.[currentStep]?.title}
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            {selectedTutorial.steps?.[currentStep]?.content}
          </p>

          {/* Step Actions */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
            >
              ← Anterior
            </button>

            <div className="flex space-x-4">
              <button
                onClick={() => handleStepComplete(currentStep)}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <CheckCircle className="w-5 h-5 inline mr-2" />
                Concluído
              </button>

              <button
                onClick={() => setCurrentStep(Math.min((selectedTutorial.steps?.length || 1) - 1, currentStep + 1))}
                disabled={currentStep === (selectedTutorial.steps?.length || 1) - 1}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Próximo →
              </button>
            </div>
          </div>
        </div>

        {/* All Steps Overview */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h4 className="text-xl font-semibold text-white mb-4">Todos os Passos:</h4>
          <div className="space-y-3">
            {selectedTutorial.steps?.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                  index === currentStep
                    ? 'border-blue-600 bg-blue-900/30'
                    : step.completed
                    ? 'border-green-600 bg-green-900/30'
                    : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{step.title}</span>
                  {step.completed && <CheckCircle className="w-5 h-5 text-green-400" />}
                  {index === currentStep && !step.completed && <div className="w-3 h-3 bg-blue-400 rounded-full"></div>}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-400" />
        </button>
        <div>
          <h1 className="text-4xl font-bold text-white">Tutoriais</h1>
          <p className="text-gray-400 text-lg">Aprenda a configurar e otimizar seus robôs</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600/20 rounded-lg">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">25 min</div>
              <div className="text-gray-400">Tempo total</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-600/20 rounded-lg">
              <Users className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">2.500+</div>
              <div className="text-gray-400">Usuários treinados</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-600/20 rounded-lg">
              <Star className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">4.8/5</div>
              <div className="text-gray-400">Avaliação média</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tutorials.map((tutorial) => (
          <div
            key={tutorial.id}
            className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/20 cursor-pointer group"
            onClick={() => setSelectedTutorial(tutorial)}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="bg-gray-800 rounded-full p-6 w-20 h-20 mx-auto mb-4 group-hover:bg-gray-700 transition-colors">
                {tutorial.icon}
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                tutorial.difficulty === 'beginner' ? 'bg-green-900/50 text-green-300' :
                tutorial.difficulty === 'intermediate' ? 'bg-orange-900/50 text-orange-300' :
                'bg-purple-900/50 text-purple-300'
              }`}>
                {tutorial.difficulty === 'beginner' ? 'Iniciante' :
                 tutorial.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
              </span>
            </div>

            {/* Content */}
            <h3 className="text-xl font-semibold text-white mb-3 text-center">
              {tutorial.title}
            </h3>
            
            <p className="text-gray-300 text-sm mb-6 leading-relaxed text-center">
              {tutorial.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">{tutorial.duration}</span>
              <ChevronRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Support CTA */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-3">Precisa de ajuda personalizada?</h3>
        <p className="text-green-100 mb-6 text-lg">
          Nossa equipe técnica está disponível para ajudá-lo via WhatsApp
        </p>
        <button
          onClick={() => window.open('https://wa.me/5511975333355?text=Olá! Preciso de ajuda personalizada com os tutoriais.', '_blank')}
          className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors"
        >
          Falar com Suporte
        </button>
      </div>
    </div>
  );
}