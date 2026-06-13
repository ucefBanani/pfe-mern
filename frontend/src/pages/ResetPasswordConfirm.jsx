import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import authService from '../services/authService';
import AuthLayout from '../layouts/AuthLayout';
import { Lock, CheckCircle2, ShieldAlert } from 'lucide-react';

const ResetPasswordConfirm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    if (!token) {
      setError('Verification token is missing from URL.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authService.resetPassword(token, data.password);
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
          <h3 className="text-lg font-bold text-slate-100 mb-2">Password Updated!</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium">
            Your credentials have been successfully updated. You can now login with your new password.
          </p>
          <Link 
            to="/login" 
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-accentPurple to-accentIndigo text-white font-semibold text-sm hover:opacity-95 text-center shadow-lg"
          >
            Sign In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h2 className="text-xl font-bold text-slate-100 text-center mb-1">Set New Password</h2>
      <p className="text-xs text-slate-400 text-center mb-6 font-medium">Please enter your new password below</p>

      {error && (
        <div className="flex items-center gap-2.5 p-3.5 mb-5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-xs">
          <ShieldAlert size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">New Password</label>
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

        <button 
          disabled={loading}
          type="submit" 
          className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-accentPurple to-accentIndigo text-white font-semibold text-sm hover:opacity-95 transition-all glow-btn disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Reset Password'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordConfirm;
