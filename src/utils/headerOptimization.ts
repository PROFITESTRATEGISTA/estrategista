// Header Structure Optimization Utilities

export interface HeaderStructure {
  level: number;
  text: string;
  id?: string;
  keywords: string[];
  context: string;
}

export interface PageHeaders {
  h1: HeaderStructure;
  h2: HeaderStructure[];
  h3: HeaderStructure[];
  h4: HeaderStructure[];
  h5: HeaderStructure[];
  h6: HeaderStructure[];
}

// SEO-optimized header templates
export const headerTemplates = {
  trading: {
    h1: "Robôs de Trading Automatizado - {brand}",
    h2: [
      "Como Funcionam os Robôs de Trading",
      "Planos e Preços de Robôs",
      "Benefícios da Automação de Trading",
      "Depoimentos de Traders"
    ],
    h3: [
      "Estratégias de Trading Incluídas",
      "Recursos por Plano",
      "Configuração e Instalação",
      "Suporte Técnico"
    ]
  },
  whiteLabel: {
    h1: "White Label de Robôs de Trading - {brand}",
    h2: [
      "O que é White Label para Trading",
      "Modelos de White Label Disponíveis",
      "Funcionalidades Incluídas",
      "Modelos de Monetização"
    ],
    h3: [
      "Desenvolvimento Personalizado",
      "Integração com Plataformas",
      "Suporte e Manutenção",
      "Casos de Uso"
    ]
  },
  plans: {
    h1: "Planos de Robôs de Trading - Preços e Recursos",
    h2: [
      "Comparativo de Planos",
      "Benefícios dos Robôs Automatizados",
      "FAQ - Planos de Trading",
      "Como Começar"
    ],
    h3: [
      "Plano Starter Gratuito",
      "Plano PRO - Recursos Avançados",
      "Plano MASTER - Máxima Performance",
      "Suporte e Garantias"
    ]
  }
};

// Header validation rules
export const headerRules = {
  // Only one H1 per page
  singleH1: true,
  
  // No skipping header levels
  sequentialLevels: true,
  
  // Minimum and maximum character counts
  characterLimits: {
    h1: { min: 30, max: 60 },
    h2: { min: 20, max: 50 },
    h3: { min: 15, max: 40 },
    h4: { min: 10, max: 35 },
    h5: { min: 8, max: 30 },
    h6: { min: 5, max: 25 }
  },
  
  // Required keywords for SEO
  requiredKeywords: {
    trading: ['robôs', 'trading', 'automatizado'],
    whiteLabel: ['white label', 'personalizado', 'marca'],
    plans: ['planos', 'preços', 'robôs']
  }
};

// Accessibility attributes for headers
export const getHeaderAccessibility = (level: number, text: string, context: string) => {
  const id = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
    
  return {
    id,
    'aria-level': level,
    'role': level === 1 ? 'banner' : 'heading',
    'tabIndex': level <= 2 ? 0 : -1, // Make main headers focusable
    'data-context': context
  };
};

// Generate structured header hierarchy
export const generateHeaderHierarchy = (pageType: string, content: any) => {
  const template = headerTemplates[pageType as keyof typeof headerTemplates];
  
  if (!template) {
    throw new Error(`No header template found for page type: ${pageType}`);
  }
  
  return {
    h1: {
      text: template.h1.replace('{brand}', 'Profit Estrategista'),
      ...getHeaderAccessibility(1, template.h1, pageType)
    },
    h2: template.h2.map((text, index) => ({
      text,
      ...getHeaderAccessibility(2, text, `${pageType}-section-${index}`)
    })),
    h3: template.h3.map((text, index) => ({
      text,
      ...getHeaderAccessibility(3, text, `${pageType}-subsection-${index}`)
    }))
  };
};

// Validate header structure
export const validateHeaders = (headers: HeaderStructure[]): string[] => {
  const errors: string[] = [];
  
  // Check for single H1
  const h1Count = headers.filter(h => h.level === 1).length;
  if (h1Count !== 1) {
    errors.push(`Found ${h1Count} H1 tags, should be exactly 1`);
  }
  
  // Check for sequential levels
  const levels = headers.map(h => h.level).sort();
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i-1] > 1) {
      errors.push(`Header level skipping detected: H${levels[i-1]} to H${levels[i]}`);
    }
  }
  
  // Check character limits
  headers.forEach(header => {
    const limits = headerRules.characterLimits[`h${header.level}` as keyof typeof headerRules.characterLimits];
    if (limits) {
      if (header.text.length < limits.min) {
        errors.push(`H${header.level} too short: "${header.text}" (${header.text.length} chars, min ${limits.min})`);
      }
      if (header.text.length > limits.max) {
        errors.push(`H${header.level} too long: "${header.text}" (${header.text.length} chars, max ${limits.max})`);
      }
    }
  });
  
  return errors;
};

// Generate SEO-friendly header component
export const createOptimizedHeader = (
  level: 1 | 2 | 3 | 4 | 5 | 6,
  text: string,
  context: string,
  className?: string
) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const accessibility = getHeaderAccessibility(level, text, context);
  
  return {
    tag: Tag,
    props: {
      ...accessibility,
      className: `${className || ''} header-optimized`,
      children: text
    }
  };
};