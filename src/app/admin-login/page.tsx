"use client";

import { useState, useTransition } from 'react';
import { adminLogin } from './actions';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    startTransition(async () => {
      const res = await adminLogin({ email, password });
      if (res.success) {
        // Redirect to admin dashboard
        window.location.href = '/admin';
      } else {
        setErrorMsg(res.error || 'Login failed. Please try again.');
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center py-12 px-5 font-inter">
      <div className="max-w-md w-full bg-[#161820] border border-gray-800 p-8 md:p-10 shadow-2xl rounded-lg">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <span className="font-poppins text-3xl font-bold tracking-wider text-white">KONGO</span>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mt-2">Control Panel</p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-800 text-red-400 text-sm rounded-md font-medium">
            {errorMsg}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLoginSubmit}>
          <div>
            <label htmlFor="adminEmail" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Username or Email
            </label>
            <input 
              id="adminEmail"
              type="text" 
              required 
              placeholder="senta"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#1e2230] border border-gray-800 focus:border-white py-3 px-4 text-white text-sm rounded focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="adminPassword" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <input 
              id="adminPassword"
              type="password" 
              required 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#1e2230] border border-gray-800 focus:border-white py-3 px-4 text-white text-sm rounded focus:outline-none transition-colors"
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-white hover:bg-gray-100 text-black py-3.5 rounded font-semibold text-sm uppercase tracking-widest transition-all shadow-md disabled:bg-gray-600 disabled:text-gray-300"
            >
              {isPending ? 'Verifying Admin...' : 'Sign In to Dashboard'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center border-t border-gray-800/80 pt-6">
          <a href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors font-medium">
            ← Back to Storefront
          </a>
        </div>
      </div>
    </div>
  );
}
