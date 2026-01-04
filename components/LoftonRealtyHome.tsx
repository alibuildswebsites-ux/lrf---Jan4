import React, { useEffect } from 'react';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { SectionErrorBoundary } from './SectionErrorBoundary';
import { updateSEO, injectJSONLD } from '../utils';

// Static imports to remove lazy loading
import { StatsBar } from './StatsBar';
import { ServicesSection } from './ServicesSection';
import { FeaturedProperties } from './FeaturedProperties';
import { TrustSection } from './TrustSection';
import { LocationsSection } from './LocationsSection';
import { TestimonialsSection } from './TestimonialsSection';
import { ContactFormSection } from './ContactFormSection';
import { Footer } from './Footer';

const LoftonRealtyHome = () => {
  useEffect(() => {
    updateSEO({
      title: "Lofton Realty | Houston Real Estate Broker & Investment Experts",
      description: "Trusted Houston real estate broker since 2006. Buy, sell, or invest in homes across Houston, Galveston, Austin, and the Gulf Coast. 24/7 service.",
      url: "https://loftonrealty.com/",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
    });

    injectJSONLD({
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": "Lofton Realty",
      "image": "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
      "description": "Houston's trusted real estate partner for buying, selling, and investing.",
      "url": "https://loftonrealty.com/",
      "telephone": "713-203-7661",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Houston",
        "addressRegion": "TX",
        "addressCountry": "US"
      },
      "priceRange": "$$$",
      "areaServed": ["Houston", "Galveston", "Austin", "Louisiana", "Mississippi", "Florida"]
    });
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-white selection:bg-brand selection:text-white">
      <Navbar />
      <main>
        <Hero />
        
        <SectionErrorBoundary>
          <StatsBar />
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <ServicesSection />
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <FeaturedProperties />
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <TrustSection />
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <LocationsSection />
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <TestimonialsSection />
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <ContactFormSection />
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <Footer />
        </SectionErrorBoundary>
      </main>
    </div>
  );
};

export default LoftonRealtyHome;