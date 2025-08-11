import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Edit3, Trash2, Save, X, TrendingUp, TrendingDown, Calculator, Calendar, Users, Building2, ArrowLeft } from 'lucide-react';
import supabase from '../lib/supabase';

interface ClientContract {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  plan_type: string;
  billing_period: string;
  monthly_value: number;
  contract_start: string;
  contract_end: string;
  is_active: boolean;
}

interface FinancialCost {
  id: string;
  description: string;
  category: string;
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
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Modals
  const [showContractModal, setShowContractModal] = useState(false);
  const [showCostModal, setShowCostModal] = useState(false);
  const [editingContract, setEditingContract] = useState<ClientContract | null>(null);
  const [editingCost, setEditingCost] = useState<FinancialCost | null>(null);

  // Form states
  const [contractForm, setContractForm] = useState({
    user_id: '',
    plan_type: 'mini-indice',
    billing_period: 'monthly',
    monthly_value: 0,
    contract_start: '',
    contract_end: '',
    is_active: true
  });

  const [costForm, setCostForm] = useState({
    description: '',
    category: 'operacional',
    amount: 0,
    cost_date: new Date().toISOString().split('T')[0],
    is_recurring: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchContracts(), fetchCosts(), fetchUsers()]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const fetchContracts = async () => {
    try {
      console.log('🔍 Fetching contracts...');
      
      if (!supabase) {
        console.log('⚠️ Supabase not available, using mock data');
        setContracts(getMockContracts());
        return;
      }

      const { data, error } = await supabase
        .from('client_contracts')
        .select(`
          *,
          user_profiles(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching contracts:', error);
        setContracts(getMockContracts());
        return;
      }

      console.log('✅ Raw contracts data:', data);
      
      const formattedContracts = (data || []).map(contract => ({
        ...contract,
        user_name: contract.user_profiles?.full_name || 'Nome não informado',
        user_email: contract.user_profiles?.email || 'Email não informado'
      }));

      console.log('✅ Formatted contracts:', formattedContracts);
      setContracts(formattedContracts);
    } catch (error) {
      console.error('❌ Catch error fetching contracts:', error);
      setContracts(getMockContracts());
    }
  };

  const fetchCosts = async () => {
    try {
      if (!supabase) {
        setCosts(getMockCosts());
        return;
      }

      const { data, error } = await supabase
        .from('financial_costs')
        .select('id, description, category, amount, cost_date, is_recurring')
        .order('cost_date', { ascending: false });

      if (error) {
        console.error('Error fetching costs:', error);
        setCosts(getMockCosts());
        return;
      }
      setCosts(data || []);
    } catch (error) {
      console.error('Error fetching costs:', error);
      setCosts(getMockCosts());
    }
  };

  const fetchUsers = async () => {
    try {
      if (!supabase) {
        setUsers(getMockUsers());
        return;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, email')
        .eq('is_active', true)
        .order('full_name');

      if (error) {
        console.error('Error fetching users:', error);
        setUsers(getMockUsers());
        return;
      }
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers(getMockUsers());
    }
  };

  const getMockContracts = (): ClientContract[] => [
    {
      id: '1',
      user_id: 'user-joao-silva',
      user_name: 'João Silva',
      user_email: 'joao@email.com',
      plan_type: 'mini-indice',
      billing_period: 'monthly',
      monthly_value: 800.00,
      contract_start: '2024-01-01',
      contract_end: '2024-12-31',
      is_active: true
    },
    {
      id: '2',
      user_id: 'user-maria-santos',
      user_name: 'Maria Santos',
      user_email: 'maria@email.com',
      plan_type: 'portfolio-completo',
      billing_period: 'semiannual',
      monthly_value: 1200.00,
      contract_start: '2024-02-01',
      contract_end: '2024-08-01',
      is_active: true
    },
    {
      id: '3',
      user_id: 'user-carlos-oliveira',
      user_name: 'Carlos Oliveira',
      user_email: 'carlos@email.com',
      plan_type: 'mini-dolar',
      billing_period: 'annual',
      monthly_value: 600.00,
      contract_start: '2024-03-01',
      contract_end: '2025-03-01',
      is_active: true
    }
  ];

  const getMockCosts = (): FinancialCost[] => [
    {
      id: '1',
      description: 'Servidor VPS',
      category: 'infraestrutura',
      amount: 150.00,
      cost_date: '2024-01-01',
      is_recurring: true
    },
    {
      id: '2',
      description: 'Licenças de Software',
      category: 'tecnologia',
      amount: 300.00,
      cost_date: '2024-01-01',
      is_recurring: true
    },
    {
      id: '3',
      description: 'Marketing Digital',
      category: 'marketing',
      amount: 500.00,
      cost_date: '2024-01-01',
      is_recurring: true
    },
    {
      id: '4',
      description: 'Suporte Técnico',
      category: 'pessoal',
      amount: 2000.00,
      cost_date: '2024-01-01',
      is_recurring: true
    }
  ];

  const getMockUsers = () => [
    { id: 'user-joao-silva', full_name: 'João Silva', email: 'joao@email.com' },
    { id: 'user-maria-santos', full_name: 'Maria Santos', email: 'maria@email.com' },
    { id: 'user-carlos-oliveira', full_name: 'Carlos Oliveira', email: 'carlos@email.com' },
    { id: 'user-ana-costa', full_name: 'Ana Costa', email: 'ana@email.com' },
    { id: 'user-bruno-ferreira', full_name: 'Bruno Ferreira', email: 'bruno@email.com' }
  ];

  const handleSaveContract = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      console.log('💾 Saving contract...', { editingContract, contractForm });

      if (!supabase) {
        // Mock save for demo
        if (editingContract) {
          setContracts(prev => prev.map(c => 
            c.id === editingContract.id 
              ? { ...c, ...contractForm, user_name: users.find(u => u.id === contractForm.user_id)?.full_name || 'Usuário', user_email: users.find(u => u.id === contractForm.user_id)?.email || 'email@exemplo.com' }
              : c
          ));
        } else {
          const newContract: ClientContract = {
            id: Date.now().toString(),
            ...contractForm,
            user_name: users.find(u => u.id === contractForm.user_id)?.full_name || 'Usuário',
            user_email: users.find(u => u.id === contractForm.user_id)?.email || 'email@exemplo.com'
          };
          setContracts(prev => [newContract, ...prev]);
        }
        setSuccess(editingContract ? 'Contrato atualizado com sucesso!' : 'Contrato criado com sucesso!');
        setShowContractModal(false);
        setEditingContract(null);
        resetContractForm();
        return;
      }

      if (editingContract) {
        console.log('📝 Updating existing contract:', editingContract.id);
        const { error } = await supabase
          .from('client_contracts')
          .update(contractForm)
          .eq('id', editingContract.id);

        if (error) {
          console.error('❌ Error updating contract:', error);
          throw error;
        }
        console.log('✅ Contract updated successfully');
        setSuccess('Contrato atualizado com sucesso!');
      } else {
        console.log('➕ Creating new contract:', contractForm);
        const { error } = await supabase
          .from('client_contracts')
          .insert([contractForm]);

        if (error) {
          console.error('❌ Error creating contract:', error);
          throw error;
        }
        console.log('✅ Contract created successfully');
        setSuccess('Contrato criado com sucesso!');
      }

      setShowContractModal(false);
      setEditingContract(null);
      resetContractForm();
      await fetchContracts();
    } catch (error: any) {
      console.error('❌ Contract save error:', error);
      setError(error.message);
    }
  };

  const handleSaveCost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);

      if (!supabase) {
        // Mock save for demo
        if (editingCost) {
          setCosts(prev => prev.map(c => c.id === editingCost.id ? { ...c, ...costForm } : c));
        } else {
          const newCost: FinancialCost = {
            id: Date.now().toString(),
            ...costForm
          };
          setCosts(prev => [newCost, ...prev]);
        }
        setSuccess(editingCost ? 'Custo atualizado com sucesso!' : 'Custo adicionado com sucesso!');
        setShowCostModal(false);
        setEditingCost(null);
        resetCostForm();
        return;
      }

      if (editingCost) {
        const { error } = await supabase
          .from('financial_costs')
          .update(costForm)
          .eq('id', editingCost.id);

        if (error) throw error;
        setSuccess('Custo atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('financial_costs')
          .insert([costForm]);

        if (error) throw error;
        setSuccess('Custo adicionado com sucesso!');
      }

      setShowCostModal(false);
      setEditingCost(null);
      resetCostForm();
      fetchCosts();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDeleteContract = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este contrato?')) return;

    try {
      console.log('🗑️ Deleting contract:', id);
      
      if (!supabase) {
        setContracts(prev => prev.filter(c => c.id !== id));
        setSuccess('Contrato excluído com sucesso!');
        return;
      }

      const { error } = await supabase
        .from('client_contracts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting contract:', error);
        throw error;
      }
      console.log('✅ Contract deleted successfully');
      setSuccess('Contrato excluído com sucesso!');
      await fetchContracts();
    } catch (error: any) {
      console.error('❌ Contract delete error:', error);
      setError(error.message);
    }
  };

  const handleDeleteCost = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este custo?')) return;

    try {
      if (!supabase) {
        setCosts(prev => prev.filter(c => c.id !== id));
        setSuccess('Custo excluído com sucesso!');
        return;
      }

      const { error } = await supabase
        .from('financial_costs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccess('Custo excluído com sucesso!');
      fetchCosts();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const resetContractForm = () => {
    setContractForm({
      user_id: '',
      plan_type: 'mini-indice',
      billing_period: 'monthly',
      monthly_value: 0,
      contract_start: '',
      contract_end: '',
      is_active: true
    });
  };

  const resetCostForm = () => {
    setCostForm({
      description: '',
      category: 'operacional',
      amount: 0,
      cost_date: new Date().toISOString().split('T')[0],
      is_recurring: false
    });
  };

  const openEditContract = (contract: ClientContract) => {
    setEditingContract(contract);
    setContractForm({
      user_id: contract.user_id,
      plan_type: contract.plan_type,
      billing_period: contract.billing_period,
      monthly_value: contract.monthly_value,
      contract_start: contract.contract_start,
      contract_end: contract.contract_end,
      is_active: contract.is_active
    });
    setShowContractModal(true);
  };

  const openEditCost = (cost: FinancialCost) => {
    setEditingCost(cost);
    setCostForm({
      description: cost.description,
      category: cost.category,
      amount: cost.amount,
      cost_date: cost.cost_date,
      is_recurring: cost.is_recurring
    });
    setShowCostModal(true);
  };

  // Cálculos financeiros
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const activeContracts = contracts.filter(c => c.is_active);
  const monthlyRevenue = activeContracts.reduce((sum, contract) => sum + contract.monthly_value, 0);
  const monthlyCosts = costs
    .filter(cost => cost.cost_date.startsWith(currentMonth) || cost.is_recurring)
    .reduce((sum, cost) => sum + cost.amount, 0);
  const monthlyProfit = monthlyRevenue - monthlyCosts;

  const getPlanDisplayName = (plan: string) => {
    const names = {
      'bitcoin': 'Bitcoin',
      'mini-indice': 'Mini Índice',
      'mini-dolar': 'Mini Dólar',
      'portfolio-completo': 'Portfólio Completo'
    };
    return names[plan as keyof typeof names] || plan;
  };

  const getBillingDisplayName = (period: string) => {
    const names = {
      'monthly': 'Mensal',
      'semiannual': 'Semestral',
      'annual': 'Anual'
    };
    return names[period as keyof typeof names] || period;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={onBack}
            className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-400" />
          </button>
          <div className="flex items-center">
            <DollarSign className="h-12 w-12 text-green-400 mr-4" />
            <div>
              <h1 className="text-3xl font-bold text-white">Painel Financeiro</h1>
              <p className="text-gray-400">Controle de receitas, custos e contratos</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-800 text-red-300 px-4 py-3 rounded-lg flex items-center">
            <X className="h-5 w-5 mr-2" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">×</button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-900/50 border border-green-800 text-green-300 px-4 py-3 rounded-lg flex items-center">
            <Save className="h-5 w-5 mr-2" />
            {success}
            <button onClick={() => setSuccess(null)} className="ml-auto text-green-400 hover:text-green-300">×</button>
          </div>
        )}

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Receita Mensal</p>
                <p className="text-2xl font-bold text-green-400">
                  R$ {monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-red-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Custos Mensais</p>
                <p className="text-2xl font-bold text-red-400">
                  R$ {monthlyCosts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <div className="flex items-center">
              <Calculator className="h-8 w-8 text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Lucro Mensal</p>
                <p className={`text-2xl font-bold ${monthlyProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  R$ {monthlyProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Contratos Ativos</p>
                <p className="text-2xl font-bold text-purple-400">{activeContracts.length}</p>
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
                  setEditingContract(null);
                  setShowContractModal(true);
                }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Novo Contrato
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
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-900/50 text-blue-300">
                        {getPlanDisplayName(contract.plan_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {getBillingDisplayName(contract.billing_period)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-400">
                      R$ {contract.monthly_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(contract.contract_start).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(contract.contract_end).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        contract.is_active 
                          ? 'bg-green-900/50 text-green-300' 
                          : 'bg-red-900/50 text-red-300'
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
                  setEditingCost(null);
                  setShowCostModal(true);
                }}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Novo Custo
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
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-800 text-gray-300">
                        {cost.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-400">
                      R$ {cost.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(cost.cost_date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        cost.is_recurring 
                          ? 'bg-yellow-900/50 text-yellow-300' 
                          : 'bg-gray-800 text-gray-300'
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
                    setEditingContract(null);
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
                    <select
                      value={contractForm.user_id}
                      onChange={(e) => setContractForm({...contractForm, user_id: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecione um cliente</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.full_name || user.email || 'Usuário sem nome'} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Plano *</label>
                    <select
                      value={contractForm.plan_type}
                      onChange={(e) => setContractForm({...contractForm, plan_type: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="bitcoin">Bitcoin</option>
                      <option value="mini-indice">Mini Índice</option>
                      <option value="mini-dolar">Mini Dólar</option>
                      <option value="portfolio-completo">Portfólio Completo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Modalidade *</label>
                    <select
                      value={contractForm.billing_period}
                      onChange={(e) => setContractForm({...contractForm, billing_period: e.target.value})}
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
                      min="0.01"
                      value={contractForm.monthly_value}
                      onChange={(e) => setContractForm({...contractForm, monthly_value: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      required
                    />
                    {contractForm.monthly_value <= 0 && (
                      <p className="text-red-400 text-sm mt-1">Valor deve ser maior que zero</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Início do Contrato *</label>
                    <input
                      type="date"
                      value={contractForm.contract_start}
                      onChange={(e) => setContractForm({...contractForm, contract_start: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min={new Date().toISOString().split('T')[0]}
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
                      min={contractForm.contract_start || new Date().toISOString().split('T')[0]}
                      required
                    />
                    {contractForm.contract_end && contractForm.contract_start && 
                     new Date(contractForm.contract_end) <= new Date(contractForm.contract_start) && (
                      <p className="text-red-400 text-sm mt-1">Data de fim deve ser posterior ao início</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="contract_active"
                    checked={contractForm.is_active}
                    onChange={(e) => setContractForm({...contractForm, is_active: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-800 rounded"
                  />
                  <label htmlFor="contract_active" className="ml-2 text-sm text-gray-300">
                    Contrato ativo
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors"
                  >
                    {editingContract ? 'Atualizar Contrato' : 'Criar Contrato'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowContractModal(false);
                      setEditingContract(null);
                      resetContractForm();
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors"
                  >
                    Cancelar
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
                    setEditingCost(null);
                    resetCostForm();
                  }}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSaveCost} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Descrição *</label>
                    <input
                      type="text"
                      value={costForm.description}
                      onChange={(e) => setCostForm({...costForm, description: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Descrição do custo"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Categoria *</label>
                    <select
                      value={costForm.category}
                      onChange={(e) => setCostForm({...costForm, category: e.target.value})}
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
                    id="cost_recurring"
                    checked={costForm.is_recurring}
                    onChange={(e) => setCostForm({...costForm, is_recurring: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-800 rounded"
                  />
                  <label htmlFor="cost_recurring" className="ml-2 text-sm text-gray-300">
                    Custo recorrente (mensal)
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors"
                  >
                    {editingCost ? 'Atualizar Custo' : 'Adicionar Custo'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCostModal(false);
                      setEditingCost(null);
                      resetCostForm();
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors"
                  >
                    Cancelar
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