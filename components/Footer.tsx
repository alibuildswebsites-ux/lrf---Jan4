import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { COMPANY_INFO } from '../lib/constants';

export const Footer = () => {
  const { user } = useAuth();

  const socialLinks = [
    { icon: Facebook, url: COMPANY_INFO.SOCIAL.FACEBOOK },
    { icon: Instagram, url: COMPANY_INFO.SOCIAL.INSTAGRAM },
    { icon: Linkedin, url: COMPANY_INFO.SOCIAL.LINKEDIN }
  ];

  return (
    <footer className="bg-charcoal-dark text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 lg:px-[40px] flex flex-col items-center text-center">
        
        {/* Brand Section */}
        <div className="mb-12 flex flex-col items-center">
            <Link to="/" className="inline-block font-extrabold text-2xl text-white tracking-tight rounded-md focus:outline-none focus:ring-2 focus:ring-brand mb-6">
              {COMPANY_INFO.NAME}
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mb-8">
              Think Lofton Often. <br/>
              Your trusted partner for buying, selling, and investing in real estate across the Gulf Coast region since {COMPANY_INFO.FOUNDED_YEAR}.
            </p>
            
            <div className="flex gap-4">
               {socialLinks.map(({ icon: Icon, url }, i) => (
                 <a 
                   key={i} 
                   href={url} 
                   target="_blank"
                   rel="noopener noreferrer"
                   className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-brand"
                 >
                   <Icon size={18} />
                 </a>
               ))}
             </div>
        </div>

        {/* Account & Contact Section */}
        <div className="mb-12 flex flex-col items-center w-full max-w-md">
            <h4 className="text-lg font-bold mb-6 text-white">Account & Contact</h4>
            
            {/* Account Links */}
            <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10 w-full flex flex-col items-center">
              {user ? (
                <>
                  <p className="text-sm font-bold text-white mb-2">Welcome, {user.displayName || 'User'}</p>
                  <Link to="/dashboard" className="flex items-center justify-center gap-2 text-brand hover:text-white transition-colors text-sm font-bold">
                    Go to Dashboard <ArrowRight size={14} />
                  </Link>
                </>
              ) : (
                <div className="flex gap-4">
                  <Link to="/login" className="text-sm font-bold text-white hover:text-brand transition-colors">Log In</Link>
                  <span className="text-gray-600">|</span>
                  <Link to="/signup" className="text-sm font-bold text-white hover:text-brand transition-colors">Sign Up</Link>
                </div>
              )}
            </div>

            {/* Contact Details */}
            <div className="space-y-3 flex flex-col items-center">
              <a href={`tel:${COMPANY_INFO.PHONE_RAW}`} className="flex items-center gap-3 text-gray-400 hover:text-brand transition-colors">
                <Phone size={16} className="text-brand" />
                <span className="text-sm">{COMPANY_INFO.PHONE}</span>
              </a>
              <a href={`mailto:${COMPANY_INFO.EMAIL}`} className="flex items-center gap-3 text-gray-400 hover:text-brand transition-colors">
                <Mail size={16} className="text-brand" />
                <span className="text-sm">{COMPANY_INFO.EMAIL}</span>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin size={16} className="text-brand flex-shrink-0" />
                <span className="text-sm">{COMPANY_INFO.ADDRESS}</span>
              </div>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 w-full flex flex-col items-center gap-4 text-gray-500 text-xs">
           <p>© {new Date().getFullYear()} {COMPANY_INFO.NAME}. All rights reserved.</p>
           <div className="flex gap-6">
             <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
             <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
           </div>
        </div>

      </div>
    </footer>
  );
};