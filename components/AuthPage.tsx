
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Zap, Loader2, Mail } from 'lucide-react';

export const AuthPage = () => {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      // AuthContext will auto-redirect due to user state change
    } catch (err: any) {
      console.error(err);
      setError('Google Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-600/20 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-800 rounded-2xl mb-4 border border-zinc-700">
                <Zap className="w-8 h-8 text-violet-500" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Welcome</h1>
            <p className="text-zinc-500">Enter the real-world action marketplace.</p>
        </div>

        <div className="space-y-4 relative z-10">
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

            <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-4 bg-white text-black font-black text-lg rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center justify-center gap-3"
            >
                {loading ? <Loader2 className="animate-spin" /> : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                  </>
                )}
            </button>
            
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-zinc-800"></div>
                <span className="flex-shrink mx-4 text-zinc-600 text-xs">OR CONTINUE WITH EMAIL (Coming Soon)</span>
                <div className="flex-grow border-t border-zinc-800"></div>
            </div>

            <button 
                disabled={true}
                className="w-full py-4 bg-zinc-900 text-zinc-500 font-bold text-lg rounded-xl border border-zinc-800 cursor-not-allowed flex items-center justify-center gap-2"
            >
                <Mail className="w-5 h-5" /> Sign in with Email
            </button>
        </div>
      </div>
    </div>
  );
};
