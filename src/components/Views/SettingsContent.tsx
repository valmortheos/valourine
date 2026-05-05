/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Download, Upload, Trash2, Info, ChevronRight, LogOut, User } from 'lucide-react';
import { db } from '../../lib/db';
import { useDebugStore } from '../../store/useDebugStore';
import { useAuthStore } from '../../store/useAuthStore';
import { AnimatePresence } from 'motion/react';
import { useState } from 'react';
import ProfileEdit from '../Settings/ProfileEdit';
import JSZip from 'jszip';

export default function SettingsContent() {
  const [showEdit, setShowEdit] = useState(false);
  const { profile, signOut } = useAuthStore();
  
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
        <button 
          onClick={() => setShowEdit(true)}
          className="w-full glass-card flex items-center p-4 active:scale-[0.98] transition-transform"
        >
           <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-white font-black overflow-hidden shadow-xl">
             {profile?.avatar_url ? (
               <img src={profile.avatar_url} className="w-full h-full object-cover" />
             ) : (
               profile?.username?.charAt(0).toUpperCase()
             )}
           </div>
           <div className="ml-4 flex-grow text-left">
             <h3 className="font-bold text-zinc-900 text-base">{profile?.username || 'User'}</h3>
             <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Edit Profile & Avatar</p>
           </div>
           <ChevronRight className="text-zinc-300" size={24} />
        </button>
      </section>

      <section className="space-y-4">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Storage & Cache</h2>
        <div className="space-y-2">
          {/* ... existing storage buttons ... */}
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

      <button 
        onClick={signOut}
        className="w-full h-14 rounded-2xl bg-zinc-100 text-zinc-900 font-bold text-sm flex items-center justify-center gap-2 mt-8 active:scale-95 transition-transform"
      >
        <LogOut size={18} /> Logout
      </button>

      <AnimatePresence>
        {showEdit && <ProfileEdit onClose={() => setShowEdit(false)} />}
      </AnimatePresence>
    </div>
  );
}
