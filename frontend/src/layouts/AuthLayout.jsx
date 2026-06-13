import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#070b13] relative overflow-hidden px-4">
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accentPurple/25 rounded-full filter blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accentIndigo/20 rounded-full filter blur-[100px] pointer-events-none animate-pulse duration-5000"></div>

      <div className="w-full max-w-md p-8 rounded-2xl glass-panel shadow-2xl relative z-10 border border-white/10 bg-slate-900/40 backdrop-blur-md">
        {/* Logo / Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-gradient-to-tr from-accentPurple to-accentIndigo text-white font-bold text-lg shadow-lg">TF</span>
            <span className="text-xl font-bold tracking-tight text-slate-100 bg-clip-text bg-gradient-to-r from-white to-slate-400">TaskFlow AI</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Collaborative Project Workspace</p>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
