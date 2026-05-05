/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Download, Upload, Trash2, Info, ChevronRight, LogOut } from 'lucide-react';
import { db } from '../../lib/db';
import { useDebugStore } from '../../store/useDebugStore';
import JSZip from 'jszip';

export default function SettingsContent() {
  const handleExportCache = async () => {
    try {
      const zip = new JSZip();
      const tracks = await db.cachedAudio.toArray();
      
      tracks.forEach(track => {
        zip.file(`${track.id}.mp3`, track.blob);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'valourine_cache.zip';
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleClearCache = async () => {
    if (confirm('Are you sure you want to clear all cached music?')) {
      await db.cachedAudio.clear();
      alert('Cache cleared!');
    }
  };

  const { incrementVersionClicks, versionClicks, resetVersionClicks, setIsAdminMode } = useDebugStore();

  const handleVersionClick = () => {
    incrementVersionClicks();
    if (versionClicks + 1 >= 5) {
      const code = prompt('Enter Admin Passcode:');
      if (code === '7777') {
        setIsAdminMode(true);
      }
      resetVersionClicks();
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Settings</h1>
      </header>

      <section className="space-y-4">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Account</h2>
        <div className="glass-card flex items-center p-4">
           <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-white font-bold text-lg">
             JD
           </div>
           <div className="ml-4 flex-grow">
             <h3 className="font-bold text-zinc-900 text-sm">John Doe</h3>
             <p className="text-zinc-500 text-xs">Premium Member</p>
           </div>
           <button className="text-zinc-400"><ChevronRight size={20} /></button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Storage & Cache</h2>
        <div className="space-y-2">
          <button 
            onClick={handleExportCache}
            className="w-full glass-card flex items-center p-4 group"
          >
             <div className="p-2 bg-zinc-100 rounded-lg group-hover:bg-zinc-200 transition-colors">
               <Download size={18} className="text-zinc-900" />
             </div>
             <span className="ml-4 font-semibold text-zinc-900 text-sm">Export Cache (.zip)</span>
          </button>
          
          <button className="w-full glass-card flex items-center p-4 group">
             <div className="p-2 bg-zinc-100 rounded-lg group-hover:bg-zinc-200 transition-colors">
               <Upload size={18} className="text-zinc-900" />
             </div>
             <span className="ml-4 font-semibold text-zinc-900 text-sm">Import Cache</span>
          </button>

          <button 
            onClick={handleClearCache}
            className="w-full glass-card flex items-center p-4 group text-red-500"
          >
             <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
               <Trash2 size={18} />
             </div>
             <span className="ml-4 font-semibold text-sm">Clear Local Cache</span>
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">About</h2>
        <div className="space-y-2">
           <div 
             onClick={handleVersionClick}
             className="glass-card flex items-center p-4 active:scale-95 transition-transform"
           >
             <Info size={18} className="text-zinc-400" />
             <div className="ml-4">
               <p className="font-semibold text-zinc-900 text-sm">Version 1.0.0</p>
               <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Project Valourine</p>
             </div>
           </div>
        </div>
      </section>

      <button className="w-full h-14 rounded-2xl bg-zinc-100 text-zinc-900 font-bold text-sm flex items-center justify-center gap-2 mt-8">
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
}
