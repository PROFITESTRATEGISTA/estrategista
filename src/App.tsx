import React, { useState, useEffect } from 'react';
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

type Page = 'pack' | 'plans' | 'whitelabel' | 'createsolution' | 'admin' | 'members' | 'vps';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('pack');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { user, loading } = useAuth();

  const handlePageChange = (page: Page) => {
    // Check if user needs to be authenticated for certain pages
    if ((page === 'admin' || page === 'members') && !user) {
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }
    
    // Check if user has admin access for admin page
    if (page === 'admin' && user && user.role !== 'admin') {
      alert('Acesso negado. Você precisa de permissões de administrador.');
      return;
    }
    
    setCurrentPage(page);
  };

  const handleAuthSuccess = () => {
    console.log('🔄 handleAuthSuccess called - closing modal');
    setShowAuthModal(false);
    // If user was trying to access admin/members, redirect them there
    if (currentPage === 'admin' || currentPage === 'members') {
      // Page will be set after auth context updates
    }
  };

  const handleNavigateToPlans = () => {
    setCurrentPage('plans');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'pack':
        return <PackRobos 
          onPageChange={handlePageChange}
          onAuthClick={(mode) => {
            setAuthMode(mode);
            setShowAuthModal(true);
          }}
        />;
      case 'plans':
        return <PlansPage onAuthClick={(mode) => {
          setAuthMode(mode);
          setShowAuthModal(true);
        }} />;
      case 'whitelabel':
        return <WhiteLabelPage onNavigateToCreateSolution={() => setCurrentPage('createsolution')} />;
      case 'createsolution':
        return <CreateSolution />;
      case 'admin':
        return user?.role === 'admin' ? (
          <AdminPanel onBack={() => setCurrentPage('pack')} />
        ) : (
          <PackRobos />
        );
      case 'members':
        return user ? <MembersArea /> : <PackRobos />;
      case 'vps':
        return <VPSServicesPage onBack={() => setCurrentPage('pack')} />;
      default:
        return <PackRobos />;
    }
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
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        user={user}
        onAuthClick={(mode) => {
          setAuthMode(mode);
          setShowAuthModal(true);
        }}
      />
      
      {renderCurrentPage()}
      
      {/* Floating Button - Always visible */}
      {(currentPage === 'pack' || currentPage === 'plans' || currentPage === 'whitelabel' || currentPage === 'createsolution' || currentPage === 'members' || currentPage === 'vps') && (
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