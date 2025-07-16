import React from 'react';
import StructuredData from './StructuredData';
import NAPConsistency from './NAPConsistency';
import LocationContent from './LocationContent';
import GoogleBusinessIntegration from './GoogleBusinessIntegration';
import { businessInfo } from '../../utils/localSEOConfig';

interface LocalSEOWrapperProps {
  pageType?: 'home' | 'service' | 'about' | 'contact';
  serviceSpecific?: {
    name: string;
    description: string;
    price?: string;
    category: string;
  };
  showLocationContent?: boolean;
  showGoogleBusiness?: boolean;
  showNAP?: boolean;
  napVariant?: 'header' | 'footer' | 'contact' | 'inline';
  className?: string;
}

export const LocalSEOWrapper: React.FC<LocalSEOWrapperProps> = ({
  pageType = 'home',
  serviceSpecific,
  showLocationContent = false,
  showGoogleBusiness = false,
  showNAP = true,
  napVariant = 'footer',
  className = ''
}) => {
  return (
    <div className={className}>
      {/* Structured Data - Always included */}
      <StructuredData
        businessInfo={businessInfo}
        pageType={pageType}
        serviceSpecific={serviceSpecific}
      />

      {/* NAP Consistency */}
      {showNAP && (
        <NAPConsistency
          businessInfo={businessInfo}
          variant={napVariant}
          showHours={napVariant === 'contact'}
        />
      )}

      {/* Location-specific Content */}
      {showLocationContent && (
        <LocationContent
          primaryLocation={businessInfo.address.addressLocality}
          serviceAreas={businessInfo.serviceArea}
        />
      )}

      {/* Google Business Integration */}
      {showGoogleBusiness && (
        <GoogleBusinessIntegration
          businessName={businessInfo.name}
          googleBusinessUrl="https://business.google.com/dashboard"
          averageRating={4.8}
          totalReviews={127}
        />
      )}
    </div>
  );
};

export default LocalSEOWrapper;