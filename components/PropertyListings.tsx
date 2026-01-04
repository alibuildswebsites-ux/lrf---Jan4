
import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { PropertyCard } from './PropertyCard';
import { getProperties } from '../lib/firebase/firestore';
import { Property } from '../types';
import { SlidersHorizontal, ChevronDown, Grid, List, Search, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { updateSEO } from '../utils';
import { LoadingSpinner } from './common/LoadingSpinner';

// --- Types ---

interface FilterState {
  location: string;
  minPrice: number | '';
  maxPrice: number | '';
  beds: number | 'any';
  baths: number | 'any';
  types: string[]; // Changed to array for checkboxes
  status: 'All' | 'For Sale' | 'For Rent' | 'Sold' | 'Rented';
}

export const PropertyListings = () => {
  // --- State ---
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'sqft-desc'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const itemsPerPage = 6;
  
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL params lazy to avoid sync issues
  const [filters, setFilters] = useState<FilterState>(() => {
    const locParam = searchParams.get('location');
    const statusParam = searchParams.get('status');
    const minParam = searchParams.get('min');
    const maxParam = searchParams.get('max');

    return {
      location: locParam || '',
      minPrice: minParam ? Number(minParam) : '',
      maxPrice: maxParam ? Number(maxParam) : '',
      beds: 'any',
      baths: 'any',
      types: [],
      status: (statusParam as any) || 'All'
    };
  });

  // Extract unique locations and types for dropdowns
  const availableLocations = useMemo(() => {
    return Array.from(new Set(allProperties.map(p => p.city))).sort();
  }, [allProperties]);

  const availableTypes = ['House', 'Condo', 'Apartment', 'Townhouse', 'Land', 'Other'];

  // --- Effects ---
  
  useEffect(() => {
    updateSEO({
      title: "Homes for Sale in Houston, TX | Lofton Realty",
      description: "Browse exclusive real estate listings in Houston, Galveston, Austin, and the Gulf Coast. Find your dream home with Lofton Realty.",
      url: "https://loftonrealty.com/properties"
    });
    
    // Fetch Properties
    const fetchProps = async () => {
      setLoading(true);
      const data = await getProperties();
      setAllProperties(data as Property[]);
      setLoading(false);
    };
    fetchProps();
  }, []);

  // Sync state changes to URL
  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.location) params.location = filters.location;
    if (filters.status !== 'All') params.status = filters.status;
    if (filters.minPrice) params.min = filters.minPrice.toString();
    if (filters.maxPrice) params.max = filters.maxPrice.toString();
    
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // --- Filter Logic ---

  const filteredProperties = useMemo(() => {
    return allProperties.filter(property => {
      // Status
      if (filters.status !== 'All' && property.status !== filters.status) return false;

      // Location (City)
      if (filters.location && property.city !== filters.location) return false;
      
      // Type Match (Array check)
      if (filters.types.length > 0 && !filters.types.includes(property.type)) return false;
      
      // Price Range
      if (filters.minPrice !== '' && property.price < filters.minPrice) return false;
      if (filters.maxPrice !== '' && property.price > filters.maxPrice) return false;
      
      // Beds/Baths
      if (filters.beds !== 'any' && property.beds < filters.beds) return false;
      if (filters.baths !== 'any' && property.baths < filters.baths) return false;

      return true;
    });
  }, [filters, allProperties]);

  // --- Sort Logic ---

  const sortedProperties = useMemo(() => {
    const sorted = [...filteredProperties];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'sqft-desc':
        return sorted.sort((a, b) => b.sqft - a.sqft);
      case 'newest':
      default:
        // Sort by id or createdAt if available
        return sorted; // Firestore default is mostly time based if IDs are sequential or query is sorted
    }
  }, [filteredProperties, sortBy]);

  // --- Pagination Logic ---

  const totalPages = Math.ceil(sortedProperties.length / itemsPerPage);
  const currentProperties = sortedProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const toggleType = (type: string) => {
    setFilters(prev => {
      const exists = prev.types.includes(type);
      return {
        ...prev,
        types: exists ? prev.types.filter(t => t !== type) : [...prev.types, type]
      };
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      beds: 'any',
      baths: 'any',
      types: [],
      status: 'All'
    });
    setCurrentPage(1);
  };

  // --- Sidebar Component ---

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between lg:hidden mb-6">
        <h3 className="text-xl font-bold text-charcoal">Filters</h3>
        <button onClick={() => setIsMobileFilterOpen(false)}><X size={24} /></button>
      </div>

      {/* Status Tabs */}
      <div>
        <h4 className="font-bold text-charcoal mb-3">Status</h4>
        <div className="flex flex-wrap gap-2">
           {['All', 'For Sale', 'For Rent', 'Sold', 'Rented'].map((s) => (
             <button
               key={s}
               onClick={() => handleFilterChange('status', s)}
               className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                 filters.status === s ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
               }`}
             >
               {s}
             </button>
           ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-bold text-charcoal mb-3">Price Range</h4>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
             <input 
               type="number" 
               placeholder="Min" 
               value={filters.minPrice}
               onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : '')}
               className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand"
             />
          </div>
          <span className="text-gray-400">-</span>
          <div className="relative flex-1">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
             <input 
               type="number" 
               placeholder="Max" 
               value={filters.maxPrice}
               onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : '')}
               className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand"
             />
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <h4 className="font-bold text-charcoal mb-3">City</h4>
        <div className="relative">
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-gray-700 font-medium"
          >
            <option value="">Any City</option>
            {availableLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
        </div>
      </div>

      {/* Beds */}
      <div>
        <h4 className="font-bold text-charcoal mb-3">Bedrooms</h4>
        <div className="flex gap-2">
           {[ 'any', 1, 2, 3, 4, 5 ].map((num) => (
             <button
               key={num}
               onClick={() => handleFilterChange('beds', num)}
               className={`h-10 w-10 flex items-center justify-center rounded-lg border text-sm font-semibold transition-all ${
                 filters.beds === num 
                   ? 'bg-brand text-white border-brand' 
                   : 'bg-white border-gray-200 text-gray-600 hover:border-brand/50'
               }`}
             >
               {num === 'any' ? 'Any' : `${num}+`}
             </button>
           ))}
        </div>
      </div>

      {/* Baths */}
      <div>
        <h4 className="font-bold text-charcoal mb-3">Bathrooms</h4>
        <div className="flex gap-2">
           {[ 'any', 1, 2, 3, 4 ].map((num) => (
             <button
               key={num}
               onClick={() => handleFilterChange('baths', num)}
               className={`h-10 w-10 flex items-center justify-center rounded-lg border text-sm font-semibold transition-all ${
                 filters.baths === num 
                   ? 'bg-brand text-white border-brand' 
                   : 'bg-white border-gray-200 text-gray-600 hover:border-brand/50'
               }`}
             >
               {num === 'any' ? 'Any' : `${num}+`}
             </button>
           ))}
        </div>
      </div>

      {/* Property Type */}
      <div>
        <h4 className="font-bold text-charcoal mb-3">Property Type</h4>
        <div className="grid grid-cols-2 gap-2">
          {availableTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filters.types.includes(type)}
                onChange={() => toggleType(type)}
                className="w-4 h-4 accent-brand rounded"
              />
              <span className="text-sm text-gray-600">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <button 
        onClick={clearFilters} 
        className="w-full py-3 flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-charcoal bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <RefreshCw size={16} /> Reset Filters
      </button>
    </div>
  );

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">
      <Navbar /> 
      
      {/* Header Area */}
      <div className="bg-white border-b border-gray-200 pt-28 pb-8">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
               <h1 className="text-3xl md:text-4xl font-extrabold text-charcoal tracking-tight">Property Listings</h1>
             </div>
             
             <div className="flex items-center gap-3">
               <span className="text-gray-500 font-medium hidden md:block">
                 Found {sortedProperties.length} properties
               </span>
             </div>
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-[1400px] mx-auto px-5 md:px-10 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
             <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
               <FilterSidebar />
             </div>
          </aside>

          {/* Mobile Filter Sheet (Overlay) */}
          <AnimatePresence>
            {isMobileFilterOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                />
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="fixed inset-y-0 right-0 w-[300px] bg-white z-50 shadow-2xl p-6 overflow-y-auto lg:hidden"
                >
                  <FilterSidebar />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
               <button 
                 onClick={() => setIsMobileFilterOpen(true)}
                 className="lg:hidden flex items-center gap-2 text-charcoal font-bold bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 w-full sm:w-auto justify-center"
               >
                 <SlidersHorizontal size={18} /> Filters
               </button>

               <div className="flex items-center gap-4 w-full sm:w-auto">
                 <div className="flex items-center gap-2 pl-4">
                   <select 
                     value={sortBy} 
                     onChange={(e) => setSortBy(e.target.value as any)}
                     className="bg-transparent text-sm font-semibold text-charcoal outline-none cursor-pointer"
                   >
                     <option value="newest">Newest First</option>
                     <option value="price-asc">Price: Low to High</option>
                     <option value="price-desc">Price: High to Low</option>
                     <option value="sqft-desc">Square Footage</option>
                   </select>
                 </div>
               </div>

               <div className="hidden sm:flex bg-gray-100 rounded-lg p-1 gap-1">
                 <button 
                   onClick={() => setViewMode('grid')}
                   className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-brand' : 'text-gray-500 hover:text-charcoal'}`}
                 >
                   <Grid size={18} />
                 </button>
                 <button 
                   onClick={() => setViewMode('list')}
                   className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-brand' : 'text-gray-500 hover:text-charcoal'}`}
                 >
                   <List size={18} />
                 </button>
               </div>
            </div>

            {/* Content */}
            {loading ? (
              <LoadingSpinner />
            ) : currentProperties.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {currentProperties.map(property => (
                  <PropertyCard 
                    key={property.id} 
                    property={{
                      ...property, 
                      // Convert number price to formatted string for Card compatibility if needed
                      price: typeof property.price === 'number' ? `$${property.price.toLocaleString()}` : property.price,
                      sqft: typeof property.sqft === 'number' ? property.sqft.toLocaleString() : property.sqft
                    } as any} // Type assertion for compatibility during migration
                    viewMode={viewMode} 
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200 text-center">
                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                   <Search className="text-gray-400" size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-charcoal mb-2">No properties match your criteria</h3>
                 <p className="text-gray-500 max-w-sm mb-6">Try removing some filters or expanding your price range.</p>
                 <button 
                   onClick={clearFilters}
                   className="text-brand font-bold hover:underline"
                 >
                   Clear all filters
                 </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all ${
                      currentPage === idx + 1 
                        ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-brand hover:text-brand'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
