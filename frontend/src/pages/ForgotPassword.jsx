import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import AuthLayout from '../layouts/AuthLayout';
import { Mail, CheckCircle2, ShieldAlert, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await authService.forgotPassword(data.email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center text-center p-4">
          <CheckCircle2 size={48} className="text-emerald-400 mb-4 animate-bounce" />
          <h3 className="text-lg font-bold text-slate-100 mb-2">Instructions Sent</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            If this email matches our records, we sent a password reset link. 
            <br />
            <span className="font-semibold text-slate-300 mt-2 block">
              For local testing, check your Node backend console logs to copy the reset link!
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
      <h2 className="text-xl font-bold text-slate-100 text-center mb-1">Reset Password</h2>
      <p className="text-xs text-slate-400 text-center mb-6">Enter email address to retrieve password recovery links</p>

      {error && (
        <div className="flex items-center gap-2.5 p-3.5 mb-5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-xs">
          <ShieldAlert size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

        <button 
          disabled={loading}
          type="submit" 
          className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-accentPurple to-accentIndigo text-white font-semibold text-sm hover:opacity-95 transition-all glow-btn disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Send Recovery Instructions'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 font-semibold transition-all">
          <ArrowLeft size={12} />
          Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
