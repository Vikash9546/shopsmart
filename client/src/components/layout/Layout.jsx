import React from 'react';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8"
      >
        {children}
      </motion.main>
      
      {/* Premium Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <span className="text-2xl font-black text-primary-600 tracking-tight italic">SHOPMART</span>
              <p className="text-gray-500 text-sm leading-relaxed">
                Experience the next generation of e-commerce. Fast, secure, and multi-vendor ready.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="hover:text-primary-600 cursor-pointer">Electronics</li>
                <li className="hover:text-primary-600 cursor-pointer">Fashion</li>
                <li className="hover:text-primary-600 cursor-pointer">Home & Living</li>
                <li className="hover:text-primary-600 cursor-pointer">Appliances</li>
              </ul>
            </div>
            <div>
               <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Support</h4>
               <ul className="space-y-2 text-sm text-gray-500">
                <li className="hover:text-primary-600 cursor-pointer">Help Center</li>
                <li className="hover:text-primary-600 cursor-pointer">Returns & Refunds</li>
                <li className="hover:text-primary-600 cursor-pointer">Shipping Policy</li>
                <li className="hover:text-primary-600 cursor-pointer">Track Order</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Newsletter</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email"
                  className="bg-gray-100 border-none rounded-lg px-4 py-2 flex-1 text-sm focus:ring-2 focus:ring-primary-500"
                />
                <button className="btn-primary text-xs font-bold">JOIN</button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-12 pt-8 text-center text-xs text-gray-400">
            © 2026 SHOPMART Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
