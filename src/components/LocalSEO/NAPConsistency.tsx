import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

interface BusinessContact {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone: string;
  email: string;
  businessHours: {
    [key: string]: string;
  };
}

interface NAPConsistencyProps {
  businessInfo: BusinessContact;
  variant?: 'header' | 'footer' | 'contact' | 'inline';
  showHours?: boolean;
  className?: string;
}

export const NAPConsistency: React.FC<NAPConsistencyProps> = ({
  businessInfo,
  variant = 'footer',
  showHours = false,
  className = ''
}) => {
  const formatAddress = () => {
    const { street, city, state, zipCode } = businessInfo.address;
    return `${street}, ${city}, ${state} ${zipCode}`;
  };

  const formatPhone = () => {
    // Ensure consistent phone formatting: +55 (11) 99999-9999
    const cleaned = businessInfo.phone.replace(/\D/g, '');
    if (cleaned.startsWith('55')) {
      const number = cleaned.substring(2);
      return `+55 (${number.substring(0, 2)}) ${number.substring(2, 7)}-${number.substring(7)}`;
    }
    return businessInfo.phone;
  };

  const renderHeaderVariant = () => (
    <div className={`flex items-center space-x-6 text-sm ${className}`}>
      <div className="flex items-center space-x-2">
        <Phone className="w-4 h-4" />
        <a 
          href={`tel:${businessInfo.phone}`}
          className="hover:text-blue-400 transition-colors"
          itemProp="telephone"
        >
          {formatPhone()}
        </a>
      </div>
      <div className="flex items-center space-x-2">
        <Mail className="w-4 h-4" />
        <a 
          href={`mailto:${businessInfo.email}`}
          className="hover:text-blue-400 transition-colors"
          itemProp="email"
        >
          {businessInfo.email}
        </a>
      </div>
    </div>
  );

  const renderFooterVariant = () => (
    <div className={`space-y-4 ${className}`} itemScope itemType="https://schema.org/ProfessionalService">
      <h3 className="text-lg font-semibold text-white" itemProp="name">
        {businessInfo.name}
      </h3>
      
      <div className="space-y-2 text-gray-300">
        <div className="flex items-start space-x-2" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
          <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
          <span>
            <span itemProp="streetAddress">{businessInfo.address.street}</span><br />
            <span itemProp="addressLocality">{businessInfo.address.city}</span>, 
            <span itemProp="addressRegion"> {businessInfo.address.state}</span> 
            <span itemProp="postalCode"> {businessInfo.address.zipCode}</span><br />
            <span itemProp="addressCountry">{businessInfo.address.country}</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4" />
          <a 
            href={`tel:${businessInfo.phone}`}
            className="hover:text-blue-400 transition-colors"
            itemProp="telephone"
          >
            {formatPhone()}
          </a>
        </div>
        
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4" />
          <a 
            href={`mailto:${businessInfo.email}`}
            className="hover:text-blue-400 transition-colors"
            itemProp="email"
          >
            {businessInfo.email}
          </a>
        </div>
        
        {showHours && (
          <div className="flex items-start space-x-2">
            <Clock className="w-4 h-4 mt-1" />
            <div itemProp="openingHours">
              {Object.entries(businessInfo.businessHours).map(([day, hours]) => (
                <div key={day} className="text-sm">
                  {day}: {hours}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderContactVariant = () => (
    <div className={`bg-gray-900 rounded-xl p-6 ${className}`} itemScope itemType="https://schema.org/ContactPoint">
      <h3 className="text-xl font-bold text-white mb-4">Informações de Contato</h3>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-gray-400 text-sm">Telefone</div>
            <a 
              href={`tel:${businessInfo.phone}`}
              className="text-white font-medium hover:text-blue-400 transition-colors"
              itemProp="telephone"
            >
              {formatPhone()}
            </a>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="bg-green-600 p-2 rounded-lg">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-gray-400 text-sm">Email</div>
            <a 
              href={`mailto:${businessInfo.email}`}
              className="text-white font-medium hover:text-blue-400 transition-colors"
              itemProp="email"
            >
              {businessInfo.email}
            </a>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="bg-purple-600 p-2 rounded-lg">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-gray-400 text-sm">Endereço</div>
            <div className="text-white" itemProp="address">
              {formatAddress()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInlineVariant = () => (
    <span className={className} itemScope itemType="https://schema.org/ProfessionalService">
      <span itemProp="name">{businessInfo.name}</span> - 
      <span itemProp="telephone"> {formatPhone()}</span> - 
      <span itemProp="address"> {formatAddress()}</span>
    </span>
  );

  switch (variant) {
    case 'header':
      return renderHeaderVariant();
    case 'footer':
      return renderFooterVariant();
    case 'contact':
      return renderContactVariant();
    case 'inline':
      return renderInlineVariant();
    default:
      return renderFooterVariant();
  }
};

export default NAPConsistency;