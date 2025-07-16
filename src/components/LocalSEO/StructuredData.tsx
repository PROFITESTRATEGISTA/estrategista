import React from 'react';

interface BusinessInfo {
  name: string;
  description: string;
  url: string;
  telephone: string;
  email: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
  serviceArea: string[];
  services: string[];
  priceRange: string;
  foundingDate: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
}

interface StructuredDataProps {
  businessInfo: BusinessInfo;
  pageType?: 'home' | 'service' | 'about' | 'contact';
  serviceSpecific?: {
    name: string;
    description: string;
    price?: string;
    category: string;
  };
}

export const StructuredData: React.FC<StructuredDataProps> = ({ 
  businessInfo, 
  pageType = 'home',
  serviceSpecific 
}) => {
  // Local Business Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": businessInfo.name,
    "description": businessInfo.description,
    "url": businessInfo.url,
    "telephone": businessInfo.telephone,
    "email": businessInfo.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": businessInfo.address.streetAddress,
      "addressLocality": businessInfo.address.addressLocality,
      "addressRegion": businessInfo.address.addressRegion,
      "postalCode": businessInfo.address.postalCode,
      "addressCountry": businessInfo.address.addressCountry
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": businessInfo.geo.latitude,
      "longitude": businessInfo.geo.longitude
    },
    "areaServed": businessInfo.serviceArea.map(area => ({
      "@type": "State",
      "name": area
    })),
    "serviceType": businessInfo.services,
    "priceRange": businessInfo.priceRange,
    "foundingDate": businessInfo.foundingDate,
    "sameAs": Object.values(businessInfo.socialMedia).filter(Boolean),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Serviços de Automação de Trading",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Robôs de Trading Automatizado",
            "description": "Desenvolvimento e implementação de robôs para automação de operações financeiras"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Soluções White Label",
            "description": "Desenvolvimento de robôs personalizados com marca própria"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Consultoria em Trading",
            "description": "Consultoria especializada em automação e estratégias de trading"
          }
        }
      ]
    }
  };

  // Service-specific schema
  const serviceSchema = serviceSpecific ? {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceSpecific.name,
    "description": serviceSpecific.description,
    "category": serviceSpecific.category,
    "provider": {
      "@type": "ProfessionalService",
      "name": businessInfo.name,
      "telephone": businessInfo.telephone,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": businessInfo.address.addressLocality,
        "addressRegion": businessInfo.address.addressRegion,
        "addressCountry": businessInfo.address.addressCountry
      }
    },
    "areaServed": businessInfo.serviceArea,
    ...(serviceSpecific.price && {
      "offers": {
        "@type": "Offer",
        "price": serviceSpecific.price,
        "priceCurrency": "BRL"
      }
    })
  } : null;

  // Organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": businessInfo.name,
    "url": businessInfo.url,
    "logo": `${businessInfo.url}/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": businessInfo.telephone,
      "contactType": "customer service",
      "areaServed": "BR",
      "availableLanguage": "Portuguese"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": businessInfo.address.addressLocality,
      "addressRegion": businessInfo.address.addressRegion,
      "addressCountry": businessInfo.address.addressCountry
    },
    "sameAs": Object.values(businessInfo.socialMedia).filter(Boolean)
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema)
        }}
      />
      
      {serviceSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceSchema)
          }}
        />
      )}
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
    </>
  );
};

export default StructuredData;