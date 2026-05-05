/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Camera, Mail, User, Lock, Save, Trash2, X, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';

interface ProfileEditProps {
  onClose: () => void;
}

export default function ProfileEdit({ onClose }: ProfileEditProps) {
  const { profile, session, fetchProfile } = useAuthStore();
  const [username, setUsername] = useState(profile?.username || '');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('profiles').update({
        username,
        updated_at: new Date().toISOString()
      }).eq('id', session?.user.id);

      if (error) throw error;
      await fetchProfile();
      alert('Profil diperbarui!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (event: any) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) throw new Error('Pilih file!');

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${session?.user.id}/${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

      await supabase.from('profiles').update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString()
      }).eq('id', session?.user.id);

      await fetchProfile();
      alert('Foto profil diperbarui!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 z-[110] bg-white pt-8 px-6"
    >
      <header className="flex items-center gap-4 mb-8">
        <button onClick={onClose} className="p-2 -ml-2">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-black">Edit Profile</h2>
      </header>

      <div className="max-w-md mx-auto space-y-8 pb-10">
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[40px] overflow-hidden bg-zinc-100 border-4 border-white shadow-2xl relative">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-white text-3xl font-black">
                  {profile?.username?.charAt(0).toUpperCase()}
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                   <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-3 bg-zinc-900 text-white rounded-2xl shadow-xl active:scale-90 transition-transform"
            >
              <Camera size={20} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={uploadAvatar} 
              className="hidden" 
              accept="image/*" 
            />
          </div>
          <p className="mt-4 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">User Profile Picture</p>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
               <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-4">Username</label>
               <div className="relative">
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                 <input 
                   type="text"
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}
                   className="w-full h-14 pl-12 pr-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all font-bold"
                 />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-4">Email Address</label>
               <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                 <input 
                   type="email"
                   value={email}
                   disabled
                   className="w-full h-14 pl-12 pr-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none opacity-50 font-bold"
                 />
               </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all disabled:opacity-50"
          >
            <Save size={20} />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        <div className="pt-4 space-y-3">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center px-4">
            Keamanan Lanjut
          </p>
          <button 
            onClick={() => alert("Fitur ganti password via email reset akan segera hadir!")}
            className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
          >
            <Lock size={18} /> Request Password Reset
          </button>
        </div>
      </div>
    </motion.div>
  );
}
