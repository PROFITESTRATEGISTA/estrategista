import React, { useState } from 'react';
import { Calculator, Target, BarChart3, ArrowLeft } from 'lucide-react';

interface CalculatorData {
  capital: string;
  pontosStop: string;
  pontosAlvo: string;
  perdaMaxima: string;
  instrumento: 'WIN' | 'WDO' | 'BITFUT';
}

interface DayTradeCalculatorProps {
  onBack: () => void;
}

export function DayTradeCalculator({ onBack }: DayTradeCalculatorProps) {
  const [data, setData] = useState<CalculatorData>({
    capital: '',
    pontosStop: '',
    pontosAlvo: '',
    perdaMaxima: '2',
    instrumento: 'WIN'
  });

  const [results, setResults] = useState<any>(null);

  const instrumentMultipliers = {
    WIN: 0.2,
    WDO: 10,
    BITFUT: 0.1
  };

  const calculatePosition = () => {
    const capital = parseFloat(data.capital);
    const pontosStop = parseFloat(data.pontosStop);
    const pontosAlvo = parseFloat(data.pontosAlvo);
    const perdaMaxima = parseFloat(data.perdaMaxima);
    const multiplier = instrumentMultipliers[data.instrumento];

    if (!capital || !pontosStop || !pontosAlvo || !perdaMaxima) return;

    const perdaMaximaReais = (capital * perdaMaxima) / 100;
    const perdaPorContrato = pontosStop * multiplier;
    const contratos = Math.floor(perdaMaximaReais / perdaPorContrato);
    const ganhoPorContrato = pontosAlvo * multiplier;
    const ganhoTotal = contratos * ganhoPorContrato;
    const payoff = ganhoTotal / perdaMaximaReais;

    setResults({
      contratos,
      perdaMaximaReais,
      perdaPorContrato,
      ganhoTotal,
      payoff,
      ganhoPorContrato
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-400" />
        </button>
        <div>
          <h1 className="text-4xl font-bold text-white">Calculadora Day Trade</h1>
          <p className="text-gray-400 text-lg">Calculadora profissional de risco para futuros B3</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
            <Calculator className="h-5 w-5" />
            Parâmetros de Cálculo
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Capital Total (R$)
              </label>
              <input
                type="number"
                value={data.capital}
                onChange={(e) => setData({ ...data, capital: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 10000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Instrumento
              </label>
              <select
                value={data.instrumento}
                onChange={(e) => setData({ ...data, instrumento: e.target.value as 'WIN' | 'WDO' | 'BITFUT' })}
                className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="WIN">WIN (Mini Índice)</option>
                <option value="WDO">WDO (Mini Dólar)</option>
                <option value="BITFUT">BITFUT (Bitcoin Futuro)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Stop Loss (pontos)
              </label>
              <input
                type="number"
                value={data.pontosStop}
                onChange={(e) => setData({ ...data, pontosStop: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Take Profit (pontos)
              </label>
              <input
                type="number"
                value={data.pontosAlvo}
                onChange={(e) => setData({ ...data, pontosAlvo: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Perda Máxima (%)
              </label>
              <input
                type="number"
                value={data.perdaMaxima}
                onChange={(e) => setData({ ...data, perdaMaxima: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 2"
                step="0.1"
              />
            </div>

            <button
              onClick={calculatePosition}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Calcular Posição
            </button>
          </div>
        </div>

        {/* Resultados */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
            <BarChart3 className="h-5 w-5" />
            Resultados
          </h2>

          {results ? (
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                <div className="text-sm text-gray-300">Quantidade de Contratos</div>
                <div className="text-2xl font-bold text-white">{results.contratos}</div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                <div className="text-sm text-gray-300">Perda Máxima</div>
                <div className="text-2xl font-bold text-red-400">
                  R$ {results.perdaMaximaReais.toFixed(2)}
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                <div className="text-sm text-gray-300">Ganho Potencial</div>
                <div className="text-2xl font-bold text-green-400">
                  R$ {results.ganhoTotal.toFixed(2)}
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                <div className="text-sm text-gray-300">Payoff (Risco/Retorno)</div>
                <div className="text-2xl font-bold text-blue-400">
                  1:{results.payoff.toFixed(2)}
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                <div className="text-sm text-gray-300">Perda por Contrato</div>
                <div className="text-lg font-medium text-white">
                  R$ {results.perdaPorContrato.toFixed(2)}
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                <div className="text-sm text-gray-300">Ganho por Contrato</div>
                <div className="text-lg font-medium text-white">
                  R$ {results.ganhoPorContrato.toFixed(2)}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800/20 rounded-lg border border-gray-700/30">
              <Target className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                Preencha os parâmetros e clique em "Calcular Posição" para ver os resultados
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="bg-blue-900/20 rounded-xl p-8 border border-blue-600/30">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <Target className="w-6 h-6 text-blue-400" />
          Como usar a Calculadora
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
          <div className="space-y-3">
            <p>• <strong>Capital Total:</strong> Valor total disponível para trading</p>
            <p>• <strong>Stop Loss:</strong> Pontos de perda máxima por operação</p>
            <p>• <strong>Take Profit:</strong> Pontos de ganho alvo por operação</p>
          </div>
          <div className="space-y-3">
            <p>• <strong>Perda Máxima:</strong> % do capital que aceita perder</p>
            <p>• <strong>Payoff:</strong> Relação risco/retorno da operação</p>
            <p>• <strong>Contratos:</strong> Quantidade ideal para operar</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}