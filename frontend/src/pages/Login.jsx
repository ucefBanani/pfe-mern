import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import { Mail, Lock, ArrowRight, ShieldAlert } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      setErrorMessage(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-xl font-bold text-slate-100 text-center mb-1">Sign In</h2>
      <p className="text-xs text-slate-400 text-center mb-6">Enter credentials to access your workspaces</p>

      {errorMessage && (
        <div className="flex items-center gap-2.5 p-3.5 mb-5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-xs">
          <ShieldAlert size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
            <input 
              {...register('email', { 
                required: 'Email is required',
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
              })}
              type="email" 
              className="w-full pl-10 pr-4 py-3 rounded-xl form-input-premium text-sm text-slate-200 outline-none"
              placeholder="name@company.com"
            />
          </div>
          {errors.email && <span className="text-xs text-rose-400 mt-1 block">{errors.email.message}</span>}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
            <Link to="/forgot-password" className="text-xs text-accentPurple hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
            <input 
              {...register('password', { required: 'Password is required' })}
              type="password" 
              className="w-full pl-10 pr-4 py-3 rounded-xl form-input-premium text-sm text-slate-200 outline-none"
              placeholder="••••••••"
            />
          </div>
          {errors.password && <span className="text-xs text-rose-400 mt-1 block">{errors.password.message}</span>}
        </div>

        {/* Submit */}
        <button 
          disabled={loading}
          type="submit" 
          className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-accentPurple to-accentIndigo text-white font-semibold text-sm hover:opacity-95 flex items-center justify-center gap-2 transition-all glow-btn disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Sign In'}
          {!loading && <ArrowRight size={16} />}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-accentPurple font-semibold hover:underline">Create account</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
