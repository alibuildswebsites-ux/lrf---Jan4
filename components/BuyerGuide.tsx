import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, Home, Search, FileText, ClipboardCheck, Key, Award, 
  ChevronDown, ChevronUp, Calculator, Phone, ArrowRight, CheckCircle2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { getTestimonials } from '../lib/firebase/firestore';
import { Testimonial } from '../types';
import { getOptimizedImageUrl, updateSEO } from '../utils';
import { SharedContactForm } from './SharedContactForm';

// --- Types ---

interface GuideStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  details: string[];
  cta?: { text: string; action: () => void };
}

interface FAQ {
  question: string;
  answer: string;
}

// --- Mortgage Calculator Component ---

const MortgageCalculator = () => {
  const [price, setPrice] = useState(450000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [term, setTerm] = useState(30);

  const downPaymentAmount = (price * downPaymentPercent) / 100;
  const loanAmount = price - downPaymentAmount;
  
  const monthlyPayment = useMemo(() => {
    const r = interestRate / 100 / 12;
    const n = term * 12;
    if (r === 0) return loanAmount / n;
    return (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }, [loanAmount, interestRate, term]);

  const taxes = price * 0.018 / 12; // Est. 1.8% property tax
  const insurance = price * 0.005 / 12; // Est. 0.5% insurance
  const totalMonthly = monthlyPayment + taxes + insurance;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-charcoal p-6 text-white flex items-center gap-3">
        <Calculator className="text-brand" size={24} />
        <h3 className="text-xl font-bold">Mortgage Calculator</h3>
      </div>
      <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Home Price: ${price.toLocaleString()}</label>
            <input 
              type="range" min="100000" max="2000000" step="5000" 
              value={price} onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full accent-brand h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer touch-manipulation py-4"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Down Payment: {downPaymentPercent}% (${downPaymentAmount.toLocaleString()})</label>
            <input 
              type="range" min="3" max="50" step="1" 
              value={downPaymentPercent} onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-brand h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer touch-manipulation py-4"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Interest Rate (%)</label>
              <input 
                type="number" step="0.1" min="0" max="15" 
                value={interestRate} 
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (val >= 0) setInterestRate(val);
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-3 focus:ring-2 focus:ring-brand outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Loan Term (Years)</label>
              <select 
                value={term} onChange={(e) => setTerm(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-3 focus:ring-2 focus:ring-brand outline-none bg-white"
              >
                <option value={30}>30 Years</option>
                <option value={15}>15 Years</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center bg-gray-50 rounded-xl p-6 border border-gray-100">
          <span className="text-gray-500 font-medium mb-1">Estimated Monthly Payment</span>
          <span className="text-4xl md:text-5xl font-extrabold text-charcoal mb-6">
            ${Math.round(totalMonthly).toLocaleString()}
          </span>
          <div className="w-full space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-brand" /> Principal & Interest</span>
              <span className="font-bold">${Math.round(monthlyPayment).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-400" /> Property Taxes (Est.)</span>
              <span className="font-bold">${Math.round(taxes).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-400" /> Home Insurance (Est.)</span>
              <span className="font-bold">${Math.round(insurance).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

export const BuyerGuide = () => {
  const [activeStep, setActiveStep] = useState<string>('step-1');
  const [buyerTestimonials, setBuyerTestimonials] = useState<Testimonial[]>([]);
  const navigate = useNavigate();

  // Update SEO
  useEffect(() => {
    updateSEO({
      title: "First-Time Home Buyer Guide | Lofton Realty",
      description: "Learn how to buy a house in Texas with our step-by-step guide. From pre-approval to closing, Lofton Realty guides you through every step.",
      url: "https://loftonrealty.com/buyers-guide"
    });
    window.scrollTo(0, 0);

    const loadTestimonials = async () => {
      const data = await getTestimonials();
      const filtered = data.filter(t => 
        t.role.toLowerCase().includes('buyer') || 
        t.role.toLowerCase().includes('relocation')
      ).slice(0, 3);
      setBuyerTestimonials(filtered);
    };
    loadTestimonials();
  }, []);

  // Steps Data
  const steps: GuideStep[] = [
    {
      id: 'step-1',
      title: 'Get Pre-Qualified',
      description: 'Understanding your budget is the critical first step.',
      icon: DollarSign,
      details: [
        'Determine exactly how much home you can afford.',
        'Strengthen your offer in the eyes of sellers.',
        'Identify any credit issues early in the process.',
        'Lock in an interest rate to protect against increases.'
      ],
      cta: { text: 'Connect with Lenders', action: () => alert('Lender list coming soon!') }
    },
    {
      id: 'step-2',
      title: 'Define Your Needs',
      description: 'Create a clear vision of your ideal property.',
      icon: Home,
      details: [
        'Prioritize location, school districts, and commute times.',
        'Decide on property type: Single-family, Condo, or Townhome.',
        'List "Must-Haves" vs. "Nice-to-Haves".',
        'Consider future resale value and growth potential.'
      ]
    },
    {
      id: 'step-3',
      title: 'Start Your Search',
      description: 'The hunt begins! Access exclusive listings and tour homes.',
      icon: Search,
      details: [
        'Receive instant alerts for new listings matching your criteria.',
        'Schedule private tours of top contenders.',
        'Attend open houses to get a feel for different neighborhoods.',
        'Use virtual tours to narrow down your list efficiently.'
      ],
      cta: { text: 'View Current Listings', action: () => navigate('/property-listings') }
    },
    {
      id: 'step-4',
      title: 'Make an Offer',
      description: 'We craft a strategic offer to get you the best deal.',
      icon: FileText,
      details: [
        'Review comparable sales (comps) to determine fair market value.',
        'Decide on price, earnest money, and closing timeline.',
        'Include necessary contingencies (inspection, financing).',
        'Negotiate counter-offers with our expert guidance.'
      ]
    },
    {
      id: 'step-5',
      title: 'Home Inspection',
      description: 'Ensure the property is in the condition you expect.',
      icon: ClipboardCheck,
      details: [
        'Hire a licensed inspector to examine the structural integrity.',
        'Check roof, HVAC, plumbing, and electrical systems.',
        'Review the detailed report for any major red flags.',
        'Negotiate repairs or credits based on findings.'
      ]
    },
    {
      id: 'step-6',
      title: 'Secure Financing',
      description: 'Finalize your loan and prepare for closing.',
      icon: Key,
      details: [
        'Lender orders an appraisal to verify value.',
        'Submit all final documentation for underwriting.',
        'Receive "Clear to Close" from your lender.',
        'Review the Closing Disclosure (CD) for final costs.'
      ]
    },
    {
      id: 'step-7',
      title: 'Close on Your Home',
      description: 'Sign the papers and get your keys!',
      icon: Award,
      details: [
        'Perform a final walkthrough to verify condition.',
        'Sign legal documents at the title company.',
        'Pay closing costs and down payment.',
        'Celebrate! You are officially a homeowner.'
      ]
    }
  ];

  // FAQs Data
  const faqs: FAQ[] = [
    { question: "How much should I save for a down payment?", answer: "While 20% is traditional to avoid PMI, many buyers qualify for loans with as little as 3-5% down. FHA loans require 3.5%, and VA/USDA loans can be 0% down." },
    { question: "What is the difference between pre-qualified and pre-approved?", answer: "Pre-qualification is an estimate based on self-reported info. Pre-approval is a verified commitment from a lender based on documents, making it much stronger for offers." },
    { question: "How long does the buying process take?", answer: "On average, it takes 30-45 days from contract to close. Searching for a home can take anywhere from a few weeks to several months depending on inventory." },
    { question: "Who pays the real estate agent fees?", answer: "Typically, the seller pays the commission for both their listing agent and your buyer's agent. Our representation usually costs you nothing out of pocket." },
  ];

  // Scroll Spy for Sidebar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const step of steps) {
        const element = document.getElementById(step.id);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveStep(step.id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroBg = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80";

  return (
    <div className="font-sans bg-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-charcoal-dark overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center" 
          style={{ backgroundImage: `url(${getOptimizedImageUrl(heroBg, 1200)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-dark/90 to-charcoal-dark/70" />
        
        <div className="relative max-w-7xl mx-auto px-5 md:px-10 text-center text-white z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-brand/20 border border-brand/40 text-brand font-bold text-sm tracking-widest uppercase mb-6">
              Buyer's Resource
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
              Your Complete Guide to <br className="hidden md:block" /> Buying a Home
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 font-light">
              Expert guidance for first-time buyers and seasoned homeowners in the Houston market.
            </p>
            <button 
              onClick={() => document.getElementById('step-1')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-brand text-white hover:bg-brand-dark px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-brand/25 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand focus-visible:ring-offset-charcoal-dark"
            >
              Start Your Journey
            </button>
          </motion.div>
        </div>
      </div>

      {/* Intro Quote */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <div className="relative">
            <span className="text-6xl text-brand/20 absolute -top-8 -left-4 font-serif">"</span>
            <blockquote className="text-2xl md:text-3xl font-medium text-charcoal leading-relaxed relative z-10">
              Buying a home is more than just a transaction—it's a life-changing experience. I pledge to be in constant communication, keeping you fully informed throughout the entire process.
            </blockquote>
            <cite className="block mt-6 text-gray-500 font-bold not-italic text-sm tracking-wide uppercase">
              — Jared Lofton, Founder
            </cite>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-16 lg:py-24 grid lg:grid-cols-[280px_1fr] gap-12">
        
        {/* Sticky Sidebar Navigation (Desktop) */}
        <aside className="hidden lg:block h-fit sticky top-28">
          <nav className="space-y-1 border-l-2 border-gray-100 pl-4">
            {steps.map((step) => (
              <a
                key={step.id}
                href={`#${step.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(step.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`block py-2 text-sm font-bold transition-colors ${
                  activeStep === step.id ? 'text-brand -ml-[18px] pl-[14px] border-l-2 border-brand' : 'text-gray-400 hover:text-charcoal'
                }`}
              >
                {step.title}
              </a>
            ))}
          </nav>
          
          <div className="mt-10 bg-brand-light/50 p-6 rounded-xl border border-brand/20">
            <h4 className="font-bold text-charcoal mb-2">Need Help?</h4>
            <p className="text-sm text-gray-600 mb-4">Our team is ready to answer your questions.</p>
            <a href="tel:713-203-7661" className="flex items-center gap-2 text-brand font-bold text-sm hover:underline">
              <Phone size={16} /> (713) 203-7661
            </a>
          </div>
        </aside>

        {/* Step-by-Step Timeline */}
        <div className="space-y-16">
          <div className="lg:hidden mb-8">
            <h2 className="text-3xl font-extrabold text-charcoal">7 Steps to Homeownership</h2>
          </div>

          <div className="relative">
             {/* Timeline Line */}
             <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gray-200 hidden md:block" />

             {steps.map((step, index) => (
               <div key={step.id} id={step.id} className="relative mb-16 last:mb-0 md:pl-24 scroll-mt-32">
                 {/* Timeline Icon Bubble */}
                 <div className="hidden md:flex absolute left-0 top-0 w-16 h-16 rounded-full bg-white border-4 border-gray-100 items-center justify-center text-brand z-10 shadow-sm">
                   <step.icon size={28} />
                 </div>

                 {/* Mobile Icon Header */}
                 <div className="flex items-center gap-4 md:hidden mb-4">
                   <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-brand">
                     <step.icon size={24} />
                   </div>
                   <h3 className="text-xl font-bold text-charcoal">Step {index + 1}</h3>
                 </div>

                 <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                   <h3 className="hidden md:block text-2xl font-bold text-charcoal mb-2">{step.title}</h3>
                   <h3 className="md:hidden text-2xl font-bold text-charcoal mb-2">{step.title}</h3>
                   <p className="text-lg text-gray-500 mb-6">{step.description}</p>
                   
                   <ul className="space-y-3 mb-6">
                     {step.details.map((detail, idx) => (
                       <li key={idx} className="flex items-start gap-3 text-gray-700">
                         <CheckCircle2 size={18} className="text-brand flex-shrink-0 mt-1" />
                         <span>{detail}</span>
                       </li>
                     ))}
                   </ul>

                   {step.cta && (
                     <button 
                       onClick={step.cta.action}
                       className="inline-flex items-center gap-2 text-charcoal font-bold hover:text-brand transition-colors"
                     >
                       {step.cta.text} <ArrowRight size={18} />
                     </button>
                   )}
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Interactive Tools Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="text-center mb-12">
            <span className="text-brand font-bold tracking-widest uppercase text-sm">Planning Tools</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-charcoal mt-2">Plan Your Purchase</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Mortgage Calculator */}
            <MortgageCalculator />

            {/* Resources & Downloads */}
            <div className="space-y-8">
              {/* FAQ Accordion */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                 <h3 className="text-xl font-bold text-charcoal mb-6">Common Questions</h3>
                 <div className="space-y-2">
                   {faqs.map((faq, idx) => (
                     <FAQItem key={idx} faq={faq} />
                   ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Buyer Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-charcoal">Buyer Success Stories</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {buyerTestimonials.map((t) => (
               <div key={t.id} className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                 <p className="text-gray-600 italic mb-6">"{t.quote}"</p>
                 <div>
                   <h5 className="font-bold text-charcoal">{t.author}</h5>
                   <span className="text-xs font-bold text-brand uppercase">{t.role}</span>
                 </div>
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form CTA (Dark Card Theme) */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <div className="bg-charcoal-dark rounded-[32px] p-8 md:p-16 overflow-hidden relative shadow-2xl">
            {/* Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand rounded-full blur-[80px] opacity-20 translate-x-1/2 -translate-y-1/2" />

            <div className="relative z-10 text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to Start Your Journey?</h2>
              <p className="text-gray-400 text-lg">Schedule a free consultation with our buying experts.</p>
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

// FAQ Helper Component
const FAQItem: React.FC<{ faq: FAQ }> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex justify-between items-center text-left focus:outline-none group"
      >
        <span className={`font-bold transition-colors ${isOpen ? 'text-brand' : 'text-gray-700 group-hover:text-charcoal'}`}>
          {faq.question}
        </span>
        {isOpen ? <ChevronUp size={18} className="text-brand" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-gray-500 text-sm leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};