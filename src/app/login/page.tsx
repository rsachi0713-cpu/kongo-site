import Link from 'next/link';
import { login, signInWithProvider } from './actions';

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string; message?: string; next?: string }> }) {
  const params = await searchParams;
  
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-8 px-4 animate-fade-in-up">
      <div className="max-w-md w-full bg-white p-6 md:p-8 border border-gray-200 shadow-sm rounded-sm">
        <div className="text-center mb-8">
          <h1 className="font-poppins text-3xl font-semibold text-black tracking-tight mb-2">Welcome Back</h1>
          <p className="font-inter text-sm text-gray-500">Sign in to your KONGO account</p>
        </div>
        
        {params?.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 font-inter text-sm rounded">
            {params.error}
          </div>
        )}

        {params?.message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 font-inter text-sm rounded">
            {params.message}
          </div>
        )}

        <form className="space-y-6" action={login}>
          <input type="hidden" name="next" value={params?.next || ''} />
          <div>
            <label htmlFor="email" className="block font-inter text-sm font-medium text-black mb-2">Email Address</label>
            <input 
              id="email"
              name="email"
              type="email" 
              required 
              className="w-full bg-[#f9f9f9] border border-gray-300 py-3 px-4 font-inter text-sm text-black rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block font-inter text-sm font-medium text-black">Password</label>
              <a href="#" className="font-inter text-xs text-gray-500 hover:text-black transition-colors underline underline-offset-2">Forgot Password?</a>
            </div>
            <input 
              id="password" 
              name="password"
              type="password" 
              required 
              className="w-full bg-[#f9f9f9] border border-gray-300 py-3 px-4 font-inter text-sm text-black rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
            />
          </div>
          
          <button type="submit" className="w-full bg-black text-white py-3.5 rounded font-inter text-sm uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity">
            Sign In
          </button>
        </form>

        <div className="relative mt-6 mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-400 font-inter">Or continue with</span>
          </div>
        </div>

        <form action={signInWithProvider}>
          <input type="hidden" name="provider" value="google" />
          <input type="hidden" name="next" value={params?.next || ''} />
          <button type="submit" className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 py-3 rounded font-inter text-sm hover:bg-gray-50 transition-colors shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="font-inter text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-black font-semibold hover:underline underline-offset-4">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}



