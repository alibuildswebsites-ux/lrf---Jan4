
import React, { useState, useEffect } from 'react';
import { LOCATIONS } from '../data';
import { LocationArea } from '../types';
import { MapPin, TrendingUp, ArrowRight, X, Building } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedImageUrl } from '../utils';
import { SectionHeader } from './common/SectionHeader';

export const LocationsSection = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationArea | null>(null);
  const navigate = useNavigate();

  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedLocation(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleNavigateToProperties = (locationName: string) => {
    // Navigate to properties page with location filter
    navigate(`/property-listings?location=${encodeURIComponent(locationName)}`);
    setSelectedLocation(null);
  };

  return (
    <section className="py-[60px] md:py-[80px] lg:py-[100px] bg-gray-50 relative" id="areas">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-[40px] relative z-10">
        <SectionHeader 
          subtitle="Our Coverage"
          title="Areas We Serve"
          description="Local expertise with a broad reach. Click a location below to explore market insights and available homes."
        />
        
        {/* Locations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {LOCATIONS.map((location) => (
             <button 
               key={location.id} 
               onClick={() => setSelectedLocation(location)}
               className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
               aria-label={`View details for ${location.name}`}
             >
                <div className="flex justify-between items-start mb-4">
                   <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-charcoal group-hover:bg-brand group-hover:text-white transition-colors">
                      <MapPin size={20} />
                   </div>
                   {location.stats.trend === 'up' && (
                     <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                       <TrendingUp size={12} /> Growing
                     </div>
                   )}
                </div>
                
                <h3 className="text-xl font-bold text-charcoal mb-2 group-hover:text-brand transition-colors">{location.name}</h3>
                <p className="text-gray-500 mb-6 text-sm">{location.description}</p>
                
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div>
                    <span className="block text-xs text-gray-400 font-bold uppercase">{location.stats.label}</span>
                    <span className="block text-lg font-bold text-charcoal">{location.stats.value}</span>
                  </div>
                  <div className="text-brand opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                     <ArrowRight size={20} />
                  </div>
                </div>
             </button>
           ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/contact-us" className="text-charcoal font-bold border-b-2 border-brand/20 hover:border-brand pb-0.5 transition-colors">
            Contact us for market specifics
          </Link>
        </div>
      </div>

      {/* Location Detail Modal */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedLocation(null)}
              aria-hidden="true"
            />
            
            {/* Modal Content */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-48 md:h-64 flex-shrink-0 bg-gray-100">
                <img 
                  src={getOptimizedImageUrl(selectedLocation.image, 800)} 
                  alt={`${selectedLocation.name} real estate landscape`} 
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <button 
                  onClick={() => setSelectedLocation(null)}
                  className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-all focus:outline-none focus:ring-2 focus:ring-white z-10"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
                <div className="absolute bottom-6 left-6 md:left-8 text-white">
                  <h3 id="modal-title" className="text-2xl md:text-4xl font-extrabold tracking-tight mb-2">
                    {selectedLocation.name}
                  </h3>
                  <div className="flex items-center gap-2 text-white/90 font-medium text-sm md:text-base">
                     <Building size={16} />
                     <span>{selectedLocation.propertyCount} properties available</span>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto flex-1 overscroll-contain">
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {selectedLocation.longDescription}
                </p>

                <div className="bg-gray-50 rounded-xl p-4 mb-8 flex items-center justify-between border border-gray-100">
                   <div>
                     <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Market Trend</span>
                     <div className="font-bold text-charcoal flex items-center gap-2">
                       {selectedLocation.stats.value} <span className="text-sm font-normal text-gray-500">({selectedLocation.stats.label})</span>
                     </div>
                   </div>
                   {selectedLocation.stats.trend === 'up' && (
                     <TrendingUp className="text-green-500" size={24} />
                   )}
                </div>

                <button
                  onClick={() => handleNavigateToProperties(selectedLocation.name)}
                  className="w-full bg-brand text-white font-bold text-lg py-4 rounded-xl hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  View Properties in {selectedLocation.name} <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
