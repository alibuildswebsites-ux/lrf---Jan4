import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, MessageSquare, TrendingUp, Heart, Award, ShieldCheck, 
  Clock, Phone, Mail, Linkedin, MapPin, Building, GraduationCap, CheckCircle2, ArrowRight, Home
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { LocationsSection } from './LocationsSection';
import { TestimonialsSection } from './TestimonialsSection';
import { getOptimizedImageUrl, updateSEO } from '../utils';

export const AboutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    updateSEO({
      title: "About Lofton Realty | Our Story & Team",
      description: "Learn about Lofton Realty, a relationship-driven brokerage founded by Jared Lofton. Serving Houston, Galveston, Austin, and beyond with integrity.",
      url: "https://loftonrealty.com/about-us"
    });
    window.scrollTo(0, 0);
  }, []);

  // --- Data ---

  const values = [
    {
      title: "Client-First Philosophy",
      desc: "Your goals are our mission. Every decision we make prioritizes your success above all else.",
      icon: Users
    },
    {
      title: "Constant Communication",
      desc: "We pledge to keep you fully informed throughout the entire buying or selling process.",
      icon: MessageSquare
    },
    {
      title: "Market Expertise",
      desc: "Deep understanding of local markets, trends, and neighborhood dynamics across 6 markets.",
      icon: TrendingUp
    },
    {
      title: "Lasting Relationships",
      desc: "We stay in touch with past clients, becoming your trusted real estate advisor for life.",
      icon: Heart
    }
  ];

  const timeline = [
    { year: "2006", title: "Lofton Realty Founded", desc: "Jared Lofton establishes the firm in Houston." },
    { year: "2010", title: "Coastal Expansion", desc: "Expanded services to the Galveston market." },
    { year: "2015", title: "Austin Market Entry", desc: "Began serving clients in the Texas Hill Country." },
    { year: "2018", title: "Multi-State Growth", desc: "Expanded to Louisiana, Mississippi, and Florida." },
    { year: "2020", title: "500+ Properties Sold", desc: "Reached a major milestone in transaction volume." },
    { year: "2024", title: "98% Satisfaction", desc: "Achieved record-high client satisfaction ratings." }
  ];

  const differentiators = [
    { title: "Comprehensive Market Analysis", desc: "Every listing receives a detailed CMA using the latest market data to ensure optimal pricing strategy." },
    { title: "Professional Marketing", desc: "High-quality photography, videography, virtual tours, and social media amplification come standard." },
    { title: "Negotiation Expertise", desc: "Financial background provides a unique advantage in complex negotiations and deal structuring." },
    { title: "Full-Service Support", desc: "From first-time buyers to seasoned investors, we provide personalized guidance tailored to unique goals." },
    { title: "24/7 Availability", desc: "Real estate doesn't follow a 9-5 schedule. Neither do we. We're available when you need us." }
  ];

  const heroBg = "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1920&q=80";

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-charcoal-dark overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30 bg-cover bg-center" 
          style={{ backgroundImage: `url(${getOptimizedImageUrl(heroBg, 1200)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-dark via-charcoal-dark/90 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-5 md:px-10 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-brand/20 border border-brand/40 text-brand font-bold text-sm tracking-widest uppercase mb-6">
              Our Story
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              Real Estate Built on <span className="text-brand">Relationships</span>
            </h1>
            <p className="text-xl text-gray-300 mb-0 font-light leading-relaxed max-w-xl">
              15+ years of putting clients first in Houston, Galveston, Austin, and beyond. We don't just sell homes; we build futures.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-charcoal mb-6">More Than Just A Transaction</h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  Since 2006, Lofton Realty has been dedicated to one simple philosophy: <strong className="text-brand-dark">clients come first</strong>.
                </p>
                <p>
                  Founded by Jared Lofton, MBA, our journey began with a vision to transform real estate from a transactional experience into a relationship-driven service. With a background in finance from Merrill Lynch and an MBA from Texas Southern University, Jared combined financial expertise with a passion for helping people achieve their real estate goals.
                </p>
                <p>
                  What started as a single agent in Houston, Texas has grown into a multi-market real estate firm serving Texas, Louisiana, Mississippi, and Florida. But one thing hasn't changed: our unwavering commitment to exceptional client service.
                </p>
              </div>
            </div>
            <div className="relative">
               <div className="absolute -inset-4 bg-brand/10 rounded-3xl transform rotate-3" />
               <img 
                 src={getOptimizedImageUrl('https://images.unsplash.com/photo-1542744173-8e7e53415bb0', 800)} 
                 alt="Team collaboration" 
                 className="relative rounded-2xl shadow-xl w-full h-auto object-cover aspect-[4/3]"
                 loading="lazy"
               />
               <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur p-6 rounded-xl shadow-lg border border-gray-100">
                  <p className="font-serif italic text-charcoal text-lg">
                    "I take great pride in the relationships I build and always work relentlessly on my client's behalf."
                  </p>
                  <p className="text-sm font-bold text-brand mt-2 uppercase tracking-wide">— Jared Lofton, Founder</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Profile */}
      <section className="py-24 bg-charcoal-dark text-white">
        <div className="max-w-6xl mx-auto px-5 md:px-10">
           <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-12 lg:p-16 flex flex-col md:flex-row gap-12 items-center">
              {/* Image */}
              <div className="w-64 h-64 md:w-80 md:h-80 flex-shrink-0 relative">
                 <div className="absolute inset-0 bg-brand rounded-full blur-[40px] opacity-20" />
                 <img 
                   src={getOptimizedImageUrl('https://images.unsplash.com/photo-1560250097-0b93528c311a', 600)} 
                   alt="Jared Lofton, MBA" 
                   className="relative w-full h-full object-cover rounded-full border-4 border-white/10 shadow-2xl"
                   loading="lazy"
                 />
                 <div className="absolute bottom-4 right-4 bg-brand text-white p-3 rounded-full shadow-lg">
                   <Award size={24} />
                 </div>
              </div>

              {/* Bio */}
              <div className="flex-1 text-center md:text-left">
                 <h2 className="text-3xl md:text-4xl font-extrabold mb-2">Jared Lofton, MBA</h2>
                 <p className="text-brand font-bold text-lg uppercase tracking-wider mb-6">Founder & Real Estate Broker</p>
                 
                 <div className="space-y-4 text-gray-300 mb-8">
                   <div className="flex items-start gap-3 justify-center md:justify-start">
                     <Clock className="text-brand mt-1 flex-shrink-0" size={18} />
                     <span>19+ Years Real Estate Experience</span>
                   </div>
                   <div className="flex items-start gap-3 justify-center md:justify-start">
                     <GraduationCap className="text-brand mt-1 flex-shrink-0" size={18} />
                     <span>MBA in Finance & Business - Texas Southern University</span>
                   </div>
                   <div className="flex items-start gap-3 justify-center md:justify-start">
                     <Building className="text-brand mt-1 flex-shrink-0" size={18} />
                     <span>Former Financial Planner at Merrill Lynch</span>
                   </div>
                   <div className="flex items-start gap-3 justify-center md:justify-start">
                     <ShieldCheck className="text-brand mt-1 flex-shrink-0" size={18} />
                     <span>Licensed Broker & Developer since 2006</span>
                   </div>
                 </div>

                 <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                   <a href="tel:7132037661" className="flex items-center gap-2 bg-white text-charcoal px-5 py-2.5 rounded-full font-bold hover:bg-gray-200 transition-colors">
                     <Phone size={18} /> 713-203-7661
                   </a>
                   <a href="mailto:Info@LoftonRealty.com" className="flex items-center gap-2 bg-transparent border border-white/30 text-white px-5 py-2.5 rounded-full font-bold hover:bg-white/10 transition-colors">
                     <Mail size={18} /> Email Me
                   </a>
                   <a 
                     href="https://linkedin.com/company/lofton-realty" 
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center gap-2 bg-[#0077b5] text-white px-5 py-2.5 rounded-full font-bold hover:brightness-110 transition-colors"
                   >
                     <Linkedin size={18} /> LinkedIn
                   </a>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-charcoal mb-4">Our Core Values</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">The principles that guide our interactions and drive our success.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                <div className="w-14 h-14 bg-brand-light rounded-xl flex items-center justify-center text-brand mb-6 group-hover:scale-110 transition-transform">
                  <val.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-3">{val.title}</h3>
                <p className="text-gray-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Stats */}
      <section className="py-20 bg-charcoal text-white border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 lg:divide-x divide-gray-700">
            {[
              { label: 'Properties Sold', value: '500+', icon: Home },
              { label: 'Client Satisfaction', value: '98%', icon: Heart },
              { label: 'Years Experience', value: '15+', icon: Award },
              { label: 'Markets Served', value: '6', icon: MapPin },
              { label: 'Availability', value: '24/7', icon: Clock },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-4">
                 <stat.icon className="text-brand mb-4 opacity-80" size={32} />
                 <div className="text-4xl font-extrabold mb-1">{stat.value}</div>
                 <div className="text-gray-400 text-sm font-bold uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Markets Reuse */}
      <LocationsSection />

      {/* What Sets Us Apart */}
      <section className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-5 md:px-10">
           <div className="grid lg:grid-cols-2 gap-16">
             <div className="relative">
                <div className="sticky top-32">
                  <span className="text-brand font-bold tracking-widest uppercase text-sm mb-2 block">The Lofton Difference</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-charcoal mb-6">Why Clients Choose Us</h2>
                  <p className="text-gray-500 text-lg mb-8">
                    In a crowded market, experience and integrity matter. Here is how we deliver superior results for our clients every single day.
                  </p>
                  <button 
                    onClick={() => navigate('/contact-us')}
                    className="bg-charcoal text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-black transition-colors"
                  >
                    Experience the Difference
                  </button>
                </div>
             </div>
             
             <div className="space-y-8">
               {differentiators.map((item, idx) => (
                 <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle2 className="text-brand" size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-charcoal mb-2">{item.title}</h4>
                      <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                 </div>
               ))}
             </div>
           </div>
         </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-gray-50 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-extrabold text-charcoal">Our Journey</h2>
           </div>

           <div className="relative">
             {/* Horizontal Line */}
             <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 hidden lg:block" />
             
             <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-4 relative z-10">
               {timeline.map((item, idx) => (
                 <div key={idx} className="flex lg:flex-col items-center lg:text-center gap-6 lg:gap-4 w-full group">
                    {/* Dot */}
                    <div className="w-4 h-4 rounded-full bg-brand ring-4 ring-white shadow-md flex-shrink-0 lg:order-2 z-10" />
                    
                    {/* Content Top (Desktop) */}
                    <div className={`lg:order-1 lg:mb-8 flex-1 lg:flex-none ${idx % 2 !== 0 ? 'lg:invisible' : ''}`}>
                       <span className="text-4xl font-black text-gray-200 group-hover:text-brand/20 transition-colors">{item.year}</span>
                    </div>

                    {/* Content Bottom (Desktop) */}
                    <div className={`lg:order-3 lg:mt-8 flex-1 lg:flex-none bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:w-48 xl:w-56 text-left lg:text-center ${idx % 2 === 0 && 'lg:hidden'}`}>
                       <h4 className="font-bold text-charcoal mb-1 lg:hidden">{item.year}</h4>
                       <h4 className="font-bold text-charcoal mb-2">{item.title}</h4>
                       <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>

                     {/* Content Top (Desktop Alternating) */}
                     <div className={`hidden lg:block lg:order-1 lg:mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:w-48 xl:w-56 ${idx % 2 !== 0 && 'invisible'}`}>
                       <h4 className="font-bold text-charcoal mb-2">{item.title}</h4>
                       <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                     
                    {/* Content Bottom (Desktop Alternating Year) */}
                    <div className={`hidden lg:block lg:order-3 lg:mt-8 ${idx % 2 === 0 ? 'invisible' : ''}`}>
                       <span className="text-4xl font-black text-gray-200 group-hover:text-brand/20 transition-colors">{item.year}</span>
                    </div>

                 </div>
               ))}
             </div>
           </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Certifications */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-5 md:px-10 text-center">
           <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-8">Accreditations & Memberships</p>
           <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {['Texas Real Estate Commission', 'Houston Association of Realtors', 'Equal Housing Opportunity', 'Realtor.com Pro', 'MBA Graduate'].map((cert, i) => (
                <div key={i} className="flex items-center gap-2 font-bold text-charcoal border border-gray-200 px-4 py-2 rounded-lg">
                  <ShieldCheck size={20} className="text-brand" />
                  {cert}
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-brand-light relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand rounded-full blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand rounded-full blur-[100px] opacity-20 -translate-x-1/2 translate-y-1/2" />
        
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center relative z-10">
           <h2 className="text-4xl md:text-5xl font-extrabold text-charcoal mb-6">Ready to Experience the Lofton Difference?</h2>
           <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">Join 500+ satisfied clients who chose relationship-driven real estate. Your journey starts here.</p>
           
           <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Link 
               to="/property-listings"
               className="bg-charcoal text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-black transition-colors shadow-lg text-center"
             >
               Start Your Home Search
             </Link>
             <Link 
               to="/contact-us"
               className="bg-white text-charcoal px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-colors shadow-lg border border-gray-200 flex items-center justify-center gap-2"
             >
               Get a Free Consultation <ArrowRight size={20} />
             </Link>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};