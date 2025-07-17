import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, DollarSign, Activity, Server, Shield, Zap, Settings, Monitor, Database, Globe, CreditCard, Building2, Award, Clock, CheckCircle, AlertTriangle, Eye, EyeOff, Download, Search, Filter, MoreVertical, Edit, Trash2, UserPlus, Mail, Phone, Calendar, MapPin, Star, Crown, Gift, Target, BarChart3, PieChart, LineChart, ArrowUp, ArrowDown, Percent, RefreshCw, Bell, MessageSquare, FileText, ExternalLink, Copy, Share2, Lock, Unlock, Plus, Minus, X, Check, AlertCircle, Info, HelpCircle, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Home, Package, Briefcase, Headphones, LogOut, User, Menu, Save } from 'lucide-react';

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

interface AutomationProject {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  platform: string[];
  modules: {
    riskManagement: string[];
    entryExit: string[];
    filters: string[];
    advancedLogic: string[];
    externalControl: string[];
    copyPortfolio: string[];
    webApp: string[];
    whiteLabel: string[];
    indicators: string[];
  };
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  estimatedValue?: string;
  createdAt: string;
  updatedAt: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack, users = [], onUpdateUser, onDeleteUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [showInactive, setShowInactive] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showUserDetails, setShowUserDetails] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [tempPlan, setTempPlan] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<'users' | 'projects'>('users');
  const [projects, setProjects] = useState<AutomationProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<AutomationProject | null>(null);
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [projectSearch, setProjectSearch] = useState('');

  // Debug logging
  useEffect(() => {
    console.log('🔍 AdminPanel received users:', users);
    console.log('📊 Users count:', users.length);
    setIsLoading(false);
  }, [users]);

  // Load automation projects
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    // Mock data for automation projects
    const mockProjects: AutomationProject[] = [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@empresa.com',
        phone: '(11) 99999-9999',
        projectType: 'robot',
        platform: ['profit', 'mt5'],
        modules: {
          riskManagement: ['fixedStop', 'trailingStop', 'breakeven'],
          entryExit: ['stopEntry', 'marketEntry'],
          filters: ['timeFilter', 'volumeFilter'],
          advancedLogic: ['pyramid'],
          externalControl: [],
          copyPortfolio: ['copyTradeCompatible'],
          webApp: [],
          whiteLabel: ['brandedVersion'],
          indicators: ['movingAverages', 'rsi']
        },
        description: 'Preciso de um robô para scalping no WIN com trailing stop avançado e gestão de risco automática.',
        status: 'pending',
        priority: 'high',
        estimatedValue: 'R$ 8.000 - R$ 12.000',
        createdAt: '2025-01-15T10:30:00Z',
        updatedAt: '2025-01-15T10:30:00Z'
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@trading.com',
        phone: '(21) 88888-8888',
        projectType: 'app',
        platform: ['web', 'app'],
        modules: {
          riskManagement: ['dailyStop', 'financialStop'],
          entryExit: ['limitEntry'],
          filters: ['timeFilter'],
          advancedLogic: [],
          externalControl: [],
          copyPortfolio: ['mirrorPortfolio'],
          webApp: ['loginApp', 'managementPanel', 'pixPayments', 'salesSystem'],
          whiteLabel: ['brandedVersion', 'licensedResale'],
          indicators: ['bollinger', 'macd']
        },
        description: 'Quero criar uma plataforma de copy trade com minha marca, incluindo sistema de pagamentos PIX e gestão de usuários.',
        status: 'in_progress',
        priority: 'medium',
        estimatedValue: 'R$ 15.000 - R$ 25.000',
        createdAt: '2025-01-12T14:20:00Z',
        updatedAt: '2025-01-14T16:45:00Z'
      },
      {
        id: '3',
        name: 'Carlos Oliveira',
        email: 'carlos@corretora.com',
        phone: '(11) 77777-7777',
        projectType: 'copy',
        platform: ['profit', 'blackarrow'],
        modules: {
          riskManagement: ['trailingStop', 'breakeven', 'stopTargetRiskReturn'],
          entryExit: ['candleEntry', 'externalSetup'],
          filters: ['volatilityFilter', 'trendFilter'],
          advancedLogic: ['correlation', 'defenses'],
          externalControl: ['controllerIndicator'],
          copyPortfolio: ['copyTradeCompatible', 'internalReplication'],
          webApp: ['ranking', 'reports'],
          whiteLabel: ['codeProtection'],
          indicators: ['fibonacci', 'ichimoku', 'pivot']
        },
        description: 'Sistema corporativo para nossa corretora com copy trade, ranking de traders e relatórios avançados.',
        status: 'completed',
        priority: 'high',
        estimatedValue: 'R$ 30.000 - R$ 50.000',
        createdAt: '2025-01-08T09:15:00Z',
        updatedAt: '2025-01-13T18:30:00Z'
      }
    ];
    setProjects(mockProjects);
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === 'all' || user.plan === filterPlan;
    const matchesActive = showInactive || user.is_active;
    
    return matchesSearch && matchesPlan && matchesActive;
  });

  console.log('🔍 Filtered users:', filteredUsers);

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
                         project.email.toLowerCase().includes(projectSearch.toLowerCase()) ||
                         project.description.toLowerCase().includes(projectSearch.toLowerCase());
    const matchesFilter = projectFilter === 'all' || project.status === projectFilter;
    return matchesSearch && matchesFilter;
  });

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

  const projectStats = {
    total: projects.length,
    pending: projects.filter(p => p.status === 'pending').length,
    inProgress: projects.filter(p => p.status === 'in_progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    highPriority: projects.filter(p => p.priority === 'high').length
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateProjectStatus = (projectId: string, status: AutomationProject['status']) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, status, updatedAt: new Date().toISOString() }
        : p
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-blue-400" />
              <h1 className="text-xl font-bold">Gerenciamento de Usuários - Estrategista Trading Solutions</h1>
            </div>
            
            <div className="flex items-center space-x-4">
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
                <div className="flex items-center space-x-4">
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Usuário
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Telefone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Plano
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Cadastro
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Último Login
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
        )}

        {/* Projects Management */}
        {currentTab === 'projects' && (
          <div className="space-y-6">
            {/* Project Filters */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Buscar projetos..."
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <select
                    value={projectFilter}
                    onChange={(e) => setProjectFilter(e.target.value)}
                    className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos os status</option>
                    <option value="pending">Pendentes</option>
                    <option value="in_progress">Em Andamento</option>
                    <option value="completed">Concluídos</option>
                    <option value="cancelled">Cancelados</option>
                  </select>
                </div>
              </div>
            {/* Projects Table */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Projeto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Plataformas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Prioridade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Valor Estimado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {filteredProjects.map(project => (
                      <tr key={project.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-white">{project.name}</div>
                            <div className="text-sm text-slate-400">{project.email}</div>
                            <div className="text-sm text-slate-400">{project.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-white font-medium capitalize">
                            {project.projectType === 'robot' && '🤖 Sistema de Automação'}
                            {project.projectType === 'copy' && '💳 Gateway de Pagamentos'}
                            {project.projectType === 'app' && '📊 Dashboard/Painel'}
                            {project.projectType === 'other' && '🔧 Automações Corporativas'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {project.platform.slice(0, 3).map((platform, idx) => (
                              <span key={idx} className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs">
                                {platform.toUpperCase()}
                              </span>
                            ))}
                            {project.platform.length > 3 && (
                              <span className="px-2 py-1 bg-slate-600 text-slate-400 rounded text-xs">
                                +{project.platform.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={project.status}
                            onChange={(e) => updateProjectStatus(project.id, e.target.value as AutomationProject['status'])}
                            className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(project.status)}`}
                          >
                            <option value="pending">Pendente</option>
                            <option value="in_progress">Em Andamento</option>
                            <option value="completed">Concluído</option>
                            <option value="cancelled">Cancelado</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                            {project.priority === 'high' && '🔴 Alta'}
                            {project.priority === 'medium' && '🟡 Média'}
                            {project.priority === 'low' && '🟢 Baixa'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {project.estimatedValue || 'A definir'}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {formatDate(project.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setSelectedProject(project)}
                              className="p-1 hover:bg-slate-600/50 rounded transition-colors text-blue-400"
                              title="Ver detalhes completos"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => window.open(`mailto:${project.email}?subject=Projeto de Automação - ${project.name}&body=Olá ${project.name},%0A%0AEntramos em contato sobre seu projeto de automação.%0A%0ADetalhes:%0A- Tipo: ${project.projectType}%0A- Plataformas: ${project.platform.join(', ')}%0A%0AAtenciosamente,%0AEquipe Estrategista Trading Solutions`, '_blank')}
                              className="p-1 hover:bg-slate-600/50 rounded transition-colors text-green-400"
                              title="Enviar email"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => window.open(`https://wa.me/${project.phone.replace(/\D/g, '')}?text=Olá ${project.name}! Entramos em contato sobre seu projeto de automação.`, '_blank')}
                              className="p-1 hover:bg-slate-600/50 rounded transition-colors text-green-400"
                              title="WhatsApp"
                            >
                              <MessageSquare className="w-4 h-4" />
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
            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">Nenhum projeto encontrado</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white">
                Detalhes do Projeto - {selectedProject.name}
              </h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
            <div className="p-6 space-y-6">
              {/* Client Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Informações do Cliente</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-slate-400">Nome:</span> <span className="text-white">{selectedProject.name}</span></div>
                    <div><span className="text-slate-400">Email:</span> <span className="text-white">{selectedProject.email}</span></div>
                    <div><span className="text-slate-400">Telefone:</span> <span className="text-white">{selectedProject.phone}</span></div>
                    <div><span className="text-slate-400">Data:</span> <span className="text-white">{formatDate(selectedProject.createdAt)}</span></div>
                  </div>
                </div>
                className="text-slate-400 hover:text-white transition-colors"
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Status do Projeto</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedProject.status)}`}>
                        {selectedProject.status === 'pending' && 'Pendente'}
                        {selectedProject.status === 'in_progress' && 'Em Andamento'}
                        {selectedProject.status === 'completed' && 'Concluído'}
                        {selectedProject.status === 'cancelled' && 'Cancelado'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400">Prioridade:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedProject.priority)}`}>
                        {selectedProject.priority === 'high' && '🔴 Alta'}
                        {selectedProject.priority === 'medium' && '🟡 Média'}
                        {selectedProject.priority === 'low' && '🟢 Baixa'}
                      </span>
                    </div>
                    <div><span className="text-slate-400">Valor Estimado:</span> <span className="text-green-400 font-medium">{selectedProject.estimatedValue}</span></div>
                  </div>
                </div>
              </div>
              >
              {/* Project Details */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Detalhes do Projeto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400">Tipo:</span>
                    <div className="text-white font-medium">
                      {selectedProject.projectType === 'robot' && '🤖 Sistema de Automação Financeira'}
                      {selectedProject.projectType === 'copy' && '💳 Gateway de Pagamentos'}
                      {selectedProject.projectType === 'app' && '📊 Dashboard/Painel de Controle'}
                      {selectedProject.projectType === 'other' && '🔧 Automações Corporativas'}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Plataformas:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedProject.platform.map((platform, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-600 text-slate-200 rounded text-xs">
                          {platform.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
                <X className="h-6 w-6" />
              {/* Modules Selected */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Funcionalidades Selecionadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(selectedProject.modules).map(([category, modules]) => (
                    modules.length > 0 && (
                      <div key={category} className="bg-slate-600/50 rounded p-3">
                        <h4 className="text-sm font-medium text-slate-300 mb-2 capitalize">
                          {category.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <div className="space-y-1">
                          {modules.map((module, idx) => (
                            <div key={idx} className="text-xs text-slate-400">• {module}</div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
              </button>
              {/* Description */}
              {selectedProject.description && (
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Descrição do Cliente</h3>
                  <p className="text-slate-300 leading-relaxed">{selectedProject.description}</p>
                </div>
              )}
            </div>
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => window.open(`mailto:${selectedProject.email}?subject=Projeto de Automação - ${selectedProject.name}&body=Olá ${selectedProject.name},%0A%0AEntramos em contato sobre seu projeto de automação.`, '_blank')}
                  className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Enviar Email</span>
                </button>
                <button
                  onClick={() => window.open(`https://wa.me/${selectedProject.phone.replace(/\D/g, '')}?text=Olá ${selectedProject.name}! Entramos em contato sobre seu projeto de automação.`, '_blank')}
                  className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => updateProjectStatus(selectedProject.id, 'in_progress')}
                  className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Marcar como Em Andamento</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};