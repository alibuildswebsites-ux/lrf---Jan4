
import React from 'react';
import { Link } from 'react-router-dom';
import { FEATURES } from '../data';
import { SectionHeader } from './common/SectionHeader';

export const TrustSection = () => {
  return (
    <section className="py-[60px] md:py-[80px] lg:py-[100px] bg-white overflow-hidden" id="about">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-[40px]">
        
        <SectionHeader 
          subtitle="Why Choose Us"
          title={<>A Real Estate Partner <br/> You Can Trust</>}
          description="We don't just facilitate transactions; we build relationships. With over 15 years of experience and a client-first approach, we're dedicated to achieving your real estate goals."
        />

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
           {FEATURES.map((feature, idx) => (
             <div key={idx} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-brand mb-6">
                   <feature.icon size={24} />
                </div>
                <h4 className="text-xl font-bold text-charcoal mb-3">{feature.title}</h4>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
             </div>
           ))}
        </div>
        
        {/* CTA */}
        <div className="text-center">
            <Link 
              to="/about-us"
              className="bg-charcoal text-white px-8 py-3.5 rounded-full font-bold hover:bg-black transition-colors shadow-lg shadow-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 inline-block"
            >
              Meet The Team
            </Link>
        </div>

      </div>
    </section>
  )
}
