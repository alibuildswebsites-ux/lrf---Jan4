import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useInView } from 'framer-motion';
import { Star } from 'lucide-react';
import { STATS } from '../data';

const CountUpStats = ({ value, suffix }: { value: number, suffix: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
       let start = 0;
       const end = value;
       const duration = 2000;
       const incrementTime = 30;
       const step = end / (duration / incrementTime);
       
       const timer = setInterval(() => {
         start += step;
         if (start >= end) {
           motionValue.set(end);
           clearInterval(timer);
         } else {
           motionValue.set(start);
         }
       }, incrementTime);
       
       return () => clearInterval(timer);
    }
  }, [isInView, value, motionValue]);

  return <span ref={ref}><motion.span>{rounded}</motion.span>{suffix}</span>;
};

export const StatsBar = () => {
  return (
    <section className="bg-gray-50 border-b border-gray-100 py-[40px] md:py-[60px]">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-[40px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, idx) => (
            <div 
              key={idx}
              className="flex flex-col items-center text-center group"
            >
              <div className="mb-4">
                <stat.icon className="text-brand" size={32} />
              </div>
              
              {/* Count Up Animation */}
              <h3 className="text-[48px] leading-tight font-extrabold text-charcoal-dark mb-1">
                <CountUpStats value={stat.value} suffix={stat.suffix} />
              </h3>
              
              <p className="text-[16px] text-gray-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
        
        {/* Bottom Rating */}
        <div className="mt-12 flex flex-col items-center justify-center gap-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={24} className="fill-brand text-brand" />
            ))}
          </div>
          <p className="text-[14px] text-gray-400 font-medium">4.9 Average client rating</p>
        </div>
      </div>
    </section>
  );
};