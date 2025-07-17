import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Clock, User, Phone, Mail, Eye, Edit, Trash2, CheckCircle, AlertCircle, Star, DollarSign, MessageSquare, Filter, Search, Calendar, Tag, Users, TrendingUp, BarChart3 } from 'lucide-react';
import supabase from '../lib/supabase';

interface SolutionRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  project_type: string;
  platform: string[];
  modules: Record<string, string[]>;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  estimated_value?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface SolutionRequestsPanelProps {
  onBack: () => void;
}

export const SolutionRequestsPanel: React.FC<SolutionRequestsPanelProps> = ({ onBack }) => {
  const [requests, setRequests] = useState<SolutionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<SolutionRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showDetails, setShowDetails] = useState(false);
  const [editingRequest, setEditingRequest] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<SolutionRequest>>({});

  // Load solution requests
  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('solution_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading solution requests:', error);
        // Fallback to mock data
        setRequests(getMockRequests());
      } else {
        setRequests(data || []);
      }
    } catch (error) {
      console.error('Error loading solution requests:', error);
      setRequests(getMockRequests());
    } finally {
      setLoading(false);
    }
  };

  const getMockRequests = (): SolutionRequest[] => [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@empresa.com',
      phone: '+55 11 99999-1111',
      project_type: 'robot',
      platform: ['profit', 'mt5'],
      modules: {
        riskManagement: ['fixedStop', 'trailingStop'],
        entryExit: ['stopEntry', 'marketEntry'],
        filters: ['timeFilter']
      },
      description: 'Preciso de um robô para scalping no WIN com trailing stop avançado',
      status: 'pending',
      priority: 'high',
      estimated_value: 8000,
      notes: 'Cliente interessado em começar rapidamente',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@trading.com',
      phone: '+55 11 88888-2222',
      project_type: 'app',
      platform: ['web', 'app'],
      modules: {
        webApp: ['loginApp', 'managementPanel', 'reports'],
        whiteLabel: ['brandedVersion']
      },
      description: 'Dashboard para gestão de carteira de clientes com relatórios',
      status: 'in_progress',
      priority: 'medium',
      assigned_to: 'admin',
      estimated_value: 15000,
      notes: 'Projeto em desenvolvimento, entrega prevista para próxima semana',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      updated_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: '3',
      name: 'Carlos Oliveira',
      email: 'carlos@fintech.com',
      phone: '+55 11 77777-3333',
      project_type: 'copy',
      platform: ['web', 'marketplace'],
      modules: {
        copyPortfolio: ['copyTradeCompatible', 'mirrorPortfolio'],
        webApp: ['pixPayments', 'recurringPayments']
      },
      description: 'Sistema de copy trade com gateway de pagamentos PIX',
      status: 'completed',
      priority: 'high',
      estimated_value: 25000,
      notes: 'Projeto concluído com sucesso, cliente muito satisfeito',
      created_at: new Date(Date.now() - 604800000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString()
    }
  ];

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
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in_progress': return <TrendingUp className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
    totalValue: requests.reduce((sum, r) => sum + (r.estimated_value || 0), 0)
  };

  const handleUpdateRequest = async (id: string, updates: Partial<SolutionRequest>) => {
    try {
      const { error } = await supabase
        .from('solution_requests')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating request:', error);
      }

      // Update local state
      setRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
      setEditingRequest(null);
      setEditForm({});
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta solicitação?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('solution_requests')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting request:', error);
      }

      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting request:', error);
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-400" />
              </button>
              <FileText className="w-8 h-8 text-blue-400" />
              <h1 className="text-xl font-bold">Controle de Formulários - Criar Solução</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={loadRequests}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium"
              >
                Recarregar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total de Solicitações</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Em Andamento</p>
                <p className="text-2xl font-bold text-blue-400">{stats.inProgress}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Concluídas</p>
                <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Valor Total</p>
                <p className="text-2xl font-bold text-emerald-400">{formatCurrency(stats.totalValue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar solicitações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos os status</option>
                <option value="pending">Pendente</option>
                <option value="in_progress">Em andamento</option>
                <option value="completed">Concluída</option>
                <option value="cancelled">Cancelada</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas as prioridades</option>
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
              <span className="text-slate-300">Carregando solicitações...</span>
            </div>
          ) : (
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
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Prioridade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Valor
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
                  {filteredRequests.map(request => (
                    <tr key={request.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium text-white">{request.name}</div>
                            <div className="text-sm text-slate-400">{request.email}</div>
                            {request.phone && (
                              <div className="text-xs text-slate-500">{request.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white font-medium capitalize">
                          {request.project_type === 'robot' ? 'Robô de Trading' :
                           request.project_type === 'app' ? 'Dashboard/App' :
                           request.project_type === 'copy' ? 'Copy Trade' : 'Personalizado'}
                        </div>
                        <div className="text-xs text-slate-400">
                          {request.platform.join(', ')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="capitalize">
                            {request.status === 'pending' ? 'Pendente' :
                             request.status === 'in_progress' ? 'Em andamento' :
                             request.status === 'completed' ? 'Concluída' : 'Cancelada'}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                          {request.priority === 'urgent' && <Star className="w-3 h-3 mr-1" />}
                          <span className="capitalize">
                            {request.priority === 'low' ? 'Baixa' :
                             request.priority === 'medium' ? 'Média' :
                             request.priority === 'high' ? 'Alta' : 'Urgente'}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {request.estimated_value ? formatCurrency(request.estimated_value) : 'A definir'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {formatDate(request.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowDetails(true);
                            }}
                            className="p-1 hover:bg-slate-600/50 rounded transition-colors"
                            title="Ver detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingRequest(request.id);
                              setEditForm(request);
                            }}
                            className="p-1 hover:bg-slate-600/50 rounded transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRequest(request.id)}
                            className="p-1 hover:bg-red-600/50 rounded transition-colors text-red-400"
                            title="Excluir"
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

        {filteredRequests.length === 0 && !loading && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">Nenhuma solicitação encontrada</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white">
                Detalhes da Solicitação
              </h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Client Info */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Informações do Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 text-sm">Nome</label>
                    <p className="text-white">{selectedRequest.name}</p>
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm">Email</label>
                    <p className="text-white">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm">Telefone</label>
                    <p className="text-white">{selectedRequest.phone || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm">Data da Solicitação</label>
                    <p className="text-white">{formatDate(selectedRequest.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Detalhes do Projeto</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-slate-400 text-sm">Tipo de Projeto</label>
                    <p className="text-white capitalize">
                      {selectedRequest.project_type === 'robot' ? 'Robô de Trading' :
                       selectedRequest.project_type === 'app' ? 'Dashboard/Aplicativo' :
                       selectedRequest.project_type === 'copy' ? 'Copy Trade' :
                       selectedRequest.project_type === 'other' ? 'Personalizado' : selectedRequest.project_type}
                    </p>
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm">Plataformas</label>
                    <p className="text-white">
                      {selectedRequest.platform.map(p => {
                        const platformNames = {
                          'profit': 'Profit',
                          'mt5': 'MetaTrader 5',
                          'blackarrow': 'BlackArrow',
                          'web': 'Web/API',
                          'website': 'Site',
                          'community': 'Comunidade',
                          'app': 'Aplicativo',
                          'marketplace': 'Marketplace',
                          'management': 'Sistema de Gestão',
                          'automation': 'Automações',
                          'consulting': 'Consultoria'
                        };
                        return platformNames[p] || p;
                      }).join(', ')}
                    </p>
                  </div>
                  {selectedRequest.description && (
                    <div>
                      <label className="text-slate-400 text-sm">Descrição</label>
                      <p className="text-white">{selectedRequest.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modules */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Módulos Selecionados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedRequest.modules).map(([category, modules]) => (
                    modules.length > 0 && (
                      <div key={category}>
                        <label className="text-slate-400 text-sm capitalize">
                          {category === 'riskManagement' ? 'Gestão de Risco' :
                           category === 'entryExit' ? 'Entrada/Saída' :
                           category === 'filters' ? 'Filtros' :
                           category === 'advancedLogic' ? 'Lógica Avançada' :
                           category === 'externalControl' ? 'Controle Externo' :
                           category === 'copyPortfolio' ? 'Copy/Portfólio' :
                           category === 'webApp' ? 'Web/App' :
                           category === 'whiteLabel' ? 'White Label' :
                           category === 'indicators' ? 'Indicadores' : category}
                        </label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {modules.map((module, index) => {
                            const moduleNames = {
                              'fixedStop': 'Stop Fixo',
                              'timeStop': 'Stop por Tempo',
                              'dailyStop': 'Stop Diário',
                              'trailingStop': 'Trailing Stop',
                              'breakeven': 'Breakeven',
                              'stopTargetPoints': 'Stop/Alvo por Pontos',
                              'stopTargetRiskReturn': 'Stop/Alvo Risco-Retorno',
                              'financialStop': 'Stop Financeiro',
                              'technicalStop': 'Stop Técnico',
                              'stopEntry': 'Entrada Stop',
                              'limitEntry': 'Entrada Limite',
                              'marketEntry': 'Entrada a Mercado',
                              'candleEntry': 'Entrada por Candle',
                              'externalSetup': 'Setup Externo',
                              'timeFilter': 'Filtro de Horário',
                              'partialExit': 'Saída Parcial',
                              'operationalFilters': 'Filtros Operacionais',
                              'volumeFilter': 'Filtro de Volume',
                              'volatilityFilter': 'Filtro de Volatilidade',
                              'trendFilter': 'Filtro de Tendência',
                              'marketConditionFilter': 'Filtro de Condição de Mercado',
                              'pyramid': 'Pirâmide',
                              'multipleStopZones': 'Múltiplas Zonas de Stop',
                              'externalIndicators': 'Indicadores Externos',
                              'defenses': 'Defesas (Martingale)',
                              'correlation': 'Correlação',
                              'others': 'Outros',
                              'controllerIndicator': 'Indicador Controlador',
                              'externalParameters': 'Parâmetros Externos',
                              'copyTradeCompatible': 'Compatível com Copy Trade',
                              'internalReplication': 'Replicação Interna',
                              'mirrorPortfolio': 'Carteira Espelho',
                              'loginApp': 'App com Login',
                              'managementPanel': 'Painel de Gestão',
                              'ranking': 'Ranking',
                              'reports': 'Relatórios',
                              'pixPayments': 'Pagamentos PIX',
                              'recurringPayments': 'Pagamentos Recorrentes',
                              'salesSystem': 'Sistema de Vendas',
                              'affiliateProgram': 'Programa de Afiliados',
                              'customerSupport': 'Suporte ao Cliente',
                              'notificationSystem': 'Sistema de Notificações',
                              'mobileApp': 'Aplicativo Mobile',
                              'apiIntegration': 'Integração com APIs',
                              'brandedVersion': 'Versão com Marca',
                              'codeProtection': 'Proteção de Código',
                              'licensedResale': 'Revenda Licenciada',
                              'movingAverages': 'Médias Móveis',
                              'rsi': 'RSI',
                              'macd': 'MACD',
                              'bollinger': 'Bandas de Bollinger',
                              'stochastic': 'Estocástico',
                              'fibonacci': 'Fibonacci',
                              'support': 'Suporte e Resistência',
                              'volume': 'Indicadores de Volume',
                              'candlestick': 'Padrões de Candlestick',
                              'pivot': 'Pontos de Pivô',
                              'ichimoku': 'Ichimoku',
                              'williams': 'Williams %R'
                            };
                            return (
                              <span key={index} className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-xs">
                                {moduleNames[module] || module}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRequest.status)}`}>
                    {getStatusIcon(selectedRequest.status)}
                    <span className="capitalize">
                      {selectedRequest.status === 'pending' ? 'Pendente' :
                       selectedRequest.status === 'in_progress' ? 'Em Andamento' :
                       selectedRequest.status === 'completed' ? 'Concluída' :
                       selectedRequest.status === 'cancelled' ? 'Cancelada' : selectedRequest.status}
                    </span>
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedRequest.priority)}`}>
                    <span className="capitalize">
                      {selectedRequest.priority === 'low' ? 'Baixa' :
                       selectedRequest.priority === 'medium' ? 'Média' :
                       selectedRequest.priority === 'high' ? 'Alta' :
                       selectedRequest.priority === 'urgent' ? 'Urgente' : selectedRequest.priority}
                    </span>
                  </span>
                </div>
                
                <button
                  onClick={() => {
                    // Extract only numbers from phone
                    const phoneNumbers = selectedRequest.phone?.replace(/\D/g, '') || '';
                    // Ensure it starts with 55 (Brazil country code)
                    const formattedPhone = phoneNumbers.startsWith('55') ? phoneNumbers : `55${phoneNumbers}`;
                    const whatsappUrl = `https://wa.me/+${formattedPhone}?text=Olá ${selectedRequest.name}! Recebemos sua solicitação de projeto da Estrategista Trading Solutions. Vamos conversar sobre os detalhes?`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Contatar Cliente</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};