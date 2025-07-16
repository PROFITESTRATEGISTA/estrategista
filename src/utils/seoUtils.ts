// SEO and Internal Linking Utilities

export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  keywords: string[];
  relatedPages: string[];
}

export const pageMetadata: Record<string, PageMeta> = {
  'pack': {
    title: 'Pack de Robôs | Estrategista Trading Solutions - Automação de Trading',
    description: 'Automatize suas operações com Pack de Robôs da Estrategista Trading Solutions. Planos Starter gratuito, PRO e MASTER com trailing stop, breakeven e gestão de risco avançada.',
    canonical: '/',
    keywords: ['pack de robôs', 'robôs trading', 'automação', 'day trade', 'profit', 'scalping'],
    relatedPages: ['/plans', '/tutorials', '/vps']
  },
  'plans': {
    title: 'Planos e Preços - Pack de Robôs | Estrategista Trading Solutions',
    description: 'Compare os planos do Pack de Robôs da Estrategista Trading Solutions: Starter gratuito, PRO (R$ 800/sem) e MASTER (R$ 1200/sem). Trailing stop, breakeven e suporte técnico incluído.',
    canonical: '/plans',
    keywords: ['preços pack de robôs', 'planos trading', 'assinatura', 'PRO', 'MASTER'],
    relatedPages: ['/', '/members', '/tutorials']
  },
  'whitelabel': {
    title: 'White Label - Soluções Personalizadas | Estrategista Trading Solutions',
    description: 'Desenvolvimento white label personalizado pela Estrategista Trading Solutions. Automações corporativas, gateways de pagamento, dashboards e soluções para o mercado financeiro.',
    canonical: '/whitelabel',
    keywords: ['white label', 'pack de robôs personalizado', 'marca própria', 'desenvolvimento'],
    relatedPages: ['/createsolution', '/', '/vps']
  },
  'createsolution': {
    title: 'Criar Solução Personalizada | Estrategista Trading Solutions',
    description: 'Configure sua solução sob medida com a Estrategista Trading Solutions. Escolha plataforma, funcionalidades e receba orçamento personalizado em 24h.',
    canonical: '/createsolution',
    keywords: ['solução personalizada', 'pack de robôs customizado', 'desenvolvimento', 'orçamento'],
    relatedPages: ['/whitelabel', '/plans', '/']
  },
  'members': {
    title: 'Área de Membros - Pack de Robôs | Estrategista Trading Solutions',
    description: 'Acesse seu Pack de Robôs da Estrategista Trading Solutions, tutoriais e suporte. Download de robôs por plano, configuração assistida e documentação completa.',
    canonical: '/members',
    keywords: ['área membros', 'download pack de robôs', 'tutoriais', 'suporte'],
    relatedPages: ['/tutorials', '/robots', '/vps']
  },
  'vps': {
    title: 'VPS para Trading - Servidores Otimizados | Estrategista Trading Solutions',
    description: 'VPS especializada para Pack de Robôs da Estrategista Trading Solutions. Latência ultra-baixa, uptime 99.9%, MT4/MT5 pré-configurado. A partir de R$ 110/mês.',
    canonical: '/vps',
    keywords: ['VPS trading', 'servidor pack de robôs', 'latência baixa', 'MT4', 'MT5'],
    relatedPages: ['/', '/plans', '/members']
  }
};

export const generateStructuredData = (pageType: string, pageData?: any) => {
  const baseData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Estrategista Trading Solutions",
    "url": "https://estrategistatradingsolutions.com.br",
    "description": "Pack de Robôs para trading automatizado no Profit, MT5 e plataformas web"
  };

  switch (pageType) {
    case 'product':
      return {
        ...baseData,
        "@type": "Product",
        "name": pageData?.name || "Pack de Robôs - Estrategista Trading Solutions",
        "description": pageData?.description,
        "offers": {
          "@type": "Offer",
          "price": pageData?.price,
          "priceCurrency": "BRL"
        }
      };
    
    case 'service':
      return {
        ...baseData,
        "@type": "Service",
        "name": pageData?.name || "Desenvolvimento de Soluções - Estrategista Trading Solutions",
        "description": pageData?.description,
        "provider": {
          "@type": "Organization",
          "name": "Estrategista Trading Solutions"
        }
      };
    
    default:
      return baseData;
  }
};

export const getCanonicalUrl = (path: string): string => {
  const baseUrl = 'https://estrategistatradingsolutions.com.br';
  return `${baseUrl}${path}`;
};

export const generateSitemap = (): string[] => {
  return [
    '/',
    '/plans',
    '/whitelabel', 
    '/createsolution',
    '/members',
    '/vps',
    '/tutorials',
    '/faq'
  ];
};