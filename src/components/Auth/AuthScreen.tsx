/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
    <div className="fixed inset-0 z-[100] flex flex-col bg-white">
      <div className="flex-grow flex flex-col items-center justify-center p-8 max-w-sm mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex flex-col items-center"
        >
          <div className="mb-12 flex flex-col items-center">
             <div className="w-20 h-20 bg-zinc-900 rounded-[32px] flex items-center justify-center text-white mb-6 shadow-2xl shadow-zinc-200">
               <ShieldCheck size={40} />
             </div>
             <h1 className="text-3xl font-black text-zinc-900 tracking-tighter">Valourine</h1>
             <p className="text-zinc-400 text-sm font-medium tracking-wide mt-1">Experience sound in liquid glass.</p>
          </div>

          <form onSubmit={handleAuth} className="w-full space-y-4">
            <div className="space-y-3">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-600 transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-14 pl-12 pr-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-zinc-900/5 transition-all text-sm font-bold"
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-600 transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-14 pl-12 pr-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-zinc-900/5 transition-all text-sm font-bold"
                />
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center py-2"
              >
                {error}
              </motion.p>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-zinc-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all disabled:opacity-50 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-[3px] border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </form>

          <footer className="mt-12">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-zinc-400 text-[11px] font-black uppercase tracking-[0.2em] hover:text-zinc-900 transition-colors"
            >
              {isLogin ? "Need an account?" : "Have an account?"} 
              <span className="text-zinc-900 ml-2">Switch here</span>
            </button>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
