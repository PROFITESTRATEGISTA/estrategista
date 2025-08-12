import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';
import { ArrowLeft, Plus, Trash2, Edit, DollarSign, TrendingUp, Users, Calendar, Search, ChevronDown } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  plan: 'free' | 'pro' | 'master';
  is_active: boolean;
  created_at: string;
  last_login?: string;
  phone_verified: boolean;
}

interface Contract {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  plan_type: string;
  monthly_value: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'inactive' | 'cancelled';
  created_at: string;
}

interface Cost {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  created_at: string;
}

interface ContractForm {
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  plan_type: string;
  monthly_value: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'inactive' | 'cancelled';
}

interface CostForm {
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface FinancialPanelProps {
  onBack: () => void;
}

export default function FinancialPanel({ onBack }: FinancialPanelProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'contracts' | 'costs'>('overview');
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [costs, setCosts] = useState<Cost[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showContractForm, setShowContractForm] = useState(false);
  const [showCostForm, setShowCostForm] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [editingCost, setCost] = useState<Cost | null>(null);

  const [contractForm, setContractForm] = useState<ContractForm>({
    user_id: '',
    user_name: '',
    user_email: '',
    user_phone: '',
    plan_type: 'starter',
    monthly_value: 0,
    start_date: '',
    end_date: '',
    status: 'active'
  });

  const [costForm, setCostForm] = useState<CostForm>({
    description: '',
    amount: 0,
    category: 'operacional',
    date: new Date().toISOString().split('T')[0]
  });

  // Load users for dropdown
  const loadUsers = async () => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('users')
          .select('id, name, email, phone, plan, is_active')
          .eq('is_active', true)
          .order('name');

        if (data && !error) {
          setUsers(data);
          setFilteredUsers(data);
        } else {
          console.error('Error loading users:', error);
          setUsers([]);
          setFilteredUsers([]);
        }
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
      setFilteredUsers([]);
    }
  };

  // Filter users based on search
  useEffect(() => {
    if (!contractForm.user_name) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(contractForm.user_name.toLowerCase()) ||
        user.email.toLowerCase().includes(contractForm.user_name.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [contractForm.user_name, users]);

  // Select user from dropdown
  const selectUser = (user: User) => {
    setContractForm({
      ...contractForm,
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      user_phone: user.phone || '',
      plan_type: user.plan || 'starter'
    });
    setShowUserDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-dropdown-container')) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load data on component mount
  useEffect(() => {
    loadData();
    loadUsers();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      if (supabase) {
        // Load contracts
        const { data: contractsData, error: contractsError } = await supabase
          .from('contracts')
          .select('*')
          .order('created_at', { ascending: false });

        if (contractsData && !contractsError) {
          setContracts(contractsData);
        }

        // Load costs
        const { data: costsData, error: costsError } = await supabase
          .from('costs')
          .select('*')
          .order('date', { ascending: false });

        if (costsData && !costsError) {
          setCosts(costsData);
        }
      }
    } catch (error) {
      console.error('Error loading financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContractSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contractForm.user_name || !contractForm.user_email || !contractForm.start_date || !contractForm.end_date) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      if (supabase) {
        const contractData = {
          ...contractForm,
          monthly_value: Number(contractForm.monthly_value)
        };

        if (editingContract) {
          const { error } = await supabase
            .from('contracts')
            .update(contractData)
            .eq('id', editingContract.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('contracts')
            .insert([contractData]);

          if (error) throw error;
        }

        await loadData();
        setShowContractForm(false);
        setEditingContract(null);
        resetContractForm();
      }
    } catch (error) {
      console.error('Error saving contract:', error);
      alert('Erro ao salvar contrato. Tente novamente.');
    }
  };

  const handleCostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!costForm.description || !costForm.amount || !costForm.date) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      if (supabase) {
        const costData = {
          ...costForm,
          amount: Number(costForm.amount)
        };

        if (editingCost) {
          const { error } = await supabase
            .from('costs')
            .update(costData)
            .eq('id', editingCost.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('costs')
            .insert([costData]);

          if (error) throw error;
        }

        await loadData();
        setShowCostForm(false);
        setEditingCost(null);
        resetCostForm();
      }
    } catch (error) {
      console.error('Error saving cost:', error);
      alert('Erro ao salvar custo. Tente novamente.');
    }
  };

  const deleteContract = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este contrato?')) return;

    try {
      if (supabase) {
        const { error } = await supabase
          .from('contracts')
          .delete()
          .eq('id', id);

        if (error) throw error;
        await loadData();
      }
    } catch (error) {
      console.error('Error deleting contract:', error);
      alert('Erro ao excluir contrato. Tente novamente.');
    }
  };

  const deleteCost = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este custo?')) return;

    try {
      if (supabase) {
        const { error } = await supabase
          .from('costs')
          .delete()
          .eq('id', id);

        if (error) throw error;
        await loadData();
      }
    } catch (error) {
      console.error('Error deleting cost:', error);
      alert('Erro ao excluir custo. Tente novamente.');
    }
  };

  const resetContractForm = () => {
    setContractForm({
      user_id: '',
      user_name: '',
      user_email: '',
      user_phone: '',
      plan_type: 'starter',
      monthly_value: 0,
      start_date: '',
      end_date: '',
      status: 'active'
    });
  };

  const resetCostForm = () => {
    setCostForm({
      description: '',
      amount: 0,
      category: 'operacional',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const editContract = (contract: Contract) => {
    setContractForm({
      user_id: contract.user_id,
      user_name: contract.user_name,
      user_email: contract.user_email,
      user_phone: contract.user_phone,
      plan_type: contract.plan_type,
      monthly_value: contract.monthly_value,
      start_date: contract.start_date,
      end_date: contract.end_date,
      status: contract.status
    });
    setEditingContract(contract);
    setShowContractForm(true);
  };

  const editCost = (cost: Cost) => {
    setCostForm({
      description: cost.description,
      amount: cost.amount,
      category: cost.category,
      date: cost.date
    });
    setEditingCost(cost);
    setShowCostForm(true);
  };

  // Calculate metrics
  const totalRevenue = contracts
    .filter(c => c.status === 'active')
    .reduce((sum, c) => sum + c.monthly_value, 0);

  const totalCosts = costs.reduce((sum, c) => sum + c.amount, 0);
  const profit = totalRevenue - totalCosts;
  const activeContracts = contracts.filter(c => c.status === 'active').length;

  const getPlanValue = (planType: string) => {
    switch (planType) {
      case 'pro': return 800;
      case 'master': return 1200;
      case 'starter': return 0;
      case 'robo_personalizado': return 2000;
      default: return 0;
    }
  };

  // Update monthly value when plan type changes
  useEffect(() => {
    const value = getPlanValue(contractForm.plan_type);
    setContractForm(prev => ({ ...prev, monthly_value: value }));
  }, [contractForm.plan_type]);

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
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Painel Financeiro</h1>
              <p className="text-gray-400">Gestão de contratos e custos</p>
            </div>
          </div>
          <DollarSign className="w-8 h-8 text-green-400" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Receita Mensal</p>
                <p className="text-2xl font-bold text-green-400">
                  R$ {totalRevenue.toLocaleString('pt-BR')}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Custos Mensais</p>
                <p className="text-2xl font-bold text-red-400">
                  R$ {totalCosts.toLocaleString('pt-BR')}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Lucro Líquido</p>
                <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  R$ {profit.toLocaleString('pt-BR')}
                </p>
              </div>
              <TrendingUp className={`w-8 h-8 ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`} />
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Contratos Ativos</p>
                <p className="text-2xl font-bold text-blue-400">{activeContracts}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'overview' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('contracts')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'contracts' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Contratos
          </button>
          <button
            onClick={() => setActiveTab('costs')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'costs' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Custos
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Resumo Financeiro</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-green-400 mb-2">Receitas</h4>
                  <div className="space-y-2">
                    {contracts.filter(c => c.status === 'active').map(contract => (
                      <div key={contract.id} className="flex justify-between text-sm">
                        <span className="text-gray-300">{contract.user_name} ({contract.plan_type})</span>
                        <span className="text-green-400">R$ {contract.monthly_value.toLocaleString('pt-BR')}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-red-400 mb-2">Custos</h4>
                  <div className="space-y-2">
                    {costs.slice(0, 5).map(cost => (
                      <div key={cost.id} className="flex justify-between text-sm">
                        <span className="text-gray-300">{cost.description}</span>
                        <span className="text-red-400">R$ {cost.amount.toLocaleString('pt-BR')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contracts Tab */}
        {activeTab === 'contracts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Contratos</h3>
              <button
                onClick={() => {
                  resetContractForm();
                  setEditingContract(null);
                  setShowContractForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Contrato</span>
              </button>
            </div>

            {/* Contracts List */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="text-left p-4 text-gray-300">Cliente</th>
                      <th className="text-left p-4 text-gray-300">Plano</th>
                      <th className="text-left p-4 text-gray-300">Valor Mensal</th>
                      <th className="text-left p-4 text-gray-300">Período</th>
                      <th className="text-left p-4 text-gray-300">Status</th>
                      <th className="text-left p-4 text-gray-300">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map(contract => (
                      <tr key={contract.id} className="border-t border-gray-800">
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{contract.user_name}</div>
                            <div className="text-sm text-gray-400">{contract.user_email}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-900 text-blue-300">
                            {contract.plan_type.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-green-400 font-medium">
                          R$ {contract.monthly_value.toLocaleString('pt-BR')}
                        </td>
                        <td className="p-4 text-sm text-gray-300">
                          {new Date(contract.start_date).toLocaleDateString('pt-BR')} - {new Date(contract.end_date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            contract.status === 'active' ? 'bg-green-900 text-green-300' :
                            contract.status === 'inactive' ? 'bg-yellow-900 text-yellow-300' :
                            'bg-red-900 text-red-300'
                          }`}>
                            {contract.status === 'active' ? 'Ativo' : 
                             contract.status === 'inactive' ? 'Inativo' : 'Cancelado'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => editContract(contract)}
                              className="p-1 rounded text-blue-400 hover:bg-blue-900/50 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteContract(contract.id)}
                              className="p-1 rounded text-red-400 hover:bg-red-900/50 transition-colors"
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
            </div>
          </div>
        )}

        {/* Costs Tab */}
        {activeTab === 'costs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Custos</h3>
              <button
                onClick={() => {
                  resetCostForm();
                  setEditingCost(null);
                  setShowCostForm(true);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Custo</span>
              </button>
            </div>

            {/* Costs List */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="text-left p-4 text-gray-300">Descrição</th>
                      <th className="text-left p-4 text-gray-300">Categoria</th>
                      <th className="text-left p-4 text-gray-300">Valor</th>
                      <th className="text-left p-4 text-gray-300">Data</th>
                      <th className="text-left p-4 text-gray-300">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costs.map(cost => (
                      <tr key={cost.id} className="border-t border-gray-800">
                        <td className="p-4 font-medium">{cost.description}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-900 text-orange-300">
                            {cost.category}
                          </span>
                        </td>
                        <td className="p-4 text-red-400 font-medium">
                          R$ {cost.amount.toLocaleString('pt-BR')}
                        </td>
                        <td className="p-4 text-sm text-gray-300">
                          {new Date(cost.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => editCost(cost)}
                              className="p-1 rounded text-blue-400 hover:bg-blue-900/50 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteCost(cost.id)}
                              className="p-1 rounded text-red-400 hover:bg-red-900/50 transition-colors"
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
            </div>
          </div>
        )}

        {/* Contract Form Modal */}
        {showContractForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">
                {editingContract ? 'Editar Contrato' : 'Novo Contrato'}
              </h3>
              <form onSubmit={handleContractSubmit} className="space-y-4">
                {/* User Selection with Dropdown */}
                <div className="user-dropdown-container relative">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nome completo do cliente *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={contractForm.user_name}
                      onChange={(e) => {
                        setContractForm({ ...contractForm, user_name: e.target.value });
                        setShowUserDropdown(true);
                      }}
                      onFocus={() => setShowUserDropdown(true)}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      placeholder="Digite o nome do cliente..."
                      required
                    />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  
                  {/* User Dropdown */}
                  {showUserDropdown && filteredUsers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredUsers.map(user => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => selectUser(user)}
                          className="w-full text-left p-3 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-white">{user.name}</div>
                              <div className="text-sm text-gray-400">{user.email}</div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.plan === 'master' ? 'bg-orange-900 text-orange-300' :
                              user.plan === 'pro' ? 'bg-purple-900 text-purple-300' :
                              'bg-gray-700 text-gray-300'
                            }`}>
                              {user.plan.toUpperCase()}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email *</label>
                  <input
                    type="email"
                    value={contractForm.user_email}
                    onChange={(e) => setContractForm({ ...contractForm, user_email: e.target.value })}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Telefone</label>
                  <input
                    type="tel"
                    value={contractForm.user_phone}
                    onChange={(e) => setContractForm({ ...contractForm, user_phone: e.target.value })}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de Plano *</label>
                  <select
                    value={contractForm.plan_type}
                    onChange={(e) => setContractForm({ ...contractForm, plan_type: e.target.value })}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    required
                  >
                    <option value="starter">Starter (Gratuito)</option>
                    <option value="pro">PRO - R$ 800/sem</option>
                    <option value="master">MASTER - R$ 1.200/sem</option>
                    <option value="robo_personalizado">Robô Personalizado - R$ 2.000/sem</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Valor Mensal (R$) *</label>
                  <input
                    type="number"
                    value={contractForm.monthly_value}
                    onChange={(e) => setContractForm({ ...contractForm, monthly_value: Number(e.target.value) })}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Data Início *</label>
                    <input
                      type="date"
                      value={contractForm.start_date}
                      onChange={(e) => setContractForm({ ...contractForm, start_date: e.target.value })}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Data Fim *</label>
                    <input
                      type="date"
                      value={contractForm.end_date}
                      onChange={(e) => setContractForm({ ...contractForm, end_date: e.target.value })}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Status *</label>
                  <select
                    value={contractForm.status}
                    onChange={(e) => setContractForm({ ...contractForm, status: e.target.value as 'active' | 'inactive' | 'cancelled' })}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    required
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    {editingContract ? 'Atualizar' : 'Criar'} Contrato
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowContractForm(false);
                      setEditingContract(null);
                      resetContractForm();
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Cost Form Modal */}
        {showCostForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">
                {editingCost ? 'Editar Custo' : 'Novo Custo'}
              </h3>
              <form onSubmit={handleCostSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Descrição *</label>
                  <input
                    type="text"
                    value={costForm.description}
                    onChange={(e) => setCostForm({ ...costForm, description: e.target.value })}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    placeholder="Ex: Servidor VPS, Marketing, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Categoria *</label>
                  <select
                    value={costForm.category}
                    onChange={(e) => setCostForm({ ...costForm, category: e.target.value })}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    required
                  >
                    <option value="operacional">Operacional</option>
                    <option value="marketing">Marketing</option>
                    <option value="tecnologia">Tecnologia</option>
                    <option value="pessoal">Pessoal</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Valor (R$) *</label>
                  <input
                    type="number"
                    value={costForm.amount}
                    onChange={(e) => setCostForm({ ...costForm, amount: Number(e.target.value) })}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Data *</label>
                  <input
                    type="date"
                    value={costForm.date}
                    onChange={(e) => setCostForm({ ...costForm, date: e.target.value })}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    {editingCost ? 'Atualizar' : 'Adicionar'} Custo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCostForm(false);
                      setEditingCost(null);
                      resetCostForm();
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
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
}