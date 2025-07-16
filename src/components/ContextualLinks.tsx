import React from 'react';
import { InternalLink, InternalLinks } from './InternalLinkHelper';
import { ArrowRight, Download, Settings, BookOpen } from 'lucide-react';

interface ContextualLinksProps {
  context: 'pricing' | 'features' | 'technical' | 'getting-started';
  className?: string;
}

export const ContextualLinks: React.FC<ContextualLinksProps> = ({ context, className = '' }) => {
  const linkSets = {
    pricing: (
      <div className={`bg-blue-900/20 rounded-lg p-4 border border-blue-600/30 ${className}`}>
        <h4 className="text-blue-400 font-medium mb-3 flex items-center">
          <ArrowRight className="w-4 h-4 mr-2" />
          Próximos Passos
        </h4>
        <div className="space-y-2 text-sm">
          <div>
            <InternalLink href={InternalLinks.plans.href} title={InternalLinks.plans.title}>
              {InternalLinks.plans.text}
            </InternalLink>
            {' - Compare recursos e preços'}
          </div>
          <div>
            <InternalLink href={InternalLinks.tutorials.href} title={InternalLinks.tutorials.title}>
              {InternalLinks.tutorials.text}
            </InternalLink>
            {' - Aprenda a configurar'}
          </div>
          <div>
            <InternalLink href={InternalLinks.vps.href} title={InternalLinks.vps.title}>
              {InternalLinks.vps.text}
            </InternalLink>
            {' - Para operação 24/7'}
          </div>
        </div>
      </div>
    ),

    features: (
      <div className={`bg-green-900/20 rounded-lg p-4 border border-green-600/30 ${className}`}>
        <h4 className="text-green-400 font-medium mb-3 flex items-center">
          <Settings className="w-4 h-4 mr-2" />
          Recursos Relacionados
        </h4>
        <div className="space-y-2 text-sm">
          <div>
            <InternalLink href={InternalLinks.plansPro.href} title={InternalLinks.plansPro.title}>
              recursos do {InternalLinks.plansPro.text}
            </InternalLink>
            {' - Trailing stop e breakeven'}
          </div>
          <div>
            <InternalLink href={InternalLinks.plansMaster.href} title={InternalLinks.plansMaster.title}>
              recursos do {InternalLinks.plansMaster.text}
            </InternalLink>
            {' - Filtros avançados'}
          </div>
          <div>
            <InternalLink href={InternalLinks.whiteLabel.href} title={InternalLinks.whiteLabel.title}>
              {InternalLinks.whiteLabel.text}
            </InternalLink>
            {' - Personalize completamente'}
          </div>
        </div>
      </div>
    ),

    technical: (
      <div className={`bg-purple-900/20 rounded-lg p-4 border border-purple-600/30 ${className}`}>
        <h4 className="text-purple-400 font-medium mb-3 flex items-center">
          <BookOpen className="w-4 h-4 mr-2" />
          Documentação Técnica
        </h4>
        <div className="space-y-2 text-sm">
          <div>
            <InternalLink href={InternalLinks.tutorials.href} title={InternalLinks.tutorials.title}>
              guia de instalação
            </InternalLink>
            {' - Passo a passo completo'}
          </div>
          <div>
            <InternalLink href={InternalLinks.vps.href} title={InternalLinks.vps.title}>
              requisitos de VPS
            </InternalLink>
            {' - Especificações técnicas'}
          </div>
          <div>
            <InternalLink href="/faq" title="Perguntas frequentes">
              solução de problemas
            </InternalLink>
            {' - Resolva dúvidas comuns'}
          </div>
        </div>
      </div>
    ),

    'getting-started': (
      <div className={`bg-orange-900/20 rounded-lg p-4 border border-orange-600/30 ${className}`}>
        <h4 className="text-orange-400 font-medium mb-3 flex items-center">
          <Download className="w-4 h-4 mr-2" />
          Comece Agora
        </h4>
        <div className="space-y-2 text-sm">
          <div>
            <InternalLink href={InternalLinks.members.href} title={InternalLinks.members.title}>
              criar conta gratuita
            </InternalLink>
            {' - Acesso ao plano Starter'}
          </div>
          <div>
            <InternalLink href={InternalLinks.robots.href} title={InternalLinks.robots.title}>
              {InternalLinks.robots.text}
            </InternalLink>
            {' - Download imediato'}
          </div>
          <div>
            <InternalLink href={InternalLinks.tutorials.href} title={InternalLinks.tutorials.title}>
              tutorial de 5 minutos
            </InternalLink>
            {' - Configure rapidamente'}
          </div>
        </div>
      </div>
    )
  };

  return linkSets[context] || null;
};