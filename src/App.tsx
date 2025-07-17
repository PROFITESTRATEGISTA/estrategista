import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const handleNavigateToPlans = () => {
    window.location.href = '/planos';
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
        {/* Pack de Robôs - Página Principal */}
        <Route 
          path="/" 
          element={
            <PackRobos 
              onAuthClick={(mode) => {
                setAuthMode(mode);
                setShowAuthModal(true);
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
        
        {/* FAQ - Redirect to plans with anchor */}
        <Route 
          path="/planos/faq" 
          element={
            <PlansPage 
              onAuthClick={(mode) => {
                setAuthMode(mode);
                setShowAuthModal(true);
              }}
              scrollToFAQ={true}
            />
          } 
        />
        
        {/* White Label */}
        <Route 
          path="/white-label" 
          element={<WhiteLabelPage />} 
        />
        
        {/* Criar Solução */}
        <Route 
          path="/criar-solucao" 
          element={<CreateSolution />} 
        />
        
        {/* Área de Membros - Protegida */}
        <Route 
          path="/members" 
          element={
            user ? (
              <MembersArea />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        {/* Admin Panel - Protegida */}
        <Route 
          path="/admin" 
          element={
            user?.role === 'admin' ? (
              <AdminPanel onBack={() => window.location.href = '/'} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        {/* VPS Services */}
        <Route 
          path="/vps" 
          element={<VPSServicesPage onBack={() => window.location.href = '/'} />} 
        />
        
        {/* Redirect old routes */}
        <Route path="/pack" element={<Navigate to="/" replace />} />
        <Route path="/plans" element={<Navigate to="/planos" replace />} />
        <Route path="/whitelabel" element={<Navigate to="/white-label" replace />} />
        <Route path="/createsolution" element={<Navigate to="/criar-solucao" replace />} />
        
        {/* 404 - Redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Floating Button - Sempre visível */}
      <FloatingButton 
        onNavigateToPlans={handleNavigateToPlans}
        onOpenRegister={() => {
          setAuthMode('register');
          setShowAuthModal(true);
        }}
      />
      
      {/* Modal de Login */}
      {showAuthModal && (
        <LoginModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
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