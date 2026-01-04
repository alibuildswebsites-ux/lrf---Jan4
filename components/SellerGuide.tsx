import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Camera, Handshake, FileCheck, Home, DollarSign, Megaphone, 
  Eye, FileText, Scale, Key, Download, ChevronDown, ChevronUp, CheckCircle2,
  ArrowRight, Calculator, Loader2
} from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { getTestimonials } from '../lib/firebase/firestore';
import { Testimonial } from '../types';
import { getOptimizedImageUrl, updateSEO } from '../utils';
import { SharedContactForm } from './SharedContactForm';

// --- Types ---

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  downloadable?: string;
  cta?: { text: string; action: () => void };
}

interface ValuationForm {
  address: string;
  type: string;
  beds: string;
  baths: string;
  sqft: string;
  year: string;
}

// --- Sub-Components ---

const ValuationTool = () => {
  const [formData, setFormData] = useState<ValuationForm>({
    address: '', type: 'Single Family', beds: '', baths: '', sqft: '', year: ''
  });
  const [result, setResult] = useState<{ min: number; max: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API calculation delay
    setTimeout(() => {
      const sqft = Number(formData.sqft) || 2000; // Fallback
      const basePrice = sqft * 245; // Mock $245/sqft
      const variance = basePrice * 0.05;
      setResult({
        min: basePrice - variance,
        max: basePrice + variance
      });
      setLoading(false);
    }, 1500);
  };

  const resetForm = () => {
    setResult(null);
    setFormData({ address: '', type: 'Single Family', beds: '', baths: '', sqft: '', year: '' });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative">
      <div className="bg-charcoal p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calculator className="text-brand" size={24} />
          <h3 className="text-xl font-bold">Instant Home Valuation</h3>
        </div>
      </div>

      <div className="p-8">
        {!result ? (
          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Property Address</label>
              <input 
                required
                type="text"
                placeholder="123 Maple Ave, Houston, TX"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand outline-none transition-all"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Property Type</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand outline-none bg-white"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option>Single Family</option>
                  <option>Condo</option>
                  <option>Townhome</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Year Built</label>
                <input 
                  type="number" 
                  placeholder="2005"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand outline-none"
                  value={formData.year}
                  onChange={e => setFormData({...formData, year: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Beds</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand outline-none bg-white"
                  value={formData.beds}
                  onChange={e => setFormData({...formData, beds: e.target.value})}
                >
                  <option value="">-</option>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Baths</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand outline-none bg-white"
                  value={formData.baths}
                  onChange={e => setFormData({...formData, baths: e.target.value})}
                >
                  <option value="">-</option>
                  {[1,1.5,2,2.5,3,3.5,4].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Sq. Ft.</label>
                <input 
                  required
                  type="number" 
                  placeholder="2500"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand outline-none"
                  value={formData.sqft}
                  onChange={e => setFormData({...formData, sqft: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand text-white font-bold py-4 rounded-xl hover:bg-brand-dark transition-all shadow-lg shadow-brand/20 flex justify-center items-center"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                'Get My Estimate'
              )}
            </button>
          </form>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <TrendingUp className="text-green-600" size={32} />
            </div>
            <h4 className="text-lg text-gray-500 font-medium mb-2">Estimated Market Value</h4>
            <div className="text-4xl md:text-5xl font-extrabold text-charcoal mb-2">
              ${result.min.toLocaleString()} - ${result.max.toLocaleString()}
            </div>
            <p className="text-sm text-gray-400 mb-8 max-w-sm mx-auto">
              *This is a preliminary estimate based on market averages for {formData.address}.
            </p>
            
            <div className="space-y-3">
              <button 
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full bg-charcoal text-white font-bold py-3 rounded-lg hover:bg-black transition-colors"
              >
                Request Official CMA Report
              </button>
              <button 
                onClick={resetForm}
                className="w-full text-gray-500 font-medium py-2 hover:text-brand transition-colors"
              >
                Start Over
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// --- Main Page Component ---

export const SellerGuide = () => {
  const [sellerTestimonials, setSellerTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    updateSEO({
      title: "Seller's Guide | Home Valuation | Lofton Realty",
      description: "Sell your Houston home for top dollar with Lofton Realty. Get a free home valuation and expert selling tips from our experienced team.",
      url: "https://loftonrealty.com/sellers-guide"
    });
    window.scrollTo(0, 0);

    const loadTestimonials = async () => {
      const data = await getTestimonials();
      const filtered = data.filter(t => 
        t.role.toLowerCase().includes('seller') || 
        t.role.toLowerCase().includes('investor')
      ).slice(0, 3);
      setSellerTestimonials(filtered);
    };
    loadTestimonials();
  }, []);

  const steps: TimelineStep[] = [
    {
      id: 'prep',
      title: 'Prepare Your Home',
      description: 'First impressions are everything. We help you identify high-ROI improvements and stage your home to shine.',
      icon: Home,
      downloadable: 'Home Prep Checklist'
    },
    {
      id: 'price',
      title: 'Set the Right Price',
      description: 'Using advanced market data, we determine a competitive price that attracts buyers without leaving money on the table.',
      icon: DollarSign,
      cta: { text: 'Get Free CMA', action: () => document.getElementById('valuation')?.scrollIntoView({ behavior: 'smooth' }) }
    },
    {
      id: 'market',
      title: 'Professional Marketing',
      description: 'We launch a comprehensive campaign featuring 4K video, drone shots, and targeted social media ads.',
      icon: Megaphone
    },
    {
      id: 'show',
      title: 'Show Your Home',
      description: 'We manage all showings and gather feedback, ensuring your home is accessible to serious buyers.',
      icon: Eye,
      downloadable: 'Showing Prep Guide'
    },
    {
      id: 'offers',
      title: 'Review Offers',
      description: 'We analyze every offer, helping you understand terms, contingencies, and financial strength of the buyer.',
      icon: FileText
    },
    {
      id: 'negotiate',
      title: 'Negotiate & Accept',
      description: 'Our expert negotiation strategies ensure you get the best terms, protecting your equity and timeline.',
      icon: Scale
    },
    {
      id: 'close',
      title: 'Close the Sale',
      description: 'We coordinate with title companies and lenders to ensure a smooth, stress-free closing day.',
      icon: Key,
      downloadable: 'Closing Day Checklist'
    }
  ];

  const valueProps = [
    { title: 'Strategic Pricing', desc: 'Data-driven analysis to maximize your return.', icon: TrendingUp },
    { title: 'Pro Marketing', desc: 'Cinematic video and global MLS exposure.', icon: Camera },
    { title: 'Expert Negotiation', desc: 'Protecting your interests at every turn.', icon: Handshake },
    { title: 'Seamless Closing', desc: 'Handling the details so you can move on.', icon: FileCheck },
  ];

  const faqs = [
    { q: "How do I determine my home's value?", a: "We perform a Comparative Market Analysis (CMA) analyzing recent sales of similar homes in your specific neighborhood, adjusting for your home's unique features and condition." },
    { q: "Should I make repairs before listing?", a: "Not always. We recommend high-impact, low-cost cosmetic updates (paint, landscaping) over major renovations, as you rarely get a 100% return on big projects." },
    { q: "How long will it take to sell?", a: "Our average time on market is 14 days, significantly faster than the market average. However, this varies by price point and neighborhood inventory." },
    { q: "What are seller closing costs?", a: "In Texas, sellers typically pay for the title policy, agent commissions, and pro-rated property taxes. Expect roughly 6-8% of the sales price in total closing costs." },
  ];

  const heroBg = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80";

  return (
    <div className="font-sans bg-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-charcoal-dark overflow-hidden">
        <div 
           className="absolute inset-0 opacity-30 bg-cover bg-center" 
           style={{ backgroundImage: `url(${getOptimizedImageUrl(heroBg, 1200)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-dark via-charcoal-dark/90 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-5 md:px-10 z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-brand/20 border border-brand/40 text-brand font-bold text-sm tracking-widest uppercase mb-6">
              Seller's Guide
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              Sell Your Home <br /> <span className="text-brand">With Confidence</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 font-light leading-relaxed max-w-xl">
              Strategic marketing, expert pricing, and personalized service from listing to closing. Experience the Lofton difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => document.getElementById('valuation')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-brand text-white hover:bg-brand-dark px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-brand/25 transition-all"
              >
                Get Free Valuation
              </button>
              <button 
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-transparent border border-white text-white hover:bg-white/10 px-8 py-4 rounded-full font-bold text-lg transition-all"
              >
                Contact Us
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Value Proposition Grid */}
      <section className="py-20 bg-gray-50 relative -mt-10 md:-mt-20 z-20">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map((vp, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:border-brand/30 transition-colors"
              >
                <div className="w-14 h-14 bg-brand-light rounded-xl flex items-center justify-center text-brand mb-6">
                  <vp.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-3">{vp.title}</h3>
                <p className="text-gray-500 leading-relaxed">{vp.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <p className="text-2xl md:text-3xl font-medium text-charcoal leading-relaxed">
            "We don't measure success through achievements or awards, but through the satisfaction of our clients. We work relentlessly to help you achieve top dollar for your property."
          </p>
          <div className="h-1 w-20 bg-brand mx-auto mt-8 mb-4" />
        </div>
      </section>

      {/* Valuation Tool & Stats */}
      <section id="valuation" className="py-20 bg-charcoal-dark text-white relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand rounded-full blur-[120px] opacity-10 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-5 md:px-10 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <span className="text-brand font-bold tracking-widest uppercase text-sm mb-2 block">Market Intelligence</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">What's Your Home Worth?</h2>
            <p className="text-gray-400 text-lg mb-10 max-w-lg">
              Get a preliminary estimate instantly. For a precise valuation, our agents conduct a thorough walkthrough and analysis.
            </p>
            
            {/* Success Metrics */}
            <div className="grid grid-cols-2 gap-8 border-t border-gray-700 pt-10">
              <div>
                <div className="text-4xl font-extrabold text-brand mb-1">98.5%</div>
                <div className="text-sm text-gray-400 font-medium uppercase tracking-wide">Sale-to-List Price</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-brand mb-1">14</div>
                <div className="text-sm text-gray-400 font-medium uppercase tracking-wide">Avg. Days on Market</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-white mb-1">500+</div>
                <div className="text-sm text-gray-400 font-medium uppercase tracking-wide">Homes Sold</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-white mb-1">5 ★</div>
                <div className="text-sm text-gray-400 font-medium uppercase tracking-wide">Client Rating</div>
              </div>
            </div>
          </div>

          <ValuationTool />
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-charcoal mb-4">The Selling Process</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">From preparation to payday, we guide you through every milestone with transparency and expertise.</p>
          </div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200" />

            <div className="space-y-12">
              {steps.map((step, idx) => (
                <div key={step.id} className={`flex flex-col md:flex-row gap-8 items-start ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Content Side */}
                  <div className={`flex-1 w-full pl-16 md:pl-0 ${idx % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <h3 className="text-xl font-bold text-charcoal mb-2">{step.title}</h3>
                      <p className="text-gray-500 mb-4">{step.description}</p>
                      
                      <div className={`flex flex-wrap gap-3 ${idx % 2 === 0 ? 'md:justify-end' : ''}`}>
                        {step.downloadable && (
                          <button className="flex items-center gap-2 text-sm font-bold text-brand bg-brand-light/50 px-3 py-1.5 rounded-lg hover:bg-brand-light transition-colors">
                            <Download size={16} /> {step.downloadable}
                          </button>
                        )}
                        {step.cta && (
                          <button 
                            onClick={step.cta.action}
                            className="flex items-center gap-2 text-sm font-bold text-white bg-charcoal px-3 py-1.5 rounded-lg hover:bg-black transition-colors"
                          >
                            {step.cta.text} <ArrowRight size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Icon Center */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 bg-brand rounded-full border-4 border-white shadow-md flex items-center justify-center text-white z-10">
                    <step.icon size={20} />
                  </div>
                  
                  {/* Spacer Side */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Marketing Showcase */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-brand font-bold tracking-widest uppercase text-sm mb-2 block">Visual Excellence</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-charcoal mb-6">Marketing That Moves</h2>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                Most buyers find their home online. We ensure your listing stops the scroll with professional staging, high-dynamic-range photography, and cinematic video tours.
              </p>
              
              <div className="space-y-6">
                 <div className="flex gap-4">
                    <CheckCircle2 className="text-brand flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-charcoal">Professional Staging Consultation</h4>
                      <p className="text-sm text-gray-500">We help you declutter and arrange to maximize space.</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <CheckCircle2 className="text-brand flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-charcoal">HDR Photography & Drone</h4>
                      <p className="text-sm text-gray-500">Capturing every angle and the surrounding neighborhood.</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <CheckCircle2 className="text-brand flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-charcoal">Social Media Amplification</h4>
                      <p className="text-sm text-gray-500">Targeted ads on Instagram, Facebook, and YouTube.</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Visual Example */}
            <div className="relative group rounded-2xl overflow-hidden shadow-2xl">
               <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
               <img 
                 src={getOptimizedImageUrl('https://images.unsplash.com/photo-1600585154340-be6161a56a0c', 800)} 
                 alt="Professional Real Estate Photography"
                 className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                 loading="lazy"
               />
               <div className="absolute bottom-6 left-6 z-20 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg">
                 <span className="font-bold text-charcoal flex items-center gap-2">
                   <Camera size={18} className="text-brand" /> 
                   Professional Media Package Included
                 </span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ & Testimonials Split */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5 md:px-10 grid lg:grid-cols-2 gap-12">
          
          {/* FAQ */}
          <div>
            <h3 className="text-2xl font-bold text-charcoal mb-8">Seller Frequently Asked Questions</h3>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <details className="group p-4 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-center justify-between font-bold text-charcoal text-lg">
                      {faq.q}
                      <span className="ml-4 shrink-0 rounded-full bg-gray-50 p-1.5 text-gray-900 sm:p-3 group-open:bg-brand group-open:text-white transition-colors">
                        <ChevronDown size={18} className="group-open:hidden" />
                        <ChevronUp size={18} className="hidden group-open:block" />
                      </span>
                    </summary>
                    <p className="mt-4 leading-relaxed text-gray-500">
                      {faq.a}
                    </p>
                  </details>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div>
            <h3 className="text-2xl font-bold text-charcoal mb-8">Success Stories</h3>
            <div className="space-y-6">
              {sellerTestimonials.map(t => (
                <div key={t.id} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                  <p className="italic text-gray-600 mb-4">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center font-bold">
                      {t.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-charcoal">{t.author}</div>
                      <div className="text-xs font-bold text-brand uppercase">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Contact Form CTA */}
      <section id="contact-form" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <div className="bg-charcoal-dark rounded-[32px] p-8 md:p-16 overflow-hidden relative shadow-2xl">
            {/* Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand rounded-full blur-[80px] opacity-20 translate-x-1/2 -translate-y-1/2" />

            <div className="relative z-10 text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to Sell Your Home?</h2>
              <p className="text-gray-400 text-lg">Schedule a no-obligation consultation with our team.</p>
            </div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
               <SharedContactForm variant="dark" />
            </div>

            <div className="relative z-10 pt-6 text-center">
                <p className="text-gray-400 text-sm mb-2">Or call us directly</p>
                <a href="tel:7132037661" className="text-white font-bold text-xl hover:text-brand transition-colors">
                  (713) 203-7661
                </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};