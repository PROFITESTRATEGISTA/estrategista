// Local SEO Components Export
export { default as StructuredData } from './StructuredData';
export { default as NAPConsistency } from './NAPConsistency';
export { default as LocationContent } from './LocationContent';
export { default as GoogleBusinessIntegration } from './GoogleBusinessIntegration';
export { default as LocalSEOWrapper } from './LocalSEOWrapper';

// Configuration and utilities
export { businessInfo, locationKeywords, googleBusinessOptimization, napConsistencyChecker } from '../utils/localSEOConfig';

// Usage examples for different pages:

/*
// Homepage implementation:
<LocalSEOWrapper
  pageType="home"
  showLocationContent={true}
  showGoogleBusiness={true}
  showNAP={true}
  napVariant="footer"
/>

// Service page implementation:
<LocalSEOWrapper
  pageType="service"
  serviceSpecific={{
    name: "Robôs de Trading Automatizado",
    description: "Desenvolvimento de robôs personalizados para automação de trading",
    price: "R$ 800",
    category: "Automação Financeira"
  }}
  showNAP={true}
  napVariant="contact"
/>

// Contact page implementation:
<LocalSEOWrapper
  pageType="contact"
  showGoogleBusiness={true}
  showNAP={true}
  napVariant="contact"
/>
*/