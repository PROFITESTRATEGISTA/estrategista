import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, Menu, X, User, LogOut, Shield } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  plan?: 'starter' | 'pro' | 'master';
}

interface NavigationProps {
  user: User | null;
  onAuthClick: (mode: 'login' | 'register') => void;
}

const Navigation = ({ user, onAuthClick }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  const handleLogout = () => {
    try {
      // Clear all user data
      localStorage.removeItem('profit_current_user');
      localStorage.removeItem('profit_users');
      sessionStorage.clear();
      
      // Force redirect to home page and reload
      window.location.href = '/';
      window.location.reload();
    } catch (error) {
      console.error('Erro no logout:', error);
      // Fallback: force reload
      window.location.reload();
    }
  };

  const navItems = [
    { id: '/', label: '🤖 Pack de Robôs', emoji: '🤖' },
    { id: '/planos', label: '💎 Planos', emoji: '💎' },
    { id: '/planos#faq', label: '❓ FAQ', emoji: '❓', isAnchor: true },
    { id: '/white-label', label: '🤝 White Label', emoji: '🤝' },
    { id: '/criar-solucao', label: '🛠️ Criar Solução', emoji: '🛠️' }
  ];

  const authItems = user ? [
    { id: '/members', label: '👤 Área de Membros', emoji: '👤' },
  ] : [];

  const getPlanBadgeColor = (plan?: string) => {
    switch (plan) {
      case 'starter': return 'bg-emerald-100 text-emerald-800';
      case 'pro': return 'bg-blue-100 text-blue-800';
      case 'master': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <nav className="bg-gray-950 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 min-w-0">
            <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            <span className="text-base sm:text-lg font-bold text-white truncate">
              Estrategista Solutions
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2 flex-1 justify-end mr-4">
            {/* Main Nav Items */}
            <div className="flex space-x-0.5 xl:space-x-1">
              {navItems.map((item) => (
                {item.isAnchor ? (
                  <a
                    key={item.id}
                    href={item.id}
                    className={`px-1.5 xl:px-3 py-1.5 rounded-lg font-medium transition-all duration-300 text-xs whitespace-nowrap ${
                      location.pathname === '/planos' && item.id.includes('#faq')
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-transparent text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {item.id === '/planos' && (
                      <span className="bg-red-500 text-white px-1 py-0.5 rounded-full text-xs font-bold mr-1">
                        70% OFF
                      </span>
                    )}
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    to={item.id}
                    className={`px-1.5 xl:px-3 py-1.5 rounded-lg font-medium transition-all duration-300 text-xs whitespace-nowrap ${
                      location.pathname === item.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-transparent text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {item.id === '/planos' && (
                      <span className="bg-red-500 text-white px-1 py-0.5 rounded-full text-xs font-bold mr-1">
                        70% OFF
                      </span>
                    )}
                    {item.label}
                  </Link>
                )}
              ))}
            </div>
                  key={item.id}
                  to={item.id}
                  className={`px-1.5 xl:px-3 py-1.5 rounded-lg font-medium transition-all duration-300 text-xs whitespace-nowrap ${
                    location.pathname === item.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-transparent text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {item.id === '/planos' && (
                    <span className="bg-red-500 text-white px-1 py-0.5 rounded-full text-xs font-bold mr-1">
                      70% OFF
                    </span>
                  )}
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Auth Items */}
            <div className="border-l border-gray-700 pl-1.5 xl:pl-3 flex items-center space-x-0.5 xl:space-x-1 flex-shrink-0">
              {authItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.id}
                  className={`px-1.5 xl:px-3 py-1.5 rounded-lg font-medium transition-all duration-300 text-xs whitespace-nowrap ${
                    location.pathname === item.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-transparent text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* User Menu or Auth Buttons */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-1 bg-gray-800 hover:bg-gray-700 text-white px-1.5 xl:px-3 py-1.5 rounded-lg transition-colors duration-300"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-xs hidden xl:inline">{user.name}</span>
                    {user.plan && (
                      <span className={`px-1 py-0.5 rounded-full text-xs font-medium ${getPlanBadgeColor(user.plan)}`}>
                        {user.plan.toUpperCase()}
                      </span>
                    )}
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-0.5 xl:space-x-1">
                  <button
                    onClick={() => onAuthClick('login')}
                    className="bg-transparent text-gray-300 hover:text-white hover:bg-gray-800 px-1.5 xl:px-3 py-1.5 rounded-lg font-medium transition-colors duration-300 text-xs"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => onAuthClick('register')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-1.5 xl:px-3 py-1.5 rounded-lg font-medium transition-colors duration-300 text-xs"
                  >
                    Cadastrar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-800">
            <div className="px-4 pt-4 pb-4 space-y-3">
              {/* Main Nav Items */}
              {navItems.map((item) => (
                {item.isAnchor ? (
                  <a
                    key={item.id}
                    href={item.id}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-300 text-base ${
                      location.pathname === '/planos' && item.id.includes('#faq')
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {item.id === '/planos' && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold mr-2">
                        70% OFF
                      </span>
                    )}
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    to={item.id}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-300 text-base ${
                      location.pathname === item.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {item.id === '/planos' && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold mr-2">
                        70% OFF
                      </span>
                    )}
                    {item.label}
                  </Link>
                )}
                  key={item.id}
                  to={item.id}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-300 text-base ${
                    location.pathname === item.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {item.id === '/planos' && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold mr-2">
                      70% OFF
                    </span>
                  )}
                  {item.label}
                </Link>
              ))}

              {/* Auth Items */}
              {authItems.length > 0 && (
                <div className="border-t border-gray-700 pt-4 mt-4">
                  {authItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.id}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-300 text-base ${
                        location.pathname === item.id
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}

              {/* User Section */}
              <div className="border-t border-gray-700 pt-4 mt-4">
                {user ? (
                  <div className="space-y-3">
                    <div className="px-4 py-3 bg-gray-800 rounded-lg">
                      <div className="text-base font-medium text-white">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                      {user.plan && (
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getPlanBadgeColor(user.plan)}`}>
                          {user.plan.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg flex items-center space-x-2 text-base"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sair</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => onAuthClick('login')}
                      className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg text-base"
                    >
                      Entrar
                    </button>
                    <button
                      onClick={() => onAuthClick('register')}
                      className="w-full text-left px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base"
                    >
                      Cadastrar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;