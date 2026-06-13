import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import authService from '../services/authService';
import AuthLayout from '../layouts/AuthLayout';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Missing email verification token.');
        return;
      }

      try {
        await authService.verifyEmail(token);
        setStatus('success');
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.error || 'Verification link expired or invalid.');
      }
    };
    verify();
  }, [token]);

  return (
    <AuthLayout>
      <div className="flex flex-col items-center text-center p-4">
        {status === 'verifying' && (
          <>
            <Loader2 size={40} className="text-accentPurple animate-spin mb-4" />
            <h3 className="text-lg font-bold text-slate-100 mb-2">Verifying Email</h3>
            <p className="text-xs text-slate-400">Please wait while we activate your account...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 size={48} className="text-emerald-400 mb-4 animate-bounce" />
            <h3 className="text-lg font-bold text-slate-100 mb-2">Email Verified!</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Your account has been successfully verified. You can now login.
            </p>
            <Link 
              to="/login" 
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-accentPurple to-accentIndigo text-white font-semibold text-sm hover:opacity-95 text-center shadow-lg"
            >
              Sign In
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle size={48} className="text-rose-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-100 mb-2">Verification Failed</h3>
            <p className="text-xs text-rose-400/80 leading-relaxed mb-6">{message}</p>
            <Link 
              to="/login" 
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 font-semibold text-sm border border-white/5 hover:bg-slate-700 transition-all text-center"
            >
              Back to Sign In
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
