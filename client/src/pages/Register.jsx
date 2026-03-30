import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Store, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import { loginStart, loginSuccess, loginFailure } from '../features/auth/authSlice';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    dispatch(loginStart());

    try {
      const { data } = await api.post('/auth/register', formData);
      const { accessToken, refreshToken, ...userData } = data.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      dispatch(loginSuccess(userData));
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create account';
      setError(msg);
      dispatch(loginFailure(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row"
      >
        {/* Left Side - Info */}
        <div className="w-full md:w-5/12 bg-primary-600 p-10 text-white flex flex-col justify-between">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 mb-8">
                <Store size={28} />
                <span className="text-xl font-black italic">SHOPMART</span>
            </Link>
            <h2 className="text-3xl font-bold leading-tight">Join the next gen shopping era.</h2>
            <p className="text-primary-100/80 font-medium">Create an account to track orders, manage addresses, and get personalized recommendations.</p>
          </div>
          
          <div className="space-y-6 pt-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><UserCheck size={20} /></div>
              <p className="text-sm font-medium">Verified Sellers only</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><ShieldCheck size={20} /></div>
              <p className="text-sm font-medium">Secure Transactions</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-7/12 p-10 space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Create Account</h2>
            <p className="text-gray-500 font-medium">Enter your details to register</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
             <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="input-field pl-12 py-3.5 bg-gray-50 border-none rounded-xl"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="input-field pl-12 py-3.5 bg-gray-50 border-none rounded-xl"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="input-field pl-12 py-3.5 bg-gray-50 border-none rounded-xl"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">I am a...</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${formData.role === 'customer' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'}`}
                  onClick={() => setFormData({ ...formData, role: 'customer' })}
                >
                  Customer
                </button>
                <button
                  type="button"
                  className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${formData.role === 'seller' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'}`}
                  onClick={() => setFormData({ ...formData, role: 'seller' })}
                >
                  Seller
                </button>
              </div>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold">{error}</div>}

            <button
              disabled={loading}
              className="w-full btn-primary py-4 bg-gray-900 border-none rounded-xl flex items-center justify-center gap-3 text-lg font-black mt-4 disabled:bg-gray-400 shadow-xl hover:shadow-primary-500/10 transition-all text-white"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>GET STARTED <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <p className="text-gray-500 text-center font-medium">Already have an account? <Link to="/login" className="text-primary-600 font-black hover:underline">Log In</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
