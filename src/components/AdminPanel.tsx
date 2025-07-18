import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, DollarSign, Activity, Server, Shield, Zap, Settings, Monitor, Database, Globe, CreditCard, Building2, Award, Clock, CheckCircle, AlertTriangle, Eye, EyeOff, Download, Search, Filter, MoreVertical, Edit, Trash2, UserPlus, Mail, Phone, Calendar, MapPin, Star, Crown, Gift, Target, BarChart3, PieChart, LineChart, ArrowUp, ArrowDown, Percent, RefreshCw, Bell, MessageSquare, FileText, ExternalLink, Copy, Share2, Lock, Unlock, Plus, Minus, X, Check, AlertCircle, Info, HelpCircle, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Home, Package, Briefcase, Headphones, LogOut, User, Menu, Save, SortAsc, SortDesc, ArrowUpDown } from 'lucide-react';
import { SolutionRequestsPanel } from './SolutionRequestsPanel';

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

interface AdminPanelProps {
  onBack?: () => void;
  users: User[];
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
}

type SortField = 'name' | 'email' | 'plan' | 'created_at' | 'last_login' | 'phone';
type SortDirection = 'asc' | 'desc';

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack, users = [], onUpdateUser, onDeleteUser }) => {
  const [currentView, setCurrentView] = useState<'users' | 'solutions'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [showInactive, setShowInactive] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showUserDetails, setShowUserDetails] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [tempPlan, setTempPlan] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('🔍 AdminPanel received users:', users);
    console.log('📊 Users count:', users.length);
    setIsLoading(false);
  }, [users]);

  // Filter users based on search and filters
  let filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === 'all' || user.plan === filterPlan;
    const matchesActive = showInactive || user.is_active;
    
    return matchesSearch && matchesPlan && matchesActive;
  });

  // Sort users
  filteredUsers = [...filteredUsers].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];
    
    // Handle different data types
    if (sortField === 'created_at' || sortField === 'last_login') {
      aValue = new Date(aValue || 0).getTime();
      bValue = new Date(bValue || 0).getTime();
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = (bValue || '').toLowerCase();
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  console.log('🔍 Filtered users:', filteredUsers);

  // Statistics
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.is_active).length,
    proUsers: users.filter(u => u.plan === 'pro').length,
    masterUsers: users.filter(u => u.plan === 'master').length,
    freeUsers: users.filter(u => u.plan === 'free').length,
    recentSignups: users.filter(u => {
      const signupDate = new Date(u.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return signupDate > weekAgo;
    }).length
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100" />;
    }
    return sortDirection === 'asc' ? 
      <SortAsc className="w-4 h-4 text-blue-400" /> : 
      <SortDesc className="w-4 h-4 text-blue-400" />;
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'pro': return 'bg-blue-100 text-blue-800';
      case 'master': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'free': return <Gift className="w-4 h-4" />;
      case 'pro': return <Star className="w-4 h-4" />;
      case 'master': return <Crown className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBulkAction = (action: string) => {
    selectedUsers.forEach(userId => {
      const user = users.find(u => u.id === userId);
      if (user) {
        switch (action) {
          case 'reactivate':
            onUpdateUser(userId, { is_active: true, plan: user.plan || 'free' });
            break;
          case 'activate':
            onUpdateUser(userId, { is_active: true });
            break;
          case 'deactivate':
            onUpdateUser(userId, { is_active: false });
            break;
          case 'upgrade-pro':
            onUpdateUser(userId, { plan: 'pro', is_active: true });
            break;
          case 'upgrade-master':
            onUpdateUser(userId, { plan: 'master', is_active: true });
            break;
          case 'delete':
            onDeleteUser(userId);
            break;
        }
      }
    });
    setSelectedUsers([]);
  };

  const handlePlanEdit = (userId: string, currentPlan: string) => {
    setEditingPlan(userId);
    setTempPlan(currentPlan);
  };

  const handlePlanSave = (userId: string) => {
    if (tempPlan !== '') {
      onUpdateUser(userId, { plan: tempPlan as 'free' | 'pro' | 'master' });
    }
    setEditingPlan(null);
    setTempPlan('');
  };

  const handlePlanCancel = () => {
    setEditingPlan(null);
    setTempPlan('');
  };

  // If viewing solution requests, render that component
  if (currentView === 'solutions') {
    return <SolutionRequestsPanel onBack={() => setCurrentView('users')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-blue-400" />
              <h1 className="text-xl font-bold">Gerenciamento de Usuários - Estrategista Solutions</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('solutions')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm font-medium flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Formulários</span>
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium"
                >
                  Voltar ao Dashboard
                </button>
              )}
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm font-medium"
              >
                Recarregar Dados
              </button>
              <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total de Usuários</p>
                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Usuários Ativos</p>
                <p className="text-2xl font-bold text-emerald-400">{stats.activeUsers}</p>
              </div>
              <Activity className="w-8 h-8 text-emerald-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Usuários PRO</p>
                <p className="text-2xl font-bold text-blue-400">{stats.proUsers}</p>
              </div>
              <Star className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Usuários MASTER</p>
                <p className="text-2xl font-bold text-purple-400">{stats.masterUsers}</p>
              </div>
              <Crown className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Users Management */}
        <div className="space-y-6">
            {/* Filters and Search */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Buscar usuários..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <select
                    value={filterPlan}
                    onChange={(e) => setFilterPlan(e.target.value)}
                    className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos os planos</option>
                    <option value="free">Free</option>
                    <option value="pro">PRO</option>
                    <option value="master">MASTER</option>
                  </select>

                  <label className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={showInactive}
                      onChange={(e) => setShowInactive(e.target.checked)}
                      className="rounded border-slate-600 bg-slate-700/50 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Mostrar inativos</span>
                  </label>
                  
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                      showFilters ? 'bg-blue-600 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filtros Avançados</span>
                  </button>
                  
                  {users.filter(u => !u.is_active).length > 0 && (
                    <button
                      onClick={() => {
                        const inactiveUsers = users.filter(u => !u.is_active);
                        if (confirm(`Reativar ${inactiveUsers.length} usuário(s) inativo(s)?`)) {
                          inactiveUsers.forEach(user => {
                            onUpdateUser(user.id, { is_active: true });
                          });
                        }
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      🔄 Reativar Todos ({users.filter(u => !u.is_active).length})
                    </button>
                  )}
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                  <div className="mt-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-300">Ordenar por:</span>
                        <select
                          value={sortField}
                          onChange={(e) => setSortField(e.target.value as SortField)}
                          className="px-3 py-1 bg-slate-700/50 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="name">Nome</option>
                          <option value="email">Email</option>
                          <option value="plan">Plano</option>
                          <option value="created_at">Data de Cadastro</option>
                          <option value="last_login">Último Login</option>
                          <option value="phone">Telefone</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-300">Direção:</span>
                        <button
                          onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                          className={`flex items-center space-x-1 px-3 py-1 rounded text-sm font-medium transition-colors ${
                            sortDirection === 'asc' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {sortDirection === 'asc' ? (
                            <>
                              <SortAsc className="w-4 h-4" />
                              <span>Crescente</span>
                            </>
                          ) : (
                            <>
                              <SortDesc className="w-4 h-4" />
                              <span>Decrescente</span>
                            </>
                          )}
                        </button>
                      </div>
                      
                      <button
                        onClick={() => {
                          setSortField('created_at');
                          setSortDirection('desc');
                          setFilterPlan('all');
                          setShowInactive(false);
                          setSearchTerm('');
                        }}
                        className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
                      >
                        Limpar Filtros
                      </button>
                    </div>
                  </div>
                )}

                {selectedUsers.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-400">
                      {selectedUsers.length} selecionados
                    </span>
                    <button
                      onClick={() => handleBulkAction('reactivate')}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
                    >
                      Reativar
                    </button>
                    <button
                      onClick={() => handleBulkAction('activate')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 rounded text-sm transition-colors"
                    >
                      Ativar
                    </button>
                    <button
                      onClick={() => handleBulkAction('deactivate')}
                      className="px-3 py-1 bg-orange-600 hover:bg-orange-700 rounded text-sm transition-colors"
                    >
                      Desativar
                    </button>
                    <button
                      onClick={() => handleBulkAction('upgrade-pro')}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                    >
                      → PRO
                    </button>
                    <button
                      onClick={() => handleBulkAction('upgrade-master')}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
                    >
                      → MASTER
                    </button>
                    <button
                      onClick={() => handleBulkAction('delete')}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
                    >
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
                  <span className="text-slate-300">Carregando usuários...</span>
                </div>
              ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers(filteredUsers.map(u => u.id));
                            } else {
                              setSelectedUsers([]);
                            }
                          }}
                          className="rounded border-slate-600 bg-slate-700/50 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider group cursor-pointer hover:bg-slate-600/30 transition-colors"
                          onClick={() => handleSort('name')}>
                        <div className="flex items-center space-x-2">
                          <span>Usuário</span>
                          {getSortIcon('name')}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider group cursor-pointer hover:bg-slate-600/30 transition-colors"
                          onClick={() => handleSort('phone')}>
                        <div className="flex items-center space-x-2">
                          <span>Telefone</span>
                          {getSortIcon('phone')}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider group cursor-pointer hover:bg-slate-600/30 transition-colors"
                          onClick={() => handleSort('plan')}>
                        <div className="flex items-center space-x-2">
                          <span>Plano</span>
                          {getSortIcon('plan')}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider group cursor-pointer hover:bg-slate-600/30 transition-colors"
                          onClick={() => handleSort('created_at')}>
                        <div className="flex items-center space-x-2">
                          <span>Cadastro</span>
                          {getSortIcon('created_at')}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider group cursor-pointer hover:bg-slate-600/30 transition-colors"
                          onClick={() => handleSort('last_login')}>
                        <div className="flex items-center space-x-2">
                          <span>Último Login</span>
                          {getSortIcon('last_login')}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {filteredUsers.map(user => (
                      <tr key={user.id} className={`hover:bg-slate-700/30 transition-colors ${
                        !user.is_active ? 'opacity-60 bg-red-900/10' : ''
                      }`}>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers([...selectedUsers, user.id]);
                              } else {
                                setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                              }
                            }}
                            className="rounded border-slate-600 bg-slate-700/50 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              user.is_active ? 'bg-blue-600' : 'bg-gray-600'
                            }`}>
                              {user.email === 'pedropardal04@gmail.com' ? (
                                <Shield className="w-4 h-4 text-yellow-400" />
                              ) : (
                                <User className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <div className={`font-medium ${user.is_active ? 'text-white' : 'text-gray-400'}`}>
                                {user.name}
                                {user.email === 'pedropardal04@gmail.com' && (
                                  <span className="ml-2 text-xs bg-red-600 text-white px-2 py-1 rounded-full">
                                    ADMIN MASTER
                                  </span>
                                )}
                                {!user.is_active && (
                                  <span className="ml-2 text-xs bg-red-800 text-red-200 px-2 py-1 rounded-full">
                                    INATIVO
                                  </span>
                                )}
                              </div>
                              <div className={`text-sm ${user.is_active ? 'text-slate-400' : 'text-gray-500'}`}>
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <div>
                              <div className="text-sm text-white">{user.phone || 'Não informado'}</div>
                              {user.phone_verified ? (
                                <div className="text-xs text-green-400 flex items-center">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verificado
                                </div>
                              ) : (
                                <div className="text-xs text-orange-400 flex items-center">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Não verificado
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {editingPlan === user.id ? (
                            <div className="flex items-center space-x-2">
                              <select
                                value={tempPlan}
                                onChange={(e) => setTempPlan(e.target.value)}
                                className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="free">FREE</option>
                                <option value="pro">PRO</option>
                                <option value="master">MASTER</option>
                              </select>
                              <button
                                onClick={() => handlePlanSave(user.id)}
                                className="p-1 hover:bg-green-600/50 rounded transition-colors text-green-400"
                                title="Salvar"
                              >
                                <Save className="w-3 h-3" />
                              </button>
                              <button
                                onClick={handlePlanCancel}
                                className="p-1 hover:bg-red-600/50 rounded transition-colors text-red-400"
                                title="Cancelar"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handlePlanEdit(user.id, user.plan)}
                              className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium hover:opacity-80 transition-opacity ${getPlanColor(user.plan)}`}
                              title="Clique para editar plano"
                            >
                              {getPlanIcon(user.plan)}
                              <span>{user.plan.toUpperCase()}</span>
                              <Edit className="w-3 h-3 ml-1" />
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.is_active 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.is_active ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Ativo
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Inativo
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {formatDate(user.created_at)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {user.last_login ? formatDate(user.last_login) : 'Nunca'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {user.phone && user.phone !== 'Não informado' && (
                              <button
                                onClick={() => {
                                  // Extract only numbers from phone
                                  const phoneNumbers = user.phone?.replace(/\D/g, '') || '';
                                  // Ensure it starts with 55 (Brazil country code)
                                  const formattedPhone = phoneNumbers.startsWith('55') ? phoneNumbers : `55${phoneNumbers}`;
                                  const whatsappUrl = `https://wa.me/+${formattedPhone}?text=Olá ${user.name}! Sou da equipe Estrategista Solutions. Como posso ajudá-lo?`;
                                  window.open(whatsappUrl, '_blank');
                                }}
                                className="p-1 hover:bg-green-600/50 rounded transition-colors text-green-400"
                                title="Enviar WhatsApp"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                            )}
                            {!user.is_active && (
                              <button
                                onClick={() => onUpdateUser(user.id, { is_active: true })}
                                className="p-1 hover:bg-green-600/50 rounded transition-colors text-green-400"
                                title="Reativar usuário"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => setShowUserDetails(showUserDetails === user.id ? null : user.id)}
                              className="p-1 hover:bg-slate-600/50 rounded transition-colors"
                              title="Ver detalhes"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onUpdateUser(user.id, { is_active: !user.is_active })}
                              className="p-1 hover:bg-slate-600/50 rounded transition-colors"
                              title={user.is_active ? 'Desativar' : 'Ativar'}
                            >
                              {user.is_active ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => onDeleteUser(user.id)}
                              className="p-1 hover:bg-red-600/50 rounded transition-colors text-red-400"
                              title="Excluir usuário"
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

            {!isLoading && filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">Nenhum usuário encontrado</p>
              </div>
            )}
            <button
              onClick={() => {
                // Reativar Pedro Pardal se não estiver na lista
                const pedroExists = users.some(u => u.email === 'pedropardal04@gmail.com');
                if (!pedroExists) {
                  const adminUser = {
                    id: 'admin-pedro-pardal',
                    name: 'Pedro Pardal',
                    email: 'pedropardal04@gmail.com',
                    phone: '+55 11 99999-9999',
                    plan: 'master' as const,
                    is_active: true,
                    created_at: '2024-01-01T00:00:00.000Z',
                    phone_verified: true,
                    last_login: new Date().toISOString()
                  };
                  setUsers(prev => [adminUser, ...prev]);
                  alert('✅ Pedro Pardal adicionado como admin!');
                } else {
                  // Se existe, garantir que está ativo
                  const pedro = users.find(u => u.email === 'pedropardal04@gmail.com');
                  if (pedro && !pedro.is_active) {
                    onUpdateUser(pedro.id, { is_active: true, plan: 'master' });
                  } else {
                    alert('✅ Pedro Pardal já está ativo na lista!');
                  }
                }
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-medium"
            >
              🛡️ Reativar Pedro Admin
            </button>
        </div>
      </div>
    </div>
  );
};