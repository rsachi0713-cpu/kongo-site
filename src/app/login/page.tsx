import Link from 'next/link';
import { login } from './actions';

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



