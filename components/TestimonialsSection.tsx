
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { getTestimonials } from '../lib/firebase/firestore';
import { Testimonial } from '../types';
import { LoadingSpinner } from './common/LoadingSpinner';
import { SectionHeader } from './common/SectionHeader';

export const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const data = await getTestimonials();
      setTestimonials(data);
      setLoading(false);
    };
    fetchTestimonials();
  }, []);

  // Responsive items per page
  useEffect(() => {
    const handleResize = () => {
      let newItemsPerPage = 1;
      if (window.innerWidth >= 1024) {
        newItemsPerPage = 3;
      } else if (window.innerWidth >= 768) {
        newItemsPerPage = 2;
      }
      
      setItemsPerPage(newItemsPerPage);
      // Ensure current page is valid when resizing
      setCurrentPage(current => {
         const maxPage = Math.ceil(testimonials.length / newItemsPerPage) - 1;
         return Math.max(0, Math.min(current, maxPage));
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [testimonials.length]);

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const handleNext = () => {
    if (totalPages > 0) setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    if (totalPages > 0) setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Pre-calculate chunks for rendering
  const chunks = [];
  if (testimonials.length > 0) {
    for (let i = 0; i < testimonials.length; i += itemsPerPage) {
      chunks.push(testimonials.slice(i, i + itemsPerPage));
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <LoadingSpinner />
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section className="py-[60px] md:py-[80px] lg:py-[100px] bg-white relative overflow-hidden" id="testimonials">
       {/* Background Elements */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-gray-50 rounded-full blur-3xl -z-10 opacity-60" />

      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <SectionHeader 
          subtitle="Testimonials"
          title="Stories from Home"
          align="left"
          className="mb-[40px] md:mb-[60px]"
        />

        {/* Carousel Content */}
        <div className="relative overflow-hidden -mx-4 px-4 py-4">
          <motion.div
            className="flex"
            animate={{ x: `-${currentPage * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 40, mass: 1 }} // Snappy, no overshoot
            style={{ width: '100%' }}
          >
            {chunks.map((chunk, pageIndex) => (
                <div 
                  key={pageIndex} 
                  className={`flex-shrink-0 w-full grid gap-6 px-1 ${
                       itemsPerPage === 1 ? 'grid-cols-1' : 
                       itemsPerPage === 2 ? 'grid-cols-2' : 'grid-cols-3'
                  }`}
                >
                  {chunk.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="bg-white border border-gray-100 p-8 rounded-[24px] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative group min-h-[320px]"
                    >
                      {/* Quote Icon */}
                      <div className="mb-6">
                        <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center text-brand">
                          <Quote size={20} className="fill-brand" />
                        </div>
                      </div>

                      {/* Content */}
                      <p className="text-gray-600 text-lg leading-relaxed italic mb-8 flex-grow">
                        "{testimonial.quote}"
                      </p>

                      {/* Footer */}
                      <div className="border-t border-gray-50 pt-6">
                          <h4 className="font-bold text-charcoal text-base">{testimonial.author}</h4>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-1">{testimonial.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Buttons - Bottom Right */}
        <div className="flex justify-end gap-3 mt-8">
            <button 
              onClick={handlePrev}
              disabled={totalPages <= 1}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-brand hover:text-brand transition-all active:scale-95 bg-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous testimonials"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={handleNext}
              disabled={totalPages <= 1}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-brand hover:text-brand transition-all active:scale-95 bg-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next testimonials"
            >
              <ChevronRight size={24} />
            </button>
        </div>
      </div>
    </section>
  );
};
