import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, Search, Menu, X, LogOut, Package, Store } from 'lucide-react';
import { logout } from '../../features/auth/authSlice';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart?.items || []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary-600 p-1.5 rounded-lg">
              <Store className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">SHOPMART</span>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8 relative">
            <input
              type="text"
              placeholder="Search for products, brands and more"
              className="w-full bg-gray-100 border-none rounded-lg py-2 pl-4 pr-10 focus:ring-2 focus:ring-primary-500 transition-all font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600">
              <Search size={20} />
            </button>
          </form>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/cart" className="relative group">
              <ShoppingCart className="text-gray-600 group-hover:text-primary-600 transition-colors" size={24} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 group">
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border-2 border-transparent group-hover:border-primary-500 transition-all">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </button>
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <User size={18} /> My Profile
                  </Link>
                  <Link to="/orders" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Package size={18} /> My Orders
                  </Link>
                  {user?.role === 'seller' && (
                    <Link to="/seller/dashboard" className="flex items-center gap-3 px-4 py-2 text-sm text-primary-600 font-medium hover:bg-primary-50">
                      <Store size={18} /> Seller Hub
                    </Link>
                  )}
                  <div className="h-px bg-gray-100 my-1"></div>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-primary flex items-center gap-2 text-sm font-bold">
                <User size={18} /> Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-gray-100 rounded-lg py-2.5 px-4 font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={22} />
                </button>
              </form>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/cart" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl font-bold">
                  <ShoppingCart size={22} /> Cart
                </Link>
                {isAuthenticated ? (
                   <button onClick={handleLogout} className="flex items-center gap-3 p-3 bg-red-50 text-red-600 rounded-xl font-bold">
                    <LogOut size={22} /> Logout
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 bg-primary-600 text-white rounded-xl font-bold">
                    <User size={22} /> Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
