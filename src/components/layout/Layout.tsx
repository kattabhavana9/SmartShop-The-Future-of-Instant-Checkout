import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from '../ui/Toaster';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow animate-fade-in">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Layout;