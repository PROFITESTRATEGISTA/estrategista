import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  Calendar, 
  Users, 
  Building2, 
  ArrowLeft,
  Bot,
  Crown,
  Zap,
  User,
  Target,
  BarChart3,
  PieChart,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import supabase from '../lib/supabase';

// Interfaces específicas para Estrategista Solutions
interface ClientContract {
  id: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  plan_type: 'starter' | 'pro' | 'master' | 'robo-personalizado';
  billing_period: 'monthly' | 'semiannual' | 'annual';
  monthly_value: number;
  contract_start: string;
  contract_end: string;
  is_active: boolean;
  payment_method?: 'stripe' | 'pix' | 'boleto' | 'transferencia';
  created_at: string;
  updated_at: string;
}

interface BusinessCost {
  id: string;
  description: string;
  category: 'infraestrutura' | 'marketing' | 'desenvolvimento' | 'suporte' | 'operacional' | 'legal';
  amount: number;
  cost_date: string;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
}

interface FinancialPanelProps {
  onBack: () => void;
}

const FinancialPanel: React.FC<FinancialPanelProps> = ({ onBack }) => {
  // Estados principais
  const [contracts, setContracts] = useState<ClientContract[]>([]);
  const [costs, setCosts] = useState<BusinessCost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Estados dos modais
  const [showContractModal, setShowContractModal] = useState(false);
  const [showCostModal, setShowCostModal] = useState(false);
  const [editingContract, setEditingContract] = useState<ClientContract | null>(null);
  const [editingCost, setEditingCost] = useState<BusinessCost | null>(null);

  // Estados dos formulários
  const [contractForm, setContractForm] = useState({
    user_name: '',
    user_email: '',
    user_phone: '',
    plan_type: 'starter' as const,
    billing_period: 'monthly' as const,
    monthly_value: 0,
    contract_start: '',
    contract_end: '',
    payment_method: 'stripe' as const
  });

  const [costForm, setCostForm] = useState({
    description: '',
    category: 'operacional' as const,
    amount: 0,
    cost_date: new Date().toISOString().split('T')[0],
    is_recurring: false
  });

  // Filtros
  const [dateFilter, setDateFilter] = useState('current-month');
  const [planFilter, setPlanFilter] = useState('all');

  // Carregar dados iniciais
  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    setLoading(true);
    try {
      // Carregar contratos e custos do Supabase ou usar dados vazios
      if (supabase) {
        const [contractsResult, costsResult] = await Promise.all([
          supabase.from('client_contracts').select('*').order('created_at', { ascending: false }),
          supabase.from('financial_costs').select('*').order('cost_date', { ascending: false })
        ]);

        if (contractsResult.data) {
          setContracts(contractsResult.data);
        }
        if (costsResult.data) {
          setCosts(costsResult.data);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
      setError('Erro ao carregar dados. Sistema funcionando em modo offline.');
    } finally {
      setLoading(false);
    }
  };

  // Cálculos financeiros específicos da Estrategista Solutions
  const calculateMetrics = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Receita mensal por plano
    const activeContracts = contracts.filter(c => c.is_active);
    const monthlyRevenue = activeContracts.reduce((sum, contract) => {
      return sum + contract.monthly_value;
    }, 0);

    // Custos mensais recorrentes
    const recurringCosts = costs.filter(c => c.is_recurring);
    const monthlyCosts = recurringCosts.reduce((sum, cost) => sum + cost.amount, 0);

    // Custos do mês atual
    const currentMonthCosts = costs.filter(cost => {
      const costDate = new Date(cost.cost_date);
      return costDate.getMonth() === currentMonth && costDate.getFullYear() === currentYear;
    }).reduce((sum, cost) => sum + cost.amount, 0);

    // Distribuição por plano
    const planDistribution = {
      starter: activeContracts.filter(c => c.plan_type === 'starter').length,
      pro: activeContracts.filter(c => c.plan_type === 'pro').length,
      master: activeContracts.filter(c => c.plan_type === 'master').length,
      personalizado: activeContracts.filter(c => c.plan_type === 'robo-personalizado').length
    };

    // Receita por plano
    const revenueByPlan = {
      starter: activeContracts.filter(c => c.plan_type === 'starter').reduce((sum, c) => sum + c.monthly_value, 0),
      pro: activeContracts.filter(c => c.plan_type === 'pro').reduce((sum, c) => sum + c.monthly_value, 0),
      master: activeContracts.filter(c => c.plan_type === 'master').reduce((sum, c) => sum + c.monthly_value, 0),
      personalizado: activeContracts.filter(c => c.plan_type === 'robo-personalizado').reduce((sum, c) => sum + c.monthly_value, 0)
    };

    return {
      monthlyRevenue,
      monthlyCosts: monthlyCosts + currentMonthCosts,
      monthlyProfit: monthlyRevenue - (monthlyCosts + currentMonthCosts),
      activeContracts: activeContracts.length,
      planDistribution,
      revenueByPlan,
      totalCustomers: activeContracts.length,
      churnRate: 0 // Calcular baseado em cancelamentos
    };
  };

  const metrics = calculateMetrics();

  // Funções de CRUD para contratos
  const handleSaveContract = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!contractForm.user_name || !contractForm.user_email || !contractForm.contract_start || !contractForm.contract_end) {
        setError('Preencha todos os campos obrigatórios');
        return;
      }

      const contractData = {
        ...contractForm,
        is_active: true,
        updated_at: new Date().toISOString()
      };

      if (editingContract) {
        // Atualizar contrato existente
        if (supabase) {
          const { error } = await supabase
            .from('client_contracts')
            .update(contractData)
            .eq('id', editingContract.id);

          if (error) throw error;
        }

        setContracts(prev => prev.map(c => 
          c.id === editingContract.id ? { ...c, ...contractData } : c
        ));
        setSuccess('Contrato atualizado com sucesso!');
      } else {
        // Criar novo contrato
        const newContract = {
          id: Date.now().toString(),
          ...contractData,
          created_at: new Date().toISOString()
        };

        if (supabase) {
          const { error } = await supabase
            .from('client_contracts')
            .insert([newContract]);

          if (error) throw error;
        }

        setContracts(prev => [newContract, ...prev]);
        setSuccess('Contrato criado com sucesso!');
      }

      resetContractForm();
      setShowContractModal(false);
    } catch (error) {
      console.error('Erro ao salvar contrato:', error);
      setError('Erro ao salvar contrato. Tente novamente.');
    }
  };

  const handleDeleteContract = async (contractId: string) => {
    if (!confirm('Tem certeza que deseja excluir este contrato?')) {
      return;
    }

    try {
      if (supabase) {
        const { error } = await supabase
          .from('client_contracts')
          .delete()
          .eq('id', contractId);

        if (error) {
          console.error('Erro no Supabase ao excluir contrato:', error);
          throw error;
        }
      }

      // Atualizar estado local
      setContracts(prev => prev.filter(c => c.id !== contractId));
      setSuccess('Contrato excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir contrato:', error);
      // Mesmo com erro no Supabase, remover do estado local
      setContracts(prev => prev.filter(c => c.id !== contractId));
      setError('Contrato removido localmente. Erro na sincronização com banco de dados.');
    }
  };

  // Funções de CRUD para custos
  const handleSaveCost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!costForm.description || !costForm.amount || !costForm.cost_date) {
        setError('Preencha todos os campos obrigatórios');
        return;
      }

      const costData = {
        ...costForm,
        updated_at: new Date().toISOString()
      };

      if (editingCost) {
        // Atualizar custo existente
        if (supabase) {
          const { error } = await supabase
            .from('financial_costs')
            .update(costData)
            .eq('id', editingCost.id);

          if (error) throw error;
        }

        setCosts(prev => prev.map(c => 
          c.id === editingCost.id ? { ...c, ...costData } : c
        ));
        setSuccess('Custo atualizado com sucesso!');
      } else {
        // Criar novo custo
        const newCost = {
          id: Date.now().toString(),
          ...costData,
          created_at: new Date().toISOString()
        };

        if (supabase) {
          const { error } = await supabase
            .from('financial_costs')
            .insert([newCost]);

          if (error) throw error;
        }

        setCosts(prev => [newCost, ...prev]);
        setSuccess('Custo adicionado com sucesso!');
      }

      resetCostForm();
      setShowCostModal(false);
    } catch (error) {
      console.error('Erro ao salvar custo:', error);
      setError('Erro ao salvar custo. Tente novamente.');
    }
  };

  const handleDeleteCost = async (costId: string) => {
    if (!confirm('Tem certeza que deseja excluir este custo?')) {
      return;
    }

    try {
      if (supabase) {
        const { error } = await supabase
          .from('financial_costs')
          .delete()
          .eq('id', costId);

        if (error) throw error;
      }

      setCosts(prev => prev.filter(c => c.id !== costId));
      setSuccess('Custo excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir custo:', error);
      setCosts(prev => prev.filter(c => c.id !== costId));
      setError('Custo removido localmente. Erro na sincronização.');
    }
  };

  // Funções auxiliares
  const resetContractForm = () => {
    setContractForm({
      user_name: '',
      user_email: '',
      user_phone: '',
      plan_type: 'starter',
      billing_period: 'monthly',
      monthly_value: 0,
      contract_start: '',
      contract_end: '',
      payment_method: 'stripe'
    });
    setEditingContract(null);
  };

  const resetCostForm = () => {
    setCostForm({
      description: '',
      category: 'operacional',
      amount: 0,
      cost_date: new Date().toISOString().split('T')[0],
      is_recurring: false
    });
    setEditingCost(null);
  };

  const openEditContract = (contract: ClientContract) => {
    setContractForm({
      user_name: contract.user_name,
      user_email: contract.user_email,
      user_phone: contract.user_phone || '',
      plan_type: contract.plan_type,
      billing_period: contract.billing_period,
      monthly_value: contract.monthly_value,
      contract_start: contract.contract_start,
      contract_end: contract.contract_end,
      payment_method: contract.payment_method || 'stripe'
    });
    setEditingContract(contract);
    setShowContractModal(true);
  };

  const openEditCost = (cost: BusinessCost) => {
    setCostForm({
      description: cost.description,
      category: cost.category,
      amount: cost.amount,
      cost_date: cost.cost_date,
      is_recurring: cost.is_recurring
    });
    setEditingCost(cost);
    setShowCostModal(true);
  };

  // Funções de formatação
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getPlanDisplayName = (plan: string) => {
    const planNames = {
      'starter': 'Starter (Gratuito)',
      'pro': 'PRO',
      'master': 'MASTER',
      'robo-personalizado': 'Robô Personalizado'
    };
    return planNames[plan as keyof typeof planNames] || plan;
  };

  const getPlanColor = (plan: string) => {
    const colors = {
      'starter': 'bg-gray-100 text-gray-800',
      'pro': 'bg-purple-100 text-purple-800',
      'master': 'bg-orange-100 text-orange-800',
      'robo-personalizado': 'bg-blue-100 text-blue-800'
    };
    return colors[plan as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getBillingDisplayName = (period: string) => {
    const periods = {
      'monthly': 'Mensal',
      'semiannual': 'Semestral',
      'annual': 'Anual'
    };
    return periods[period as keyof typeof periods] || period;
  };

  const getCategoryDisplayName = (category: string) => {
    const categories = {
      'infraestrutura': 'Infraestrutura',
      'marketing': 'Marketing',
      'desenvolvimento': 'Desenvolvimento',
      'suporte': 'Suporte',
      'operacional': 'Operacional',
      'legal': 'Legal'
    };
    return categories[category as keyof typeof categories] || category;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-400" />
              </button>
              <DollarSign className="w-8 h-8 text-green-400" />
              <div>
                <h1 className="text-xl font-bold text-white">Painel Financeiro</h1>
                <p className="text-sm text-gray-400">Estrategista Solutions</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={loadFinancialData}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium text-white"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Atualizar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-600/30 text-red-400 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-900/20 border border-green-600/30 text-green-400 px-4 py-3 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {success}
            <button onClick={() => setSuccess(null)} className="ml-auto text-green-400 hover:text-green-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Receita Mensal</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(metrics.monthlyRevenue)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Custos Mensais</p>
                <p className="text-2xl font-bold text-red-400">
                  {formatCurrency(metrics.monthlyCosts)}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Lucro Mensal</p>
                <p className={`text-2xl font-bold ${metrics.monthlyProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(metrics.monthlyProfit)}
                </p>
              </div>
              <Calculator className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Clientes Ativos</p>
                <p className="text-2xl font-bold text-purple-400">{metrics.activeContracts}</p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Distribuição por Plano */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Distribuição por Plano
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">Starter (Gratuito)</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{metrics.planDistribution.starter} clientes</div>
                  <div className="text-gray-400 text-sm">{formatCurrency(metrics.revenueByPlan.starter)}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Crown className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-300">PRO</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{metrics.planDistribution.pro} clientes</div>
                  <div className="text-purple-400 text-sm">{formatCurrency(metrics.revenueByPlan.pro)}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-orange-400" />
                  <span className="text-gray-300">MASTER</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{metrics.planDistribution.master} clientes</div>
                  <div className="text-orange-400 text-sm">{formatCurrency(metrics.revenueByPlan.master)}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">Robô Personalizado</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{metrics.planDistribution.personalizado} clientes</div>
                  <div className="text-blue-400 text-sm">{formatCurrency(metrics.revenueByPlan.personalizado)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Métricas de Negócio
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-300">Ticket Médio</span>
                <span className="text-white font-medium">
                  {formatCurrency(metrics.activeContracts > 0 ? metrics.monthlyRevenue / metrics.activeContracts : 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Margem de Lucro</span>
                <span className={`font-medium ${metrics.monthlyProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {metrics.monthlyRevenue > 0 ? ((metrics.monthlyProfit / metrics.monthlyRevenue) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Custo por Cliente</span>
                <span className="text-white font-medium">
                  {formatCurrency(metrics.activeContracts > 0 ? metrics.monthlyCosts / metrics.activeContracts : 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">ROI Mensal</span>
                <span className={`font-medium ${metrics.monthlyProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {metrics.monthlyCosts > 0 ? ((metrics.monthlyProfit / metrics.monthlyCosts) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Contratos */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 mb-8">
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Contratos de Clientes ({contracts.length})
              </h2>
              <button
                onClick={() => {
                  resetContractForm();
                  setShowContractModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Contrato</span>
              </button>
            </div>
          </div>

          {contracts.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">Nenhum contrato cadastrado</h3>
              <p className="text-gray-500 mb-4">Adicione o primeiro contrato de cliente para começar</p>
              <button
                onClick={() => setShowContractModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Adicionar Primeiro Contrato
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Plano</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Período</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Vigência</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {contracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-white">{contract.user_name}</div>
                          <div className="text-sm text-gray-400">{contract.user_email}</div>
                          {contract.user_phone && (
                            <div className="text-xs text-gray-500">{contract.user_phone}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPlanColor(contract.plan_type)}`}>
                          {getPlanDisplayName(contract.plan_type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {getBillingDisplayName(contract.billing_period)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-green-400">
                        {formatCurrency(contract.monthly_value)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        <div>{new Date(contract.contract_start).toLocaleDateString('pt-BR')}</div>
                        <div className="text-xs text-gray-500">até {new Date(contract.contract_end).toLocaleDateString('pt-BR')}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          contract.is_active ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
                        }`}>
                          {contract.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditContract(contract)}
                            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                            title="Editar contrato"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteContract(contract.id)}
                            className="p-1 text-red-400 hover:text-red-300 transition-colors"
                            title="Excluir contrato"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Seção de Custos */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <TrendingDown className="w-5 h-5 mr-2" />
                Custos da Empresa ({costs.length})
              </h2>
              <button
                onClick={() => {
                  resetCostForm();
                  setShowCostModal(true);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Custo</span>
              </button>
            </div>
          </div>

          {costs.length === 0 ? (
            <div className="p-12 text-center">
              <TrendingDown className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">Nenhum custo cadastrado</h3>
              <p className="text-gray-500 mb-4">Adicione os custos da empresa para controle financeiro</p>
              <button
                onClick={() => setShowCostModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Adicionar Primeiro Custo
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Descrição</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Categoria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {costs.map((cost) => (
                    <tr key={cost.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {cost.description}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-700 text-gray-300">
                          {getCategoryDisplayName(cost.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-red-400">
                        {formatCurrency(cost.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {new Date(cost.cost_date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          cost.is_recurring ? 'bg-blue-900/50 text-blue-300' : 'bg-gray-700 text-gray-300'
                        }`}>
                          {cost.is_recurring ? 'Recorrente' : 'Único'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditCost(cost)}
                            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                            title="Editar custo"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCost(cost.id)}
                            className="p-1 text-red-400 hover:text-red-300 transition-colors"
                            title="Excluir custo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Contrato */}
      {showContractModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-800">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold text-white">
                {editingContract ? 'Editar Contrato' : 'Novo Contrato'}
              </h2>
              <button
                onClick={() => {
                  setShowContractModal(false);
                  resetContractForm();
                }}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSaveContract} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nome do Cliente *</label>
                  <input
                    type="text"
                    value={contractForm.user_name}
                    onChange={(e) => setContractForm({...contractForm, user_name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nome completo do cliente"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                  <input
                    type="email"
                    value={contractForm.user_email}
                    onChange={(e) => setContractForm({...contractForm, user_email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@cliente.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp</label>
                  <input
                    type="tel"
                    value={contractForm.user_phone}
                    onChange={(e) => setContractForm({...contractForm, user_phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Plano *</label>
                  <select
                    value={contractForm.plan_type}
                    onChange={(e) => {
                      const plan = e.target.value as 'starter' | 'pro' | 'master' | 'robo-personalizado';
                      let defaultValue = 0;
                      
                      // Valores padrão dos planos da Estrategista Solutions
                      switch (plan) {
                        case 'starter': defaultValue = 0; break;
                        case 'pro': defaultValue = 800; break;
                        case 'master': defaultValue = 1200; break;
                        case 'robo-personalizado': defaultValue = 5000; break;
                      }
                      
                      setContractForm({
                        ...contractForm, 
                        plan_type: plan,
                        monthly_value: defaultValue
                      });
                    }}
                    className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="starter">Starter (Gratuito)</option>
                    <option value="pro">PRO - R$ 800/sem</option>
                    <option value="master">MASTER - R$ 1.200/sem</option>
                    <option value="robo-personalizado">Robô Personalizado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Período de Cobrança *</label>
                  <select
                    value={contractForm.billing_period}
                    onChange={(e) => setContractForm({...contractForm, billing_period: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="monthly">Mensal</option>
                    <option value="semiannual">Semestral</option>
                    <option value="annual">Anual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Valor Mensal (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={contractForm.monthly_value}
                    onChange={(e) => setContractForm({...contractForm, monthly_value: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Data de Início *</label>
                  <input
                    type="date"
                    value={contractForm.contract_start}
                    onChange={(e) => setContractForm({...contractForm, contract_start: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Data de Fim *</label>
                  <input
                    type="date"
                    value={contractForm.contract_end}
                    onChange={(e) => setContractForm({...contractForm, contract_end: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowContractModal(false);
                    resetContractForm();
                  }}
                  className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingContract ? 'Atualizar' : 'Salvar'} Contrato</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Custo */}
      {showCostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg border border-gray-800">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold text-white">
                {editingCost ? 'Editar Custo' : 'Novo Custo'}
              </h2>
              <button
                onClick={() => {
                  setShowCostModal(false);
                  resetCostForm();
                }}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSaveCost} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Descrição *</label>
                <input
                  type="text"
                  value={costForm.description}
                  onChange={(e) => setCostForm({...costForm, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Servidor VPS, Marketing Digital"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Categoria *</label>
                <select
                  value={costForm.category}
                  onChange={(e) => setCostForm({...costForm, category: e.target.value as any})}
                  className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="infraestrutura">Infraestrutura</option>
                  <option value="marketing">Marketing</option>
                  <option value="desenvolvimento">Desenvolvimento</option>
                  <option value="suporte">Suporte</option>
                  <option value="operacional">Operacional</option>
                  <option value="legal">Legal</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={costForm.amount}
                    onChange={(e) => setCostForm({...costForm, amount: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Data *</label>
                  <input
                    type="date"
                    value={costForm.cost_date}
                    onChange={(e) => setCostForm({...costForm, cost_date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_recurring"
                  checked={costForm.is_recurring}
                  onChange={(e) => setCostForm({...costForm, is_recurring: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-800 rounded"
                />
                <label htmlFor="is_recurring" className="ml-2 text-sm text-gray-300">
                  Custo recorrente (mensal)
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowCostModal(false);
                    resetCostForm();
                  }}
                  className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingCost ? 'Atualizar' : 'Salvar'} Custo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialPanel;