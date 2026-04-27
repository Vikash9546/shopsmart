import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, ArrowLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await api.get(`/products/${id}`);
      return response.data.product;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <Link to="/" className="text-primary-600 font-bold flex items-center justify-center gap-2">
          <ArrowLeft size={20} /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors mb-8 font-medium">
        <ArrowLeft size={18} /> Back to Gallery
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
            <img 
              src={product.images?.[0]?.url || 'https://placehold.co/600x600?text=Shopmart'} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images?.map((img, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden border border-gray-200 cursor-pointer hover:border-primary-500 transition-all">
                <img src={img.url} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm font-bold mb-4 uppercase tracking-wider">
              {product.category}
            </span>
            <h1 className="text-4xl font-black text-gray-900 mb-2 leading-tight">{product.name}</h1>
            <p className="text-xl text-gray-500 font-medium">{product.brand}</p>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className={i < Math.floor(product.ratings?.average || 0) ? 'fill-current' : 'text-gray-300'} />
              ))}
            </div>
            <span className="text-gray-400 font-medium">({product.ratings?.count} Verified Reviews)</span>
          </div>

          <div className="mb-8">
            <span className="text-4xl font-black text-gray-900">₹{product.price.toLocaleString()}</span>
            {product.inventory?.totalStock < 10 && (
              <span className="ml-4 text-red-500 font-bold animate-pulse">Only {product.inventory.totalStock} left in stock!</span>
            )}
          </div>

          <div className="prose prose-sm text-gray-600 mb-8 max-w-none">
            <p className="text-lg leading-relaxed">{product.description}</p>
          </div>

          <div className="flex gap-4 mb-12">
            <button className="flex-1 btn-primary py-4 text-lg font-bold bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition shadow-lg shadow-primary-200">
              Add to Cart
            </button>
            <button className="p-4 border-2 border-gray-100 rounded-2xl hover:bg-gray-50 transition">
              <ShoppingCart size={24} className="text-gray-400" />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg text-green-600"><ShieldCheck size={20} /></div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">2 Year Warranty</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Truck size={20} /></div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Free Shipping</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><RotateCcw size={20} /></div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">30-Day Returns</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
