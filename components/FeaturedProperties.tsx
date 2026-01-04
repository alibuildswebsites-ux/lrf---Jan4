
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getProperties } from '../lib/firebase/firestore';
import { Property } from '../types';
import { PropertyCard } from './PropertyCard';
import { LoadingSpinner } from './common/LoadingSpinner';

export const FeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        // Fetch all properties
        const allProperties = await getProperties();
        
        // Filter and sort manually for featured (Newest 'For Sale' or 'For Rent')
        const featured = allProperties
          .filter(p => p.status === 'For Sale' || p.status === 'For Rent' || p.status === 'New Listing')
          // Assuming getProperties already sorts by createdAt desc, but ensuring here
          .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          .slice(0, 4);
          
        setProperties(featured as Property[]);
      } catch (error) {
        console.error("Failed to fetch featured properties", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-[60px] md:py-[80px] lg:py-[100px] bg-gray-50" id="properties">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-[40px]">
        <div className="flex justify-between items-end mb-[40px] md:mb-[60px]">
          <div>
            <span className="text-[13px] font-bold tracking-[2px] text-brand uppercase mb-3 block">Exclusive Listings</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-charcoal tracking-tight">Featured Properties</h2>
          </div>
          <Link 
            to="/property-listings"
            className="hidden md:flex items-center gap-2 text-charcoal font-bold hover:text-brand transition-colors rounded-lg px-2 py-1 -ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            View All Listings <ArrowRight size={20} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[30px]">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 text-lg">New listings coming soon. Check back shortly!</p>
          </div>
        )}
        
        <div className="mt-10 text-center md:hidden">
            <Link 
              to="/property-listings"
              className="inline-flex items-center gap-2 text-charcoal font-bold hover:text-brand transition-colors rounded-lg px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              View All Listings <ArrowRight size={20} />
            </Link>
        </div>
      </div>
    </section>
  );
};
