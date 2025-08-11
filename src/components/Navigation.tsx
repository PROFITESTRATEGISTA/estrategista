import React, { useState } from 'react';
import { Menu, X, MessageCircle, User, LogIn, UserPlus } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role?: 'user' | 'admin';
  plan?: 'free' | 'starter' | 'pro' | 'master';
}

interface NavigationProps {
  user: User | null;
  onAuthClick: (mode: 'login' | 'register') => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, onAuthClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Pack de Robôs', href: '/' },
    { name: 'Planos', href: '/planos' },
    { name: 'White Label', href: '/white-label' },
    { name: 'Criar Solução', href: '/criar-solucao' },
    { name: 'VPS', href: '/vps' }
  ];

  const handleWhatsAppClick = () => {
    const message = "Olá! Gostaria de conhecer os Pack de Robôs da Estrategista Solutions.";
    const whatsappUrl = `https://wa.me/5511975333355?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ES</span>
              </div>
              <span className="text-white font-bold text-lg hidden sm:block">
                Estrategista Solutions
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* WhatsApp Button */}
            <button
              onClick={handleWhatsAppClick}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <a
                  href="/members"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Área de Membros</span>
                </a>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onAuthClick('login')}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Entrar</span>
                </button>
                <button
                  onClick={() => onAuthClick('register')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-1"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Cadastrar</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white focus:outline-none focus:text-white"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800 rounded-lg mt-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              
              {/* Mobile WhatsApp Button */}
              <button
                onClick={() => {
                  handleWhatsAppClick();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>

              {user ? (
                <a
                  href="/members"
                  className="bg-blue-600 hover:bg-blue-700 text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Área de Membros
                </a>
              ) : (
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      onAuthClick('login');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => {
                      onAuthClick('register');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left bg-blue-600 hover:bg-blue-700 text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    Cadastrar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;