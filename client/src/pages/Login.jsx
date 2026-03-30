import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Store, ArrowRight, Github, Chrome } from 'lucide-react';
import { loginStart, loginSuccess, loginFailure } from '../features/auth/authSlice';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    dispatch(loginStart());

    try {
      const { data } = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, ...userData } = data.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      dispatch(loginSuccess(userData));
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password';
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
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col"
      >
        <div className="p-10 space-y-8 flex-1">
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-primary-50 rounded-2xl text-primary-600 mb-2">
              <Store size={32} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
            <p className="text-gray-500 font-medium">Log in to your account to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full bg-gray-50 border-2 border-transparent py-4 pl-12 pr-4 rounded-2xl focus:bg-white focus:border-primary-500 transition-all font-medium text-gray-800"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-gray-700">Password</label>
                <button type="button" className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors">Forgot Password?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-2 border-transparent py-4 pl-12 pr-12 rounded-2xl focus:bg-white focus:border-primary-500 transition-all font-medium text-gray-800"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                {error}
              </motion.div>
            )}

            <button
              disabled={loading}
              className="w-full btn-primary py-4 bg-gray-900 border-none rounded-2xl flex items-center justify-center gap-3 text-lg font-black tracking-wide shadow-xl hover:shadow-primary-500/20 active:scale-95 transition-all text-white disabled:bg-gray-400"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>SIGN IN <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="space-y-6">
            <div className="relative flex items-center gap-4">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-gray-400 text-xs font-black tracking-widest uppercase">Or Continue With</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-3 border-2 border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-sm">
                <Chrome size={20}/> Google
              </button>
              <button className="flex items-center justify-center gap-3 py-3 border-2 border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-sm">
                <Github size={20}/> Github
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-gray-500 font-medium">New around here? <Link to="/register" className="text-primary-600 font-black hover:underline underline-offset-4">Create Account</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
