import React from 'react';
import { ExternalLink } from 'lucide-react';

interface InternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  title?: string;
  rel?: string;
}

export const InternalLink: React.FC<InternalLinkProps> = ({
  href,
  children,
  className = '',
  external = false,
  title,
  rel
}) => {
  const baseClasses = "text-blue-400 hover:text-blue-300 transition-colors duration-200";
  const finalClasses = `${baseClasses} ${className}`;
  
  const linkProps = {
    href,
    className: finalClasses,
    title,
    rel: external ? 'noopener noreferrer' : rel,
    ...(external && { target: '_blank' })
  };

  return (
    <a {...linkProps}>
      {children}
      {external && <ExternalLink className="w-4 h-4 inline ml-1" />}
    </a>
  );
};

// Predefined internal links for consistency
export const InternalLinks = {
  plans: {
    href: '/plans',
    text: 'ver todos os planos',
    title: 'Compare todos os planos disponíveis'
  },
  plansPro: {
    href: '/plans#pro',
    text: 'plano PRO',
    title: 'Detalhes do plano PRO'
  },
  plansMaster: {
    href: '/plans#master',
    text: 'plano MASTER',
    title: 'Detalhes do plano MASTER'
  },
  whiteLabel: {
    href: '/whitelabel',
    text: 'soluções White Label',
    title: 'Crie sua solução personalizada'
  },
  createSolution: {
    href: '/createsolution',
    text: 'criar solução personalizada',
    title: 'Configure sua solução sob medida'
  },
  tutorials: {
    href: '/members/tutorials',
    text: 'tutoriais de instalação',
    title: 'Aprenda a instalar e configurar'
  },
  vps: {
    href: '/vps',
    text: 'serviços VPS',
    title: 'VPS otimizada para trading'
  },
  members: {
    href: '/members',
    text: 'área de membros',
    title: 'Acesse sua conta'
  },
  robots: {
    href: '/members/robots',
    text: 'baixar robôs',
    title: 'Download dos seus robôs'
  }
};