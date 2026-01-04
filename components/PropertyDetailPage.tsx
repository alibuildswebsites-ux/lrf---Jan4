
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { getPropertyById, incrementPropertyView, getProperties } from '../lib/firebase/firestore';
import { Property } from '../types';
import { PropertyCard } from './PropertyCard';
import { 
  MapPin, Bed, Bath, Maximize, Calendar, Phone, Mail, 
  ChevronLeft, ChevronRight, CheckCircle2, Building, ImageOff
} from 'lucide-react';
import { getOptimizedImageUrl, updateSEO, injectJSONLD } from '../utils';
import { LoadingSpinner } from './common/LoadingSpinner';

export const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [mainImageLoaded, setMainImageLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (id) {
        // Fetch property
        const data = await getPropertyById(id);
        if (data) {
          setProperty(data);
          incrementPropertyView(id); // Increment view count

          // Fetch similar
          const allProps = await getProperties();
          const similar = allProps
            .filter(p => p.location === data.location && p.id !== data.id)
            .slice(0, 3);
          
          if (similar.length < 3) {
            const others = allProps.filter(p => p.id !== data.id && !similar.find(s => s.id === p.id)).slice(0, 3 - similar.length);
            similar.push(...others);
          }
          setSimilarProperties(similar);

          // SEO
          updateSEO({
            title: `${data.address} | Homes for Sale in ${data.city}, ${data.state}`,
            description: `View details for ${data.address}. ${data.beds} Bed, ${data.baths} Bath, $${data.price.toLocaleString()}. ${data.description?.substring(0, 120)}...`,
            image: data.images[0],
            url: `https://loftonrealty.com/properties/${data.id}`,
            type: 'article'
          });

          // JSON-LD
          injectJSONLD({
            "@context": "https://schema.org",
            "@type": "SingleFamilyResidence",
            "name": data.address,
            "description": data.description,
            "numberOfRooms": data.beds + data.baths, 
            "occupancy": { "@type": "QuantitativeValue", "value": data.beds },
            "floorSize": { "@type": "QuantitativeValue", "value": data.sqft.toString(), "unitCode": "FTK" },
            "address": {
              "@type": "PostalAddress",
              "streetAddress": data.address,
              "addressLocality": data.city,
              "addressRegion": data.state,
              "postalCode": data.zip,
              "addressCountry": "US"
            },
            "image": data.images,
            "offers": {
              "@type": "Offer",
              "price": data.price.toString(),
              "priceCurrency": "USD",
              "availability": data.status === 'Pending' ? "https://schema.org/Sold" : "https://schema.org/InStock"
            }
          });
        }
      }
      setLoading(false);
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
      setActiveImage(0);
      setImageError(false);
      setMainImageLoaded(false);
  }, [id]);

  useEffect(() => {
    setMainImageLoaded(false);
  }, [activeImage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Navbar />
        <div className="text-center p-8">
          <h2 className="text-3xl font-bold text-charcoal mb-4">Property Not Found</h2>
          <p className="text-gray-500 mb-8">The listing you are looking for may have been removed or does not exist.</p>
          <Link to="/property-listings" className="bg-brand text-white px-6 py-3 rounded-full font-bold hover:bg-brand-dark transition-colors">
            Return to Properties
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleNextImage = () => {
    setActiveImage((prev) => (prev + 1) % property.images.length);
    setImageError(false);
  };

  const handlePrevImage = () => {
    setActiveImage((prev) => (prev - 1 + property.images.length) % property.images.length);
    setImageError(false);
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <Navbar />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200 pt-24 pb-4">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 flex items-center gap-2 text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-brand transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <Link to="/property-listings" className="hover:text-brand transition-colors">Properties</Link>
          <span className="text-gray-300">/</span>
          <span className="hover:text-brand transition-colors cursor-pointer">{property.city}</span>
          <span className="text-gray-300">/</span>
          <span className="font-semibold text-charcoal truncate">{property.address}</span>
        </div>
      </div>

      <main className="max-w-[1280px] mx-auto px-5 md:px-10 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-charcoal mb-2 tracking-tight">
              {property.address}
            </h1>
            <div className="flex items-center gap-2 text-lg text-gray-500 font-medium">
              <MapPin size={20} className="text-brand" />
              {property.city}, {property.state} {property.zip}
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end">
             <div className="text-3xl md:text-4xl font-extrabold text-brand mb-2">${property.price.toLocaleString()}</div>
             <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide text-white ${
                property.status === 'New Listing' ? 'bg-blue-600' :
                property.status === 'Pending' ? 'bg-orange-500' :
                property.status === 'Price Drop' ? 'bg-red-500' : 'bg-brand'
             }`}>
               {property.status || 'For Sale'}
             </span>
          </div>
        </div>

        {/* Hero Image Gallery */}
        <div className="grid lg:grid-cols-[2fr_1fr] gap-4 mb-12 h-[400px] md:h-[500px] lg:h-[600px]">
          {/* Main Image */}
          <div className="relative rounded-2xl overflow-hidden bg-gray-100 h-full group">
             
             {!mainImageLoaded && !imageError && (
               <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />
             )}

             {!imageError ? (
               <img 
                 src={getOptimizedImageUrl(property.images[activeImage], 1200)} 
                 alt={`Property at ${property.address} - Main View`}
                 className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${mainImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                 onError={() => setImageError(true)}
                 onLoad={() => setMainImageLoaded(true)}
                 loading="eager"
               />
             ) : (
               <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                  <ImageOff size={64} className="mb-4" />
                  <p className="font-medium">Image not available</p>
               </div>
             )}
             
             {/* Controls */}
             {property.images.length > 1 && !imageError && (
               <>
                 <button 
                   onClick={handlePrevImage}
                   className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-20"
                   aria-label="Previous image"
                 >
                   <ChevronLeft size={24} />
                 </button>
                 <button 
                   onClick={handleNextImage}
                   className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-20"
                   aria-label="Next image"
                 >
                   <ChevronRight size={24} />
                 </button>
                 
                 <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm z-20">
                   {activeImage + 1} / {property.images.length}
                 </div>
               </>
             )}
          </div>

          {/* Thumbnails Grid (Desktop) */}
          <div className="hidden lg:grid grid-rows-3 gap-4 h-full">
            {property.images.slice(0, 3).map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => { setActiveImage(idx); setImageError(false); }}
                className={`relative rounded-xl overflow-hidden w-full h-full cursor-pointer transition-all bg-gray-100 ${activeImage === idx ? 'ring-4 ring-brand' : 'opacity-80 hover:opacity-100'}`}
              >
                <img 
                  src={getOptimizedImageUrl(img, 400)} 
                  alt={`Property at ${property.address} - View ${idx + 1}`} 
                  className="w-full h-full object-cover" 
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display='none'; }}
                />
                {idx === 2 && property.images.length > 3 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-xl">
                    +{property.images.length - 3}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid lg:grid-cols-[2fr_1fr] gap-12">
          
          {/* Details */}
          <div>
            {/* Quick Facts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
               <div className="flex flex-col gap-1">
                 <span className="flex items-center gap-2 text-gray-400 text-sm font-bold uppercase tracking-wide"><Bed size={16} /> Bedrooms</span>
                 <span className="text-2xl font-bold text-charcoal">{property.beds}</span>
               </div>
               <div className="flex flex-col gap-1">
                 <span className="flex items-center gap-2 text-gray-400 text-sm font-bold uppercase tracking-wide"><Bath size={16} /> Bathrooms</span>
                 <span className="text-2xl font-bold text-charcoal">{property.baths}</span>
               </div>
               <div className="flex flex-col gap-1">
                 <span className="flex items-center gap-2 text-gray-400 text-sm font-bold uppercase tracking-wide"><Maximize size={16} /> Sq Ft</span>
                 <span className="text-2xl font-bold text-charcoal">{property.sqft.toLocaleString()}</span>
               </div>
               <div className="flex flex-col gap-1">
                 <span className="flex items-center gap-2 text-gray-400 text-sm font-bold uppercase tracking-wide"><Calendar size={16} /> Year Built</span>
                 <span className="text-2xl font-bold text-charcoal">{property.yearBuilt || 'N/A'}</span>
               </div>
            </div>

            {/* Description */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-charcoal mb-6">About This Home</h2>
              <div className="prose prose-lg text-gray-600 leading-relaxed whitespace-pre-line max-w-none">
                {property.description}
              </div>
            </div>

            {/* Features */}
            <div className="mb-12">
               <h2 className="text-2xl font-bold text-charcoal mb-6">Key Features & Amenities</h2>
               <div className="grid md:grid-cols-2 gap-4">
                 {property.features?.map((feature, idx) => (
                   <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                     <CheckCircle2 size={20} className="text-brand flex-shrink-0" />
                     <span className="text-gray-700 font-medium">{feature}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Agent Contact */}
          <div className="relative">
             <div className="sticky top-28 space-y-8">
                
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                   <div className="flex items-center gap-4 mb-6">
                     <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden border-2 border-brand">
                        <img 
                          src={getOptimizedImageUrl('https://images.unsplash.com/photo-1560250097-0b93528c311a', 200)} 
                          alt="Agent" 
                          className="w-full h-full object-cover"
                        />
                     </div>
                     <div>
                       <h3 className="font-bold text-lg text-charcoal">Jared Lofton, MBA</h3>
                       <p className="text-xs font-bold text-brand uppercase tracking-wide">Listing Agent</p>
                       <p className="text-xs text-gray-400">Lofton Realty</p>
                     </div>
                   </div>
                   
                   <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                     Interested in this property? I'm available 24/7 to answer your questions or schedule a private showing.
                   </p>

                   <div className="space-y-3">
                     <a href="tel:7132037661" className="flex items-center justify-center gap-2 w-full bg-brand text-white py-3 rounded-lg font-bold hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20">
                       <Phone size={18} /> Call Agent
                     </a>
                     <Link to="/contact-us" className="flex items-center justify-center gap-2 w-full bg-white border-2 border-charcoal text-charcoal py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors">
                       <Mail size={18} /> Message Agent
                     </Link>
                   </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-start gap-3">
                   <Building size={20} className="text-gray-400 mt-1" />
                   <div>
                     <h4 className="font-bold text-sm text-charcoal">Brokerage Verified</h4>
                     <p className="text-xs text-gray-500 mt-1">Lofton Realty verifies all listing data. Information deemed reliable but not guaranteed.</p>
                   </div>
                </div>

             </div>
          </div>

        </div>
      </main>

      {/* Similar Properties */}
      <section className="bg-white py-20 border-t border-gray-100">
         <div className="max-w-[1280px] mx-auto px-5 md:px-10">
            <h2 className="text-3xl font-extrabold text-charcoal mb-8">Similar Properties You Might Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {similarProperties.map(prop => (
                 <PropertyCard key={prop.id} property={prop} />
               ))}
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
};
