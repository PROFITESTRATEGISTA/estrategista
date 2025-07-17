import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import PackRobos from './components/PackRobos';
import WhiteLabelPage from './components/WhiteLabelPage';
import CreateSolution from './components/CreateSolution';
import PlansPage from './components/PlansPage';
import { AdminPanel } from './components/AdminPanel';
import MembersArea from './components/MembersArea';
import VPSServicesPage from './components/VPSServicesPage';
import FloatingButton from './components/FloatingButton';
import LoginModal from './components/LoginModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<'login' | 'register'>('login');
  const { user, loading } = useAuth();
  const location = useLocation();

  const handleAuthSuccess = () => {
    console.log('🔄 handleAuthSuccess called - closing modal');
    setShowAuthModal(false);
  };

  const handleNavigateToPlans = () => {
    window.location.href = '/planos';
  };

  // Check if current page should show floating button
  const shouldShowFloatingButton = () => {
    const currentPath = location.pathname;
    return ['/', '/planos', '/white-label', '/criar-solucao', '/members', '/vps'].includes(currentPath);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation 
        user={user}
        onAuthClick={(mode) => {
          setAuthMode(mode);
          setShowAuthModal(true);
        }}
      />
      
      <Routes>
        {/* Pack de Robôs - Página inicial */}
        <Route 
          path="/" 
          element={
            <PackRobos 
              onAuthClick={(mode) => {
                setAuthMode(mode);
                setShowAuthModal(true);
              }}
              onPageChange={(page) => {
                if (page === 'whitelabel') window.location.href = '/white-label';
                if (page === 'createsolution') window.location.href = '/criar-solucao';
                if (page === 'plans') window.location.href = '/planos';
                if (page === 'admin') window.location.href = '/admin';
                if (page === 'members') window.location.href = '/members';
                if (page === 'vps') window.location.href = '/vps';
              }}
            />
          } 
        />
        
        {/* Planos */}
        <Route 
          path="/planos" 
          element={
            <PlansPage 
              onAuthClick={(mode) => {
                setAuthMode(mode);
                setShowAuthModal(true);
              }} 
            />
          } 
        />
        
        {/* White Label */}
        <Route 
          path="/white-label" 
          element={
            <WhiteLabelPage 
              onNavigateToCreateSolution={() => window.location.href = '/criar-solucao'} 
            />
          } 
        />
        
        {/* Criar Solução */}
        <Route 
          path="/criar-solucao" 
          element={<CreateSolution />} 
        />
        
        {/* Admin Panel */}
        <Route 
          path="/admin" 
          element={
            user?.role === 'admin' ? (
              <AdminPanel onBack={() => window.location.href = '/'} />
            ) : (
              <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Acesso negado</div>
              </div>
            )
          } 
        />
        
        {/* Área de Membros */}
        <Route 
          path="/members" 
          element={
            user ? <MembersArea /> : (
              <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Faça login para acessar</div>
              </div>
            )
          } 
        />
        
        {/* VPS Services */}
        <Route 
          path="/vps" 
          element={<VPSServicesPage onBack={() => window.location.href = '/'} />} 
        />
        
        {/* Redirect old routes */}
        <Route path="/pack" element={<div>{window.location.href = '/'}</div>} />
        <Route path="/plans" element={<div>{window.location.href = '/planos'}</div>} />
        <Route path="/whitelabel" element={<div>{window.location.href = '/white-label'}</div>} />
        <Route path="/createsolution" element={<div>{window.location.href = '/criar-solucao'}</div>} />
      </Routes>
      
      {/* Floating Button - Show on specific pages */}
      {shouldShowFloatingButton() && (
        <FloatingButton 
          onNavigateToPlans={handleNavigateToPlans}
          onOpenRegister={() => {
            setAuthMode('register');
            setShowAuthModal(true);
          }}
        />
      )}
      
      {showAuthModal && (
        <LoginModal
          isOpen={showAuthModal}
          onClose={() => {
            console.log('🔄 Modal onClose called - closing modal');
            setShowAuthModal(false);
          }}
          onLogin={handleAuthSuccess}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;