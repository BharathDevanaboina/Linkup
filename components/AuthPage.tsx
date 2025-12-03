
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Zap, Loader2 } from 'lucide-react';

export const AuthPage = () => {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email);
      } else {
        await signup(email, name);
      }
    } catch (err: any) {
      console.error(err);
      setError('Authentication failed');
    } finally {
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
            <h1 className="text-3xl font-black text-white mb-2">{isLogin ? 'Welcome Back' : 'Join the Network'}</h1>
            <p className="text-zinc-500">Enter the real-world action marketplace.</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4 relative z-10">
            {!isLogin && (
                <input 
                    type="text" 
                    placeholder="Display Name" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-violet-600 outline-none transition-colors"
                    required 
                />
            )}
            <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-violet-600 outline-none transition-colors"
                required 
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-violet-600 outline-none transition-colors"
                required 
            />

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

            <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-white text-black font-black text-lg rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center justify-center"
            >
                {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'ENTER NETWORK' : 'CREATE ACCOUNT')}
            </button>
        </form>

        <div className="mt-6 text-center relative z-10">
            <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-zinc-500 hover:text-white text-sm transition-colors"
            >
                {isLogin ? "Don't have an account? Join now" : "Already have an account? Sign in"}
            </button>
        </div>
      </div>
    </div>
  );
};
