import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail } from 'lucide-react';
import { getOptimizedImageUrl } from '../utils';

export const Hero = () => {
  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100&q=80'
  ];

  return (
    <section 
      className="relative pt-[110px] pb-[60px] md:pt-[140px] md:pb-[80px] lg:pt-[160px] lg:pb-[100px] flex items-center overflow-hidden bg-white min-h-[80vh]" 
      id="home"
    >
      {/* 
        CONTAINER 
      */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-[40px] w-full h-full relative z-10 flex flex-col items-center justify-center text-center">
        
        {/* 
           CONTENT WRAPPER
        */}
        <div className="z-10 flex flex-col items-center justify-center max-w-4xl mx-auto">
          {/* Social Proof Badge */}
          <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 w-fit mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 hover:shadow-md transition-shadow cursor-default">
            <div className="flex -space-x-3">
              {avatars.map((src, i) => (
                <img 
                  key={i} 
                  src={src} 
                  alt={`Client ${i + 1}`}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-700">Trusted by 500+ families</span>
          </div>

          {/* Main Headline: Scaled Typography */}
          <h1 
            className="font-extrabold text-charcoal leading-[1.1] mb-0 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            Your Dream Home <br /> Awaits
          </h1>
          
          {/* Subheadline */}
          <p className="text-[20px] lg:text-[24px] text-gray-500 font-medium mt-[16px] leading-snug animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Houston's trusted real estate partner
          </p>
          
          {/* Description */}
          <p className="text-[16px] lg:text-[18px] text-gray-400 max-w-[600px] mt-[24px] leading-relaxed font-normal animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
            Serving Houston, Galveston, Austin, Louisiana, Mississippi, and Florida with expert guidance, 24/7 availability, and personalized service.
          </p>

          {/* Buttons */}
          <div className="mt-[32px] flex flex-col sm:flex-row gap-[16px] w-full sm:w-auto justify-center animate-in fade-in slide-in-from-bottom-6 duration-700 delay-400">
            {/* Button 1 */}
            <Link 
              to="/properties"
              className="flex items-center justify-center gap-2 bg-charcoal-dark text-white px-[32px] py-[14px] rounded-[8px] font-semibold text-[16px] hover:bg-black hover:scale-[1.02] transition-all duration-300 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <Home size={20} />
              View Listings
            </Link>
            
            {/* Button 2 */}
            <Link 
              to="/contact"
              className="flex items-center justify-center gap-2 bg-white text-charcoal-dark border-2 border-gray-200 px-[32px] py-[14px] rounded-[8px] font-semibold text-[16px] hover:border-brand hover:text-brand transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <Mail size={20} />
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};