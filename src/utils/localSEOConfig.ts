// Local SEO Configuration
export const businessInfo = {
  name: "Estrategista Solutions",
  description: "Especialistas em desenvolvimento de Pack de Robôs para trading automatizado, soluções white label e automação financeira para traders e investidores brasileiros.",
  url: "https://estrategistatradingsolutions.com.br",
  telephone: "+55 (11) 99999-9999",
  email: "contato@estrategistatradingsolutions.com.br",
  address: {
    streetAddress: "Rua dos Traders, 123",
    addressLocality: "São Paulo",
    addressRegion: "SP",
    postalCode: "01234-567",
    addressCountry: "BR"
  },
  geo: {
    latitude: -23.5505,
    longitude: -46.6333
  },
  serviceArea: [
    "São Paulo",
    "Rio de Janeiro",
    "Minas Gerais",
    "Paraná",
    "Rio Grande do Sul",
    "Santa Catarina",
    "Bahia",
    "Pernambuco",
    "Ceará",
    "Goiás",
    "Distrito Federal",
    "Espírito Santo",
    "Mato Grosso",
    "Mato Grosso do Sul",
    "Pará",
    "Paraíba",
    "Alagoas",
    "Sergipe",
    "Piauí",
    "Maranhão",
    "Tocantins",
    "Rondônia",
    "Roraima",
    "Amapá",
    "Acre",
    "Rio Grande do Norte"
  ],
  services: [
    "Desenvolvimento de Pack de Robôs para Trading",
    "Soluções White Label",
    "Automação de Trading",
    "Consultoria em Trading Automatizado",
    "Integração com Plataformas de Trading",
    "Suporte Técnico Especializado"
  ],
  priceRange: "$$",
  foundingDate: "2020-01-01",
  socialMedia: {
    facebook: "https://facebook.com/estrategistatradingsolutions",
    instagram: "https://instagram.com/estrategistatradingsolutions",
    linkedin: "https://linkedin.com/company/estrategistatradingsolutions",
    youtube: "https://youtube.com/@estrategistatradingsolutions"
  },
  businessHours: {
    "Segunda-feira": "09:00 - 18:00",
    "Terça-feira": "09:00 - 18:00",
    "Quarta-feira": "09:00 - 18:00",
    "Quinta-feira": "09:00 - 18:00",
    "Sexta-feira": "09:00 - 18:00",
    "Sábado": "09:00 - 12:00",
    "Domingo": "Fechado"
  }
};

// Location-specific keywords for SEO
export const locationKeywords = {
  primary: [
    "robôs de trading São Paulo",
    "automação trading Brasil",
    "robôs trading automatizado SP",
    "desenvolvimento robôs financeiros"
  ],
  secondary: [
    "trading automatizado Rio de Janeiro",
    "robôs Profit Minas Gerais",
    "automação financeira Paraná",
    "trading bots Brasil"
  ],
  longTail: [
    "empresa desenvolvimento robôs trading São Paulo",
    "consultoria automação trading Brasil",
    "robôs personalizados trading white label",
    "suporte técnico robôs trading brasileiro"
  ]
};

// Google Business Profile optimization suggestions
export const googleBusinessOptimization = {
  categories: [
    "Consultoria em software",
    "Serviços de desenvolvimento de software",
    "Consultoria financeira",
    "Serviços de tecnologia da informação"
  ],
  attributes: [
    "Atendimento online",
    "Consultoria especializada",
    "Suporte técnico",
    "Desenvolvimento personalizado"
  ],
  posts: {
    frequency: "2-3 vezes por semana",
    types: [
      "Atualizações de produtos",
      "Dicas de trading",
      "Casos de sucesso",
      "Novidades do mercado"
    ]
  },
  photos: {
    required: [
      "Logo da empresa",
      "Equipe trabalhando",
      "Screenshots dos robôs",
      "Escritório/ambiente de trabalho"
    ],
    recommended: [
      "Gráficos de performance",
      "Depoimentos em vídeo",
      "Eventos e apresentações",
      "Certificações"
    ]
  }
};

// NAP consistency checker
export const napConsistencyChecker = {
  validateNAP: (name: string, address: string, phone: string) => {
    const issues = [];
    
    // Name consistency
    if (name !== businessInfo.name) {
      issues.push(`Nome inconsistente: "${name}" vs "${businessInfo.name}"`);
    }
    
    // Phone formatting
    const cleanPhone = phone.replace(/\D/g, '');
    const standardPhone = businessInfo.telephone.replace(/\D/g, '');
    if (cleanPhone !== standardPhone) {
      issues.push(`Telefone inconsistente: "${phone}" vs "${businessInfo.telephone}"`);
    }
    
    // Address consistency (basic check)
    if (!address.includes(businessInfo.address.addressLocality)) {
      issues.push(`Cidade não encontrada no endereço: "${address}"`);
    }
    
    return {
      isConsistent: issues.length === 0,
      issues
    };
  }
};

export default businessInfo;