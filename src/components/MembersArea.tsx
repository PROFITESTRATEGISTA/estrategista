import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';
import { RobotMarketplace } from './RobotMarketplace';
import { TutorialSystem } from './TutorialSystem';
import VPSServicesPage from './VPSServicesPage';
import { SetPasswordModal } from './SetPasswordModal';
import { AdminPanel } from './AdminPanel';
import { Bot, BookOpen, Settings, LogOut, User, Crown, Zap, Monitor, Shield, Key } from 'lucide-react';

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
export default function MembersArea() {
  const { user, loading: authLoading, logout, updateUser } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'robots' | 'tutorials' | 'admin' | 'vps'>('dashboard');
  const [realTimePlan, setRealTimePlan] = useState(user?.plan || 'master');
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);
  const [isSmsUser, setIsSmsUser] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // Update last login when component mounts (user accessed members area)
  useEffect(() => {
    const updateLastLoginAccess = async () => {
      if (!user?.id) return;
      
      try {
        const now = new Date().toISOString();
        
        // Update in Supabase
        const { error } = await supabase
          .from('users')
          .update({ last_login: now })
          .eq('id', user.id);
        
        if (error) {
          console.warn('Failed to update last_login on members area access:', error);
        }
        
        // Update local storage
        const savedUser = localStorage.getItem('profit_current_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          userData.lastLogin = now;
          localStorage.setItem('profit_current_user', JSON.stringify(userData));
          updateUser({ lastLogin: now });
        }
      } catch (error) {
        console.error('Error updating last login on members access:', error);
      }
    };
    
    updateLastLoginAccess();
  }, [user?.id, updateUser]);
  
  // Enhanced admin check for Pedro Pardal
  const isPedroAdmin = user?.email === 'pedropardal04@gmail.com';
  const hasAdminAccess = isPedroAdmin || user?.role === 'admin';
  
  // Check if user is SMS-only (no password set)
  useEffect(() => {
    const checkUserAuthMethod = async () => {
      if (!user?.id) return;
      
      try {
        // Get current user from Supabase Auth
        const { data: { user: authUser }, error } = await supabase.auth.getUser();
        
        if (authUser && !error) {
          // SMS user has phone but email is null in auth
          const hasPhone = !!authUser.phone;
          const isEmailNull = authUser.email === null;
          const hasEmailInMetadata = !!(authUser.user_metadata?.email);
          
          setIsSmsUser(isEmailNull && hasPhone && hasEmailInMetadata);
          
          console.log('🔍 User auth method check:', {
            hasPhone,
            isEmailNull, 
            hasEmailInMetadata,
            isSmsUser: isEmailNull && hasPhone && hasEmailInMetadata
          });
        }
      } catch (error) {
        console.error('Error checking user auth method:', error);
      }
    };
    
    checkUserAuthMethod();
  }, [user?.id]);
  
  // Update plan when user changes
  useEffect(() => {
    if (user?.plan) {
      setRealTimePlan(user.plan);
    }
  }, [user?.plan]);
  
  // Real-time plan updates from Supabase with improved sync
  useEffect(() => {
    if (!user?.id) return;
    
    // Load current plan from Supabase
    const loadCurrentPlan = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('plan')
          .eq('id', user.id)
          .single();
        
        if (data && !error) {
          const dbPlan = data.plan || 'master';
          setRealTimePlan(dbPlan);
          // Update context if different
          if (dbPlan !== user.plan) {
            updateUser({ plan: dbPlan });
          }
        }
      } catch (error) {
        console.error('Error loading current plan:', error);
      }
    };
    
    loadCurrentPlan();
    
    const subscription = supabase
      .channel('user-plan-changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'users',
          filter: `id=eq.${user.id}`
        }, 
        (payload) => {
          const newPlan = payload.new.plan || 'master';
          if (newPlan !== realTimePlan) {
            setRealTimePlan(newPlan);
            // Update user context
            updateUser({ plan: newPlan });
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id, realTimePlan, updateUser]);
  
  // Load users for admin panel
  useEffect(() => {
    if (hasAdminAccess) {
      console.log('🔄 Admin access detected, loading users...');
      loadUsers();
    }
  }, [hasAdminAccess]);

  const loadUsers = async () => {
    if (!hasAdminAccess) return;
    
    setLoadingUsers(true);
    try {
      console.log('🔍 Loading users for admin panel...');
      
      // Primeiro, garantir que o usuário admin Pedro Pardal existe
      const adminUser = {
        id: 'admin-pedro-pardal',
        name: 'Pedro Pardal',
        email: 'pedropardal04@gmail.com',
        phone: '+55 11 99999-9999',
        plan: 'master',
        is_active: true,
        created_at: '2024-01-01T00:00:00.000Z',
        phone_verified: true,
        last_login: new Date().toISOString()
      };

      // Buscar usuários da tabela public.users
      const { data: publicUsers, error: publicError } = await supabase
        .from('users')
        .select('*');
      
      console.log('📊 Public users query result:', { users: publicUsers, error: publicError });
      
      if (publicUsers && !publicError) {
        // Mapear dados da tabela public.users
        let finalUsers = publicUsers.map(publicUser => ({
          id: publicUser.id,
          name: publicUser.name || 'Usuário',
          email: publicUser.email || 'Não informado',
          phone: publicUser.phone || 'Não informado',
          plan: publicUser.plan || 'free',
          is_active: publicUser.is_active !== false, // Default true se não especificado
          created_at: publicUser.created_at || new Date().toISOString(),
          last_login: publicUser.last_login,
          phone_verified: publicUser.phone_verified || false
        }));
        
        // Garantir que Pedro Pardal está na lista
        const pedroExists = finalUsers.some(u => u.email === 'pedropardal04@gmail.com');
        if (!pedroExists) {
          finalUsers.unshift(adminUser);
        }
        
        console.log('📊 Mapped users:', finalUsers);
        setUsers(finalUsers);
      } else {
        console.error('Error loading public users:', publicError);
        // Fallback para dados mock incluindo Pedro Pardal
        const mockUsers = [
          adminUser,
          {
            id: '2',
            name: 'João Silva',
            email: 'joao@email.com',
            phone: '+55 11 88888-8888',
            plan: 'pro',
            is_active: true,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            phone_verified: true,
            last_login: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: '3',
            name: 'Maria Santos',
            email: 'maria@email.com',
            phone: '+55 11 77777-7777',
            plan: 'free',
            is_active: false,
            created_at: new Date(Date.now() - 172800000).toISOString(),
            phone_verified: false,
            last_login: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: '4',
            name: 'Carlos Oliveira',
            email: 'carlos@email.com',
            phone: '+55 11 66666-6666',
            plan: 'master',
            is_active: true,
            created_at: new Date(Date.now() - 259200000).toISOString(),
            phone_verified: true,
            last_login: new Date(Date.now() - 7200000).toISOString()
          }
        ];
        
        console.log('📊 Using mock users:', mockUsers);
        setUsers(mockUsers);
      }
      
    } catch (error) {
      console.error('Error loading users:', error);
      // Fallback final para dados mock
      const fallbackUsers = [
        {
          id: user?.id || '1',
          name: user?.name || 'Pedro Pardal',
          email: user?.email || 'pedropardal04@gmail.com',
          phone: '+55 11 99999-9999',
          plan: 'master',
          is_active: true,
          created_at: new Date().toISOString(),
          phone_verified: true,
          last_login: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Ana Costa',
          email: 'ana@email.com',
          phone: '+55 11 88888-8888',
          plan: 'pro',
          is_active: true,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          phone_verified: true,
          last_login: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      
      console.log('📊 Using fallback users:', fallbackUsers);
      setUsers(fallbackUsers);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    if (!hasAdminAccess) return;
    
    // Verificar se é o Pedro Pardal e garantir que ele sempre seja admin/master
    if (updates.email === 'pedropardal04@gmail.com' || userId === 'admin-pedro-pardal') {
      updates.plan = 'master';
      updates.is_active = true;
      console.log('🛡️ Garantindo privilégios admin para Pedro Pardal');
    }
    
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);
      
      if (error) {
        console.error('Error updating user:', error);
        console.log('⚠️ Erro no Supabase, atualizando localmente');
      }
      
      // Update local state
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
      
      if (updates.email === 'pedropardal04@gmail.com') {
        alert('✅ Pedro Pardal reativado com privilégios admin!');
      } else {
        alert('Usuário atualizado com sucesso');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      // Ainda assim atualizar localmente
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
      alert('Usuário atualizado localmente');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!hasAdminAccess) return;
    
    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (error) {
        console.error('Error deleting user:', error);
        alert('Erro ao excluir usuário');
        return;
      }
      
      // Update local state
      setUsers(prev => prev.filter(u => u.id !== userId));
      alert('Usuário excluído com sucesso');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Erro ao excluir usuário');
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  // Auth check
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white">Acesso negado. Faça login para continuar.</p>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      await logout();
      // Force clear all stored data
      localStorage.removeItem('profit_current_user');
      sessionStorage.clear();
      // Clear any stored data
      localStorage.removeItem('solution_request_pending');
      localStorage.removeItem('whatsappRedirect');
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      // Clear localStorage and redirect even if there's an error
      localStorage.removeItem('profit_current_user');
      sessionStorage.clear();
      window.location.href = '/';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'pro': return 'text-purple-400';
      case 'master': return 'text-orange-400';
      case 'free': return 'text-gray-400';
      default: return 'text-orange-400'; // Default to master styling
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'pro': return <Crown className="w-5 h-5" />;
      case 'master': return <Zap className="w-5 h-5" />;
      case 'free': return <User className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />; // Default to master icon
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Admin Panel */}
      {currentView === 'admin' && hasAdminAccess && (
        <AdminPanel 
          onBack={() => setCurrentView('dashboard')}
          users={users}
          onUpdateUser={handleUpdateUser}
          onDeleteUser={handleDeleteUser}
        />
      )}

      {/* VPS Services */}
      {currentView === 'vps' && (
        <VPSServicesPage onBack={() => setCurrentView('dashboard')} />
      )}

      {/* Main Content */}
      {currentView !== 'admin' && currentView !== 'vps' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16">
          {currentView === 'dashboard' && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-4" id="boas-vindas-membro">
                  Bem-vindo, {user?.name || user?.email || 'Trader'}!
                </h1>
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-800 ${getPlanColor(realTimePlan)}`}>
                    {getPlanIcon(realTimePlan)}
                    <span className="text-sm font-medium capitalize">
                      Plano {realTimePlan.toUpperCase()}
                      {isPedroAdmin && <span className="ml-1 text-red-400 font-bold">(ADMIN)</span>}
                    </span>
                  </div>
                  
                  {hasAdminAccess && (
                    <button
                      onClick={() => setCurrentView('admin')}
                      className="p-2 rounded-lg bg-red-900/50 hover:bg-red-900/70 transition-colors"
                      title="Admin Panel"
                    >
                      <Settings className="w-5 h-5 text-red-400" />
                    </button>
                  )}
                  
                  <button
                    onClick={handleSignOut}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    title="Sair"
                  >
                    <LogOut className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <p className="text-gray-400 text-lg">
                  Sua central da Estrategista Solutions
                </p>
              </div>

              {/* Main Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <button
                  onClick={() => setCurrentView('robots')}
                  className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 p-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <div className="text-center">
                    <Bot className="w-12 h-12 text-white mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Meus Robôs</h3>
                    <p className="text-blue-100">Ver e baixar robôs do seu plano</p>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentView('tutorials')}
                  className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 p-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <div className="text-center">
                    <BookOpen className="w-12 h-12 text-white mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Tutoriais</h3>
                    <p className="text-purple-100">Aprenda a ativar e configurar</p>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentView('vps')}
                  className="bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 p-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <div className="text-center">
                    <Settings className="w-12 h-12 text-white mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Serviços</h3>
                    <p className="text-orange-100">VPS para Trading</p>
                  </div>
                </button>
              </div>

              {/* Plan Info */}
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <h2 className="text-lg font-semibold text-white mb-4" id="info-plano-atual">Informações do Plano Atual</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-800 rounded-lg">
                    <div className={`text-2xl font-bold ${getPlanColor(realTimePlan)} mb-1`}>
                      {realTimePlan.toUpperCase()}
                    </div>
                    <div className="text-gray-400 text-sm">Plano Atual</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      {realTimePlan === 'pro' ? '6' : 
                       realTimePlan === 'master' ? '4' : 
                       realTimePlan === 'free' ? '1' : '4'}
                    </div>
                    <div className="text-gray-400 text-sm">Robôs Disponíveis</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-green-400 mb-1">Ativo</div>
                    <div className="text-gray-400 text-sm">Status</div>
                  </div>
                </div>
                
                {/* Admin Access */}
                {hasAdminAccess && (
                  <div className="mt-6 p-4 bg-red-900/20 border border-red-600/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-6 h-6 text-red-400" />
                        <div>
                          <div className="text-white font-medium">Acesso Administrativo</div>
                          <div className="text-red-300 text-sm">
                            {isPedroAdmin ? 'Pedro Pardal - Admin Master' : 'Controle total do sistema'}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setCurrentView('admin')}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Admin Panel
                      </button>
                    </div>
                  </div>
                )}

                {/* Password Setting for SMS Users */}
                {isSmsUser && user?.email && (
                  <div className="mt-6 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Key className="w-6 h-6 text-blue-400" />
                        <div>
                          <div className="text-white font-medium">Configuração de Senha</div>
                          <div className="text-blue-300 text-sm">
                            Defina uma senha para fazer login com email e senha
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowSetPasswordModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Definir Senha
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Alternative for Robots */}
              <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 lg:hidden">
                <div className="text-center">
                  <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Meus Robôs</h3>
                  <p className="text-gray-400">Disponível apenas no desktop</p>
                </div>
              </div>
            </div>
          )}

          {currentView === 'robots' && (
            <RobotMarketplace 
              userPlan={realTimePlan}
              onBack={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'tutorials' && (
            <TutorialSystem onBack={() => setCurrentView('dashboard')} />
          )}
        </main>
      )}

      {/* SetPasswordModal for SMS Users */}
      {showSetPasswordModal && user?.email && (
        <SetPasswordModal
          isOpen={showSetPasswordModal}
          onClose={() => setShowSetPasswordModal(false)}
          userEmail={user.email}
        />
      )}
    </div>
  );
}