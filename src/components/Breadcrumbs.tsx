import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav 
      className={`flex items-center space-x-2 text-sm text-gray-400 mb-6 ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 mx-2 text-gray-500" aria-hidden="true" />
            )}
            
            {item.current ? (
              <span 
                className="text-white font-medium"
                aria-current="page"
              >
                {index === 0 && <Home className="w-4 h-4 inline mr-1" />}
                {item.label}
              </span>
            ) : (
              <a
                href={item.href}
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                rel="noopener"
              >
                {index === 0 && <Home className="w-4 h-4 inline mr-1" />}
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Usage examples for different pages
export const getBreadcrumbs = (currentPage: string, userPlan?: string) => {
  const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
    'pack': [
      { label: 'Início', href: '/', current: true }
    ],
    'plans': [
      { label: 'Início', href: '/' },
      { label: 'Planos e Preços', current: true }
    ],
    'whitelabel': [
      { label: 'Início', href: '/' },
      { label: 'White Label', current: true }
    ],
    'createsolution': [
      { label: 'Início', href: '/' },
      { label: 'White Label', href: '/whitelabel' },
      { label: 'Criar Solução', current: true }
    ],
    'members': [
      { label: 'Início', href: '/' },
      { label: 'Área de Membros', current: true }
    ],
    'robots': [
      { label: 'Início', href: '/' },
      { label: 'Área de Membros', href: '/members' },
      { label: `Robôs ${userPlan?.toUpperCase() || ''}`, current: true }
    ],
    'tutorials': [
      { label: 'Início', href: '/' },
      { label: 'Área de Membros', href: '/members' },
      { label: 'Tutoriais', current: true }
    ],
    'vps': [
      { label: 'Início', href: '/' },
      { label: 'Serviços VPS', current: true }
    ],
    'admin': [
      { label: 'Início', href: '/' },
      { label: 'Admin Panel', current: true }
    ]
  };

  return breadcrumbMap[currentPage] || [{ label: 'Início', href: '/', current: true }];
};