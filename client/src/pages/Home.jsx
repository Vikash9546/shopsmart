import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, ShieldCheck, Truck, Filter } from 'lucide-react';

const Home = () => {
  const [filters, setFilters] = useState({ title: '', price_min: '', price_max: '', categoryId: '' });
  const [appliedFilters, setAppliedFilters] = useState({ title: '', price_min: '', price_max: '', categoryId: '' });

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', appliedFilters],
    queryFn: async () => {
      const params = {};
      if (appliedFilters.title) params.search = appliedFilters.title;
      if (appliedFilters.price_min) params['price[gte]'] = appliedFilters.price_min;
      if (appliedFilters.price_max) params['price[lte]'] = appliedFilters.price_max;
      if (appliedFilters.categoryId) params.category = appliedFilters.categoryId;

      const response = await api.get('/products', { params });
      return response.data.products;
    },
  });

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-primary-900 to-indigo-900 flex items-center">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative px-8 md:px-16 space-y-6 max-w-2xl text-white">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-primary-300 font-bold tracking-widest text-sm uppercase"
          >
            <Zap size={16} /> Exclusive Launch Offer
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black leading-tight"
          >
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-indigo-300">Shopping</span> Experience
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-indigo-100/80 font-medium"
          >
            Discover premium products from verified sellers around the globe. Quality meets reliability in every order.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4 flex gap-4"
          >
            <button className="btn-primary flex items-center gap-2 bg-white text-primary-900 hover:bg-gray-100 border-none px-8 py-4 text-lg font-bold">
              Shop Now <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
        
        {/* Abstract Image Placeholder for Design */}
        <div className="hidden lg:block absolute right-16 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/10 backdrop-blur-xl rounded-full p-8 border border-white/20 animate-pulse">
            <div className="w-full h-full bg-primary-100/10 rounded-full border border-dashed border-white/20"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <ShieldCheck className="text-green-500" size={32} />, title: "Secure Payments", desc: "100% encryption and protection for every single transaction." },
          { icon: <Truck className="text-primary-500" size={32} />, title: "Express Shipping", desc: "Get your orders delivered within 48-72 hours across major cities." },
          { icon: <Zap className="text-yellow-500" size={32} />, title: "Flash Deals", desc: "Don't miss out on our hourly-refreshing lightning deals." }
        ].map((feat, i) => (
          <div key={i} className="p-8 rounded-2xl bg-white border border-gray-100 flex items-start gap-4 hover:shadow-lg transition-shadow group cursor-default">
            <div className="p-3 bg-gray-50 rounded-xl group-hover:scale-110 transition-transform">{feat.icon}</div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{feat.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Product Feed */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Trending <span className="text-primary-600">Now</span></h2>
            <p className="text-gray-500 font-medium">Curated products specifically chosen for you.</p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
            <input 
              type="text" 
              placeholder="Filter by title..." 
              className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none w-full md:w-32 lg:w-48"
              value={filters.title}
              onChange={(e) => setFilters({...filters, title: e.target.value})}
            />
            <input 
              type="number" 
              placeholder="Min ₹" 
              className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none w-24"
              value={filters.price_min}
              onChange={(e) => setFilters({...filters, price_min: e.target.value})}
            />
            <input 
              type="number" 
              placeholder="Max ₹" 
              className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none w-24"
              value={filters.price_max}
              onChange={(e) => setFilters({...filters, price_max: e.target.value})}
            />
            <select 
              className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none"
              value={filters.categoryId}
              onChange={(e) => setFilters({...filters, categoryId: e.target.value})}
            >
              <option value="">All Categories</option>
              <option value="1">Clothes</option>
              <option value="2">Electronics</option>
              <option value="3">Furniture</option>
              <option value="4">Shoes</option>
              <option value="5">Others</option>
            </select>
            <button 
              onClick={() => setAppliedFilters(filters)} 
              className="bg-primary-600 text-white rounded-xl px-4 py-2 text-sm font-bold hover:bg-primary-700 transition"
            >
              Apply
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="space-y-4 animate-pulse">
                <div className="bg-gray-200 h-64 rounded-xl"></div>
                <div className="space-y-2">
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <h3 className="text-xl font-bold text-gray-400 mb-2">Could not load products</h3>
            <button className="text-primary-600 font-bold" onClick={() => window.location.reload()}>Try Again</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {data?.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
