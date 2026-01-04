import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, Loader2, Home } from 'lucide-react';
import { getSavedProperties } from '../../lib/firebase/firestore';
import { PropertyCard } from '../PropertyCard';
import { useAuth } from '../../hooks/useAuth';
import { Property } from '../../types';
import { motion } from 'framer-motion';

export const SavedProperties = () => {
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSaved = async () => {
      if (user) {
        setLoading(true);
        try {
          // Use the dedicated Firestore helper to fetch real property details
          const properties = await getSavedProperties(user.uid);
          setSavedProperties(properties);
        } catch (error) {
          console.error("Error loading saved properties:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadSaved();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-10 h-10 text-brand animate-spin mb-4" />
        <p className="text-gray-400 font-medium animate-pulse uppercase tracking-widest text-xs">Loading Favorites...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <h1 className="text-3xl font-extrabold text-charcoal tracking-tight mb-2">Saved Properties</h1>
           <p className="text-gray-500">Keep track of the homes you love.</p>
        </div>
        <div className="hidden md:block">
           <span className="bg-brand-light text-brand-dark px-4 py-2 rounded-full text-sm font-bold">
             {savedProperties.length} Saved
           </span>
        </div>
      </div>

      {savedProperties.length === 0 ? (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-12 md:p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center"
        >
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 relative">
            <Heart className="text-gray-300" size={40} />
            <div className="absolute top-0 right-0 w-8 h-8 bg-brand rounded-full flex items-center justify-center border-4 border-white">
                <Home size={14} className="text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">No Saved Properties Yet</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg leading-relaxed">
            Your dream home is out there! Browse our listings and click the heart icon to save your favorites here.
          </p>
          <Link
            to="/property-listings"
            className="inline-flex items-center gap-2 bg-charcoal text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <Search size={20} />
            Start Browsing
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {savedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SavedProperties;