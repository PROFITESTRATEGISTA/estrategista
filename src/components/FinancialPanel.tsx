import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Edit3, Trash2, Save, X, TrendingUp, TrendingDown, Calculator, Calendar, Users, Building2, ArrowLeft } from 'lucide-react';
import supabase from '../lib/supabase';

interface ClientContract {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  plan_type: 'starter' | 'pro' | 'master' | 'robo-personalizado';
  billing_period: 'monthly' | 'semiannual' | 'annual';
  monthly_value: number;
  contract_start: string;
  contract_end: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface FinancialCost {
  id: string;
  description: string;
  category: 'operacional' | 'marketing' | 'tecnologia' | 'pessoal' | 'infraestrutura' | 'outros';
  amount: number;
  cost_date: string;
  is_recurring: boolean;
}

interface FinancialPanelProps {
  onBack: () => void;
}

const FinancialPanel: React.FC<FinancialPanelProps> = ({ onBack }) => {
  const [contracts, setContracts] = useState<ClientContract[]>([]);
  const [costs, setCosts] = useState<FinancialCost[]>([]);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showCostModal, setShowCostModal] = useState(false);
  const [editingContract, setEditingContract] = useState<ClientContract | null>(null);
  const [editingCost, setEditingCost] = useState<FinancialCost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [contractForm, setContractForm] = useState({
    user_id: '',
    user_name: '',
    user_email: '',
    plan_type: 'starter' as const,
    billing_period: 'monthly' as const,
    monthly_value: 0,
    contract_start: '',
    contract_end: '',
    is_active: true
  });

  const [costForm, setCostForm] = useState({
    description: '',
    category: 'operacional' as const,
    amount: 0,
    cost_date: '',
    is_recurring: false
  });

  // Load data on component mount
  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    setLoading(true);
    try {
      // Load contracts and costs
      await Promise.all([loadContracts(), loadCosts()]);
    } catch (error) {
      console.error('Error loading financial data:', error);
      setError('Erro ao carregar dados financeiros');
    } finally {
      setLoading(false);
    }
  };

  const loadContracts = async () => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('client_contracts')
          .select(`
            *,
            user_profiles!inner(full_name, email)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedContracts = data?.map(contract => ({
          ...contract,
          user_name: contract.user_profiles?.full_name || 'Nome não informado',
          user_email: contract.user_profiles?.email || 'Email não informado'
        })) || [];

        setContracts(formattedContracts);
      } else {
        // Mock data fallback
        setContracts(getMockContracts());
      }
    } catch (error) {
      console.error('Error loading contracts:', error);
      setContracts(getMockContracts());
    }
  };

  const loadCosts = async () => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('financial_costs')
          .select('*')
          .order('cost_date', { ascending: false });

        if (error) throw error;
        setCosts(data || []);
      } else {
        // Mock data fallback
        setCosts(getMockCosts());
      }
    } catch (error) {
      console.error('Error loading costs:', error);
      setCosts(getMockCosts());
    }
  };

  const getMockContracts = (): ClientContract[] => [
    {
      id: '1',
      user_id: 'user-1',
      user_name: 'João Silva',
      user_email: 'joao@email.com',
      plan_type: 'pro',
      billing_period: 'monthly',
      monthly_value: 800,
      contract_start: '2024-01-01',
      contract_end: '2024-12-31',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      user_id: 'user-2',
      user_name: 'Maria Santos',
      user_email: 'maria@email.com',
      plan_type: 'master',
      billing_period: 'semiannual',
      monthly_value: 1200,
      contract_start: '2024-02-01',
      contract_end: '2024-08-01',
      is_active: true,
      created_at: '2024-02-01T00:00:00Z',
      updated_at: '2024-02-01T00:00:00Z'
    }
  ];

  const getMockCosts = (): FinancialCost[] => [
    {
      id: '1',
      description: 'Servidor VPS',
      category: 'infraestrutura',
      amount: 150,
      cost_date: '2024-01-01',
      is_recurring: true
    },
    {
      id: '2',
      description: 'Marketing Digital',
      category: 'marketing',
      amount: 500,
      cost_date: '2024-01-01',
      is_recurring: true
    }
  ];

  // Calculate financial metrics
  const activeContracts = contracts.filter(c => c.is_active);
  const monthlyRevenue = activeContracts.reduce((sum, contract) => sum + contract.monthly_value, 0);
  
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const recurringCosts = costs.filter(c => c.is_recurring).reduce((sum, cost) => sum + cost.amount, 0);
  const monthlySpecificCosts = costs
    .filter(c => {
      const costDate = new Date(c.cost_date);
      return !c.is_recurring && costDate.getMonth() + 1 === currentMonth && costDate.getFullYear() === currentYear;
    })
    .reduce((sum, cost) => sum + cost.amount, 0);
  
  const monthlyCosts = recurringCosts + monthlySpecificCosts;
  const monthlyProfit = monthlyRevenue - monthlyCosts;

  // Helper functions
  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case 'starter': return 'Starter (Gratuito)';
      case 'pro': return 'PRO';
      case 'master': return 'MASTER';
      case 'robo-personalizado': return 'Robô Personalizado';
      default: return plan;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'starter': return 'bg-gray-100 text-gray-800';
      case 'pro': return 'bg-purple-100 text-purple-800';
      case 'master': return 'bg-orange-100 text-orange-800';
      case 'robo-personalizado': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBillingDisplayName = (billing: string) => {
    switch (billing) {
      case 'monthly': return 'Mensal';
      case 'semiannual': return 'Semestral';
      case 'annual': return 'Anual';
      default: return billing;
    }
  };

  const resetContractForm = () => {
    setContractForm({
      user_id: '',
      user_name: '',
      user_email: '',
      plan_type: 'starter',
      billing_period: 'monthly',
      monthly_value: 0,
      contract_start: '',
      contract_end: '',
      is_active: true
    });
    setEditingContract(null);
  };

  const resetCostForm = () => {
    setCostForm({
      description: '',
      category: 'operacional',
      amount: 0,
      cost_date: '',
      is_recurring: false
    });
    setEditingCost(null);
  };

  const openEditContract = (contract: ClientContract) => {
    setContractForm({
      user_id: contract.user_id,
      user_name: contract.user_name,
      user_email: contract.user_email,
      plan_type: contract.plan_type,
      billing_period: contract.billing_period,
      monthly_value: contract.monthly_value,
      contract_start: contract.contract_start,
      contract_end: contract.contract_end,
      is_active: contract.is_active
    });
    setEditingContract(contract);
    setShowContractModal(true);
  };

  const openEditCost = (cost: FinancialCost) => {
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

  const handleSaveContract = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (editingContract) {
        // Update existing contract
        if (supabase) {
          const { error } = await supabase
            .from('client_contracts')
            .update({
              plan_type: contractForm.plan_type,
              billing_period: contractForm.billing_period,
              monthly_value: contractForm.monthly_value,
              contract_start: contractForm.contract_start,
              contract_end: contractForm.contract_end,
              is_active: contractForm.is_active
            })
            .eq('id', editingContract.id);

          if (error) throw error;
        }

        // Update local state
        setContracts(prev => prev.map(c => 
          c.id === editingContract.id 
            ? { ...c, ...contractForm }
            : c
        ));
        setSuccess('Contrato atualizado com sucesso!');
      } else {
        // Create new contract
        const newContract = {
          id: Date.now().toString(),
          ...contractForm,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
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

      setShowContractModal(false);
      resetContractForm();
    } catch (error) {
      console.error('Error saving contract:', error);
      setError('Erro ao salvar contrato');
    }
  };

  const handleSaveCost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (editingCost) {
        // Update existing cost
        if (supabase) {
          const { error } = await supabase
            .from('financial_costs')
            .update(costForm)
            .eq('id', editingCost.id);

          if (error) throw error;
        }

        setCosts(prev => prev.map(c => 
          c.id === editingCost.id 
            ? { ...c, ...costForm }
            : c
        ));
        setSuccess('Custo atualizado com sucesso!');
      } else {
        // Create new cost
        const newCost = {
          id: Date.now().toString(),
          ...costForm
        };

        if (supabase) {
          const { error } = await supabase
            .from('financial_costs')
            .insert([newCost]);

          if (error) throw error;
        }

        setCosts(prev => [newCost, ...prev]);
        setSuccess('Custo criado com sucesso!');
      }

      setShowCostModal(false);
      resetCostForm();
    } catch (error) {
      console.error('Error saving cost:', error);
      setError('Erro ao salvar custo');
    }
  };

  const handleDeleteContract = async (contractId: string) => {
    if (!confirm('Tem certeza que deseja excluir este contrato?')) return;

    try {
      if (supabase) {
        const { error } = await supabase
          .from('client_contracts')
          .delete()
          .eq('id', contractId);

        if (error) throw error;
      }

      setContracts(prev => prev.filter(c => c.id !== contractId));
      setSuccess('Contrato excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting contract:', error);
      setError('Erro ao excluir contrato');
    }
  };

  const handleDeleteCost = async (costId: string) => {
    if (!confirm('Tem certeza que deseja excluir este custo?')) return;

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
      console.error('Error deleting cost:', error);
      setError('Erro ao excluir custo');
    }
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
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={onBack}
              className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-400" />
            </button>
            <Building2 className="h-12 w-12 text-green-600 mr-4" />
            <div>
              <h1 className="text-3xl font-bold text-white">Painel Financeiro</h1>
              <p className="text-gray-400">Controle de receitas, custos e contratos</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-600/30 text-red-400 px-4 py-3 rounded-lg flex items-center">
            <X className="h-5 w-5 mr-2" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">×</button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-900/20 border border-green-600/30 text-green-400 px-4 py-3 rounded-lg flex items-center">
            <Save className="h-5 w-5 mr-2" />
            {success}
            <button onClick={() => setSuccess(null)} className="ml-auto text-green-400 hover:text-green-300">×</button>
          </div>
        )}

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Receita Mensal</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Custos Mensais</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {monthlyCosts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <div className="flex items-center">
              <Calculator className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Lucro Mensal</p>
                <p className={`text-2xl font-bold ${monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {monthlyProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Contratos Ativos</p>
                <p className="text-2xl font-bold text-purple-600">{activeContracts.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contracts Section */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 mb-8">
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Contratos dos Clientes</h2>
              <button
                onClick={() => {
                  resetContractForm();
                  setShowContractModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Novo Contrato</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Plano</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Modalidade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Valor Mensal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Início</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fim</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {contracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{contract.user_name}</div>
                        <div className="text-sm text-gray-400">{contract.user_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPlanColor(contract.plan_type)}`}>
                        {getPlanDisplayName(contract.plan_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {getBillingDisplayName(contract.billing_period)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      R$ {contract.monthly_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {new Date(contract.contract_start).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {new Date(contract.contract_end).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        contract.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {contract.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditContract(contract)}
                          className="text-blue-400 hover:text-blue-300"
                          title="Editar contrato"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteContract(contract.id)}
                          className="text-red-400 hover:text-red-300"
                          title="Excluir contrato"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Costs Section */}
        <div className="bg-gray-900 rounded-lg border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Custos da Empresa</h2>
              <button
                onClick={() => {
                  resetCostForm();
                  setShowCostModal(true);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Novo Custo</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Valor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Recorrente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {costs.map((cost) => (
                  <tr key={cost.id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {cost.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-700 text-gray-300">
                        {cost.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                      R$ {cost.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {new Date(cost.cost_date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        cost.is_recurring ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {cost.is_recurring ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditCost(cost)}
                          className="text-blue-400 hover:text-blue-300"
                          title="Editar custo"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCost(cost.id)}
                          className="text-red-400 hover:text-red-300"
                          title="Excluir custo"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contract Modal */}
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
                  className="text-gray-400 hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSaveContract} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Cliente *</label>
                    <input
                      type="text"
                      value={contractForm.user_name}
                      onChange={(e) => setContractForm({...contractForm, user_name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nome do cliente"
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">Plano *</label>
                    <select
                      value={contractForm.plan_type}
                      onChange={(e) => setContractForm({...contractForm, plan_type: e.target.value as any})}
                      className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="starter">Starter (Gratuito)</option>
                      <option value="pro">PRO</option>
                      <option value="master">MASTER</option>
                      <option value="robo-personalizado">Robô Personalizado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Modalidade *</label>
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
                      placeholder="800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Início do Contrato *</label>
                    <input
                      type="date"
                      value={contractForm.contract_start}
                      onChange={(e) => setContractForm({...contractForm, contract_start: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Fim do Contrato *</label>
                    <input
                      type="date"
                      value={contractForm.contract_end}
                      onChange={(e) => setContractForm({...contractForm, contract_end: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="contract_active"
                    checked={contractForm.is_active}
                    onChange={(e) => setContractForm({...contractForm, is_active: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="contract_active" className="ml-2 block text-sm text-gray-300">
                    Contrato ativo
                  </label>
                </div>

                <div className="flex justify-end space-x-4">
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
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingContract ? 'Atualizar Contrato' : 'Criar Contrato'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Cost Modal */}
        {showCostModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-800">
              <div className="flex justify-between items-center p-6 border-b border-gray-800">
                <h2 className="text-2xl font-bold text-white">
                  {editingCost ? 'Editar Custo' : 'Novo Custo'}
                </h2>
                <button
                  onClick={() => {
                    setShowCostModal(false);
                    resetCostForm();
                  }}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSaveCost} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Descrição *</label>
                    <input
                      type="text"
                      value={costForm.description}
                      onChange={(e) => setCostForm({...costForm, description: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Servidor VPS"
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
                      <option value="operacional">Operacional</option>
                      <option value="marketing">Marketing</option>
                      <option value="tecnologia">Tecnologia</option>
                      <option value="pessoal">Pessoal</option>
                      <option value="infraestrutura">Infraestrutura</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Valor (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={costForm.amount}
                      onChange={(e) => setCostForm({...costForm, amount: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="150.00"
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
                    id="cost_recurring"
                    checked={costForm.is_recurring}
                    onChange={(e) => setCostForm({...costForm, is_recurring: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="cost_recurring" className="ml-2 block text-sm text-gray-300">
                    Custo recorrente (mensal)
                  </label>
                </div>

                <div className="flex justify-end space-x-4">
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
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {editingCost ? 'Atualizar Custo' : 'Criar Custo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialPanel;