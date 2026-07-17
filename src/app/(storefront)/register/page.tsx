"use client";

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { registerUser, verifySignupOTP } from '@/app/login/actions';

export default function RegisterPage() {
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpToken, setOtpToken] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    startTransition(async () => {
      const res = await registerUser({
        firstName,
        lastName,
        email,
        password
      });

      if (res.success) {
        setStep('otp');
      } else {
        setErrorMsg(res.error || 'Registration failed. Please check details and try again.');
      }
    });
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (otpToken.length < 6 || otpToken.length > 8) {
      setErrorMsg('Please enter a valid verification code.');
      return;
    }

    startTransition(async () => {
      const res = await verifySignupOTP(email, otpToken);
      if (res.success) {
        // Redirect to login page on success
        window.location.href = `/login?message=${encodeURIComponent('Email confirmed successfully. Please sign in to your new account.')}`;
      } else {
        setErrorMsg(res.error || 'Invalid confirmation code. Please try again.');
      }
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-5 animate-fade-in-up">
      <div className="max-w-md w-full bg-white p-8 border border-gray-200 shadow-sm rounded-sm">
        
        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 font-inter text-sm rounded">
            {errorMsg}
          </div>
        )}

        {step === 'form' ? (
          <div>
            <div className="text-center mb-8">
              <h1 className="font-poppins text-3xl font-semibold text-black tracking-tight mb-2">Create Account</h1>
              <p className="font-inter text-sm text-gray-500">Join KONGO to elevate your everyday</p>
            </div>
            
            <form className="space-y-5" onSubmit={handleSignupSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block font-inter text-sm font-medium text-black mb-2">First Name</label>
                  <input 
                    id="firstName" 
                    type="text" 
                    required 
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full bg-[#f9f9f9] border border-gray-300 py-3 px-4 font-inter text-sm text-black rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block font-inter text-sm font-medium text-black mb-2">Last Name</label>
                  <input 
                    id="lastName" 
                    type="text" 
                    required 
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full bg-[#f9f9f9] border border-gray-300 py-3 px-4 font-inter text-sm text-black rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block font-inter text-sm font-medium text-black mb-2">Email Address</label>
                <input 
                  id="email" 
                  type="email" 
                  required 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#f9f9f9] border border-gray-300 py-3 px-4 font-inter text-sm text-black rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block font-inter text-sm font-medium text-black mb-2">Password</label>
                <input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#f9f9f9] border border-gray-300 py-3 px-4 font-inter text-sm text-black rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                />
                <p className="mt-2 text-xs text-gray-500 font-inter">Must be at least 8 characters</p>
              </div>
              
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full bg-black text-white py-3.5 rounded font-inter text-sm uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity disabled:bg-gray-400"
                >
                  {isPending ? 'Signing up...' : 'Create Account'}
                </button>
              </div>
            </form>
            
            <div className="mt-8 text-center">
              <p className="font-inter text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-black font-semibold hover:underline underline-offset-4">Sign in</Link>
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <span className="material-symbols-outlined text-5xl text-blue-500 mb-2">mark_email_read</span>
              <h1 className="font-poppins text-3xl font-semibold text-black tracking-tight mb-2">Confirm Email</h1>
              <p className="font-inter text-sm text-gray-500 leading-relaxed px-2">
                We sent a verification code to <span className="font-semibold text-black">{email}</span>. Please enter it below.
              </p>
            </div>
            
            <form className="space-y-6" onSubmit={handleOtpVerify}>
              <div>
                <label htmlFor="otpToken" className="block font-inter text-sm font-medium text-black mb-2 text-center">
                  Verification Code
                </label>
                <input 
                  id="otpToken" 
                  type="text" 
                  required 
                  maxLength={8}
                  placeholder="12345678"
                  value={otpToken}
                  onChange={e => setOtpToken(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-[#f9f9f9] border border-gray-300 py-3 px-4 font-poppins text-xl font-bold tracking-[0.5em] text-center text-black rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                />
              </div>
              
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full bg-black text-white py-3.5 rounded font-inter text-sm uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity disabled:bg-gray-400"
                >
                  {isPending ? 'Verifying...' : 'Confirm & Activate'}
                </button>
              </div>

              <div className="text-center pt-2">
                <button 
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-xs font-inter text-gray-500 hover:text-black hover:underline"
                >
                  ← Edit email or password
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}


export const runtime = 'edge';
