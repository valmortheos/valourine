/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'motion/react';
import { LogIn, UserPlus, Mail, Lock, ShieldCheck } from 'lucide-react';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              full_name: email.split('@')[0]
            }
          }
        });
        if (error) throw error;
        alert('Cek email Anda untuk konfirmasi pendaftaran!');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
      <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-3xl" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-sm liquid-glass rounded-[40px] p-8 shadow-2xl border-white/30"
      >
        <div className="flex flex-col items-center mb-8">
           <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl">
             <ShieldCheck size={32} />
           </div>
           <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Valourine</h1>
           <p className="text-zinc-500 text-sm font-medium">Join the sound revolution.</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-14 pl-12 pr-4 bg-white/50 border border-white/20 rounded-2xl outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all font-medium"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-14 pl-12 pr-4 bg-white/50 border border-white/20 rounded-2xl outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all font-medium"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs font-bold text-center px-4">{error}</p>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                {isLogin ? 'Sign In' : 'Sign Up'}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center px-4">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-zinc-500 text-xs font-bold uppercase tracking-widest hover:text-zinc-900 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
