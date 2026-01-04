import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center text-center px-4 pt-32 pb-20">
        <div className="bg-red-50 p-6 rounded-full mb-6 ring-8 ring-red-50/50">
          <AlertCircle className="text-red-400 w-12 h-12" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-charcoal mb-4">Page Not Found</h1>
        <p className="text-gray-500 text-lg max-w-md mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/"
          className="flex items-center gap-2 bg-charcoal text-white px-8 py-3.5 rounded-full font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl"
        >
          <Home size={20} />
          Return Home
        </Link>
      </div>
      <Footer />
    </div>
  );
};