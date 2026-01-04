import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../Navbar';

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar variant="dashboard" />
      <main className="flex-grow pt-28 pb-12 max-w-7xl mx-auto px-5 md:px-6 lg:px-8 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;