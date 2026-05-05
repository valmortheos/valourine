/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { X, AlertCircle, CheckCircle, FileText, Database, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { useDebugStore } from '../../store/useDebugStore';

export default function AdminPanel() {
  const { logs, scanTime, setIsAdminMode } = useDebugStore();
  const [activeTab, setActiveTab] = useState<'logs' | 'info'>('logs');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-4 z-[100] liquid-glass rounded-3xl shadow-2xl flex flex-col overflow-hidden max-w-lg mx-auto"
    >
      <header className="p-6 border-b border-white/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <Activity className="text-zinc-900" size={24} />
           <h2 className="text-lg font-bold text-zinc-900">Admin Debug</h2>
        </div>
        <button 
          onClick={() => setIsAdminMode(false)}
          className="p-2 hover:bg-zinc-100 rounded-xl transition-colors"
        >
          <X size={20} />
        </button>
      </header>

      <div className="flex p-4 gap-2">
        <button 
          onClick={() => setActiveTab('logs')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'logs' ? 'bg-zinc-900 text-white shadow-lg' : 'bg-white/50 text-zinc-400'
          }`}
        >
          Error Logs ({logs.length})
        </button>
        <button 
          onClick={() => setActiveTab('info')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'info' ? 'bg-zinc-900 text-white shadow-lg' : 'bg-white/50 text-zinc-400'
          }`}
        >
          System Info
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        {activeTab === 'logs' ? (
          <>
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center text-zinc-400">
                <CheckCircle size={48} className="mb-4 opacity-20" />
                <p className="font-bold">No issues detected!</p>
                <p className="text-[10px] uppercase tracking-widest mt-1">All files matched perfectly</p>
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="glass-card flex items-start gap-4 p-4 border-l-4 border-red-500">
                  <AlertCircle size={20} className="text-red-500 shrink-0" />
                  <div>
                    <p className="font-bold text-sm text-zinc-900">{log.type}</p>
                    <p className="text-xs text-zinc-600 mt-1">{log.message}</p>
                    <p className="text-[10px] mt-2 font-mono text-zinc-400">{log.file || log.path}</p>
                  </div>
                </div>
              ))
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div className="glass-card p-4">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Last Scan</p>
              <p className="text-sm font-mono text-zinc-900">{scanTime || 'Never'}</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Environment</p>
              <p className="text-sm font-bold text-zinc-900">Development</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">IndexedDB Status</p>
              <p className="text-sm font-bold text-green-600">Online & Ready</p>
            </div>
          </div>
        )}
      </div>

      <footer className="p-4 bg-white/40 border-t border-white/20">
         <button 
           onClick={() => window.location.reload()}
           className="w-full py-3 h-12 bg-zinc-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
         >
           Force Rescan Files
         </button>
      </footer>
    </motion.div>
  );
}
