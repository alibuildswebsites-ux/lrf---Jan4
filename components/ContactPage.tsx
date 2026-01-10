import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, Mail, MapPin, Clock, 
  Linkedin, MessageSquare,
  Building, ArrowRight, CheckCircle2
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { STATS } from '../data';
import { getOptimizedImageUrl, updateSEO } from '../utils';
import { SharedContactForm } from './SharedContactForm';
import { COMPANY_INFO } from '../lib/constants';

export const ContactPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    updateSEO({
      title: "Contact Us | Lofton Realty",
      description: "Get in touch with Lofton Realty. Call, email, or visit us for your Houston real estate needs. Available 24/7.",
      url: "https://loftonrealty.com/contact-us"
    });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-charcoal-dark overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center" 
          style={{ backgroundImage: `url(${getOptimizedImageUrl('https://images.unsplash.com/photo-1497366216548-37526070297c', 1200)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-dark/90 to-charcoal-dark/60" />
        
        <div className="relative max-w-7xl mx-auto px-5 md:px-10 text-center z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-brand/20 border border-brand/40 text-brand font-bold text-sm tracking-widest uppercase mb-6">
              Contact Us
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Let's Start the Conversation
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
              Available 24/7 for your real estate needs. Whether you're buying, selling, or just have questions, we're here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods Grid */}
      <section className="relative z-20 -mt-16 px-5 md:px-10 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { 
              icon: Phone, title: 'Call Us', detail: COMPANY_INFO.PHONE, sub: '24/7 Availability', 
              action: 'Call Now', href: `tel:${COMPANY_INFO.PHONE_RAW}` 
            },
            { 
              icon: Mail, title: 'Email Us', detail: COMPANY_INFO.EMAIL, sub: 'Response within 1 hour', 
              action: 'Send Email', href: `mailto:${COMPANY_INFO.EMAIL}` 
            },
            { 
              icon: MapPin, title: 'Visit Our Office', detail: 'Houston, Texas Area', sub: 'By appointment', 
              action: 'Get Directions', href: 'https://maps.google.com' 
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center group hover:border-brand/30 transition-all"
            >
              <div className="w-14 h-14 bg-brand-light rounded-full flex items-center justify-center text-brand mb-4 group-hover:scale-110 transition-transform">
                <item.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-charcoal mb-1">{item.title}</h3>
              <p className="text-lg font-medium text-gray-900 mb-1">{item.detail}</p>
              <p className="text-sm text-gray-500 mb-6">{item.sub}</p>
              <a 
                href={item.href}
                target={item.action === 'Get Directions' ? "_blank" : undefined}
                rel={item.action === 'Get Directions' ? "noopener noreferrer" : undefined}
                className="mt-auto text-brand font-bold border-b-2 border-brand/20 hover:border-brand pb-0.5 transition-colors"
              >
                {item.action}
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-24 max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid lg:grid-cols-[2fr_1fr] gap-16">
          
          {/* Left Column: Form */}
          <div>
            <div className="mb-10">
              <h2 className="text-3xl font-extrabold text-charcoal mb-4">Send us a Message</h2>
              <p className="text-gray-500">Fill out the form below and a member of our team will get back to you shortly.</p>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
               <SharedContactForm variant="light" />
            </div>
          </div>

          {/* Right Column: Info & Team */}
          <div className="space-y-12">
            
            {/* Team Section */}
            <div>
              <h3 className="text-xl font-bold text-charcoal mb-6 flex items-center gap-2">
                <Building size={20} className="text-brand" /> Meet the Team
              </h3>
              
              {/* Jared Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80" alt="Jared Lofton" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-charcoal text-lg">Jared Lofton, MBA</h4>
                    <p className="text-brand text-sm font-bold uppercase tracking-wide">Founder & Broker</p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                  Real Estate Broker with 19+ years experience. MBA in Finance. Former Financial Planner. Philosophy: Clients come first.
                </p>
                <div className="flex gap-3">
                  <a href={COMPANY_INFO.SOCIAL.LINKEDIN} className="p-2 text-gray-400 hover:text-blue-600 transition-colors bg-gray-50 rounded-lg"><Linkedin size={18} /></a>
                  <a href={`mailto:${COMPANY_INFO.EMAIL}`} className="p-2 text-gray-400 hover:text-brand transition-colors bg-gray-50 rounded-lg"><Mail size={18} /></a>
                </div>
              </div>

              {/* Placeholder Card */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 border-dashed text-center">
                 <p className="text-gray-400 text-sm font-medium">Looking to join our team?</p>
                 <a href="#" className="text-brand font-bold text-sm hover:underline">View Careers</a>
              </div>
            </div>

            {/* Office Hours */}
            <div>
              <h3 className="text-xl font-bold text-charcoal mb-6 flex items-center gap-2">
                <Clock size={20} className="text-brand" /> Office Hours
              </h3>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                 <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-600">Mon - Fri</span>
                    <span className="font-bold text-charcoal">8:00 AM - 8:00 PM</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-600">Saturday</span>
                    <span className="font-bold text-charcoal">9:00 AM - 6:00 PM</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-600">Sunday</span>
                    <span className="font-bold text-charcoal">12:00 PM - 5:00 PM</span>
                 </div>
                 <div className="pt-3 mt-3 border-t border-gray-100 flex items-center gap-2 text-brand font-bold text-sm">
                    <CheckCircle2 size={16} /> 24/7 Emergency Support Available
                 </div>
              </div>
            </div>

            {/* FAQ Links */}
            <div>
              <h3 className="text-xl font-bold text-charcoal mb-6 flex items-center gap-2">
                <MessageSquare size={20} className="text-brand" /> Common Questions
              </h3>
              <div className="space-y-3">
                {[
                   { label: 'Read our Buyer\'s Guide', action: () => navigate('/buyers-guide') },
                   { label: 'Read our Seller\'s Guide', action: () => navigate('/sellers-guide') },
                   { label: 'View Current Listings', action: () => navigate('/property-listings') },
                ].map((link, i) => (
                  <button 
                    key={i}
                    onClick={link.action}
                    className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-brand/30 hover:shadow-md transition-all group text-left"
                  >
                    <span className="text-gray-600 font-medium group-hover:text-charcoal">{link.label}</span>
                    <ArrowRight size={16} className="text-gray-300 group-hover:text-brand" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Map & Service Area */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-charcoal mb-4">Serving Houston & Beyond</h2>
            <p className="text-gray-500">Visit our headquarters or connect with us in any of our 6 major markets.</p>
          </div>

          <div className="max-w-5xl mx-auto">
             {/* Map Embed */}
             <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-200 h-[450px] relative bg-gray-100 w-full">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d443088.0518320649!2d-95.68266224375!3d29.817478200000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640b8b4488d8501%3A0xca0d02def365053b!2sHouston%2C%20TX!5e0!3m2!1sen!2sus!4v1652822453673!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lofton Realty Office Location"
                ></iframe>
             </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="bg-charcoal-dark py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-brand mb-3">
                  <stat.icon size={32} />
                </div>
                <div className="text-3xl font-extrabold text-white mb-1">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-gray-400 text-sm uppercase tracking-wider font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
             {['BBB Accredited', 'Realtor.com Partner', 'HAR.com Member', 'Equal Housing'].map((badge, i) => (
               <div key={i} className="px-4 py-2 border border-white/30 rounded text-white text-xs font-bold uppercase tracking-widest">
                 {badge}
               </div>
             ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};