import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import { User, Mail, Lock, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const { register: signup } = useAuth();
  const [errorMessage, setErrorMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await signup(data.name, data.email, data.password);
      setSuccess(true);
    } catch (err) {
      setErrorMessage(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center text-center p-4">
          <CheckCircle2 size={48} className="text-emerald-400 mb-4 animate-bounce" />
          <h3 className="text-lg font-bold text-slate-100 mb-2">Registration Successful</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            We have sent a verification link to your email address. 
            <br />
            <span className="font-semibold text-slate-300 mt-2 block">
              For local testing, check your Node backend console logs to copy the activation link!
            </span>
          </p>
          <Link 
            to="/login" 
            className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 font-semibold text-sm border border-white/5 hover:bg-slate-700 transition-all text-center"
          >
            Back to Sign In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h2 className="text-xl font-bold text-slate-100 text-center mb-1">Create Account</h2>
      <p className="text-xs text-slate-400 text-center mb-6 font-medium">Join TaskFlow AI to collaborate with your team</p>

      {errorMessage && (
        <div className="flex items-center gap-2.5 p-3.5 mb-5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-xs">
          <ShieldAlert size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
            <input 
              {...register('name', { required: 'Name is required' })}
              type="text" 
              className="w-full pl-10 pr-4 py-3 rounded-xl form-input-premium text-sm text-slate-200 outline-none"
              placeholder="Alex Johnson"
            />
          </div>
          {errors.name && <span className="text-xs text-rose-400 mt-1 block">{errors.name.message}</span>}
        </div>

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
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
            <input 
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
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
          className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-accentPurple to-accentIndigo text-white font-semibold text-sm hover:opacity-95 flex items-center justify-center gap-2 transition-all glow-btn disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Create Account'}
          {!loading && <ArrowRight size={16} />}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-accentPurple font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
