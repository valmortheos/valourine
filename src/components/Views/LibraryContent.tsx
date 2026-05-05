/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Plus, ListMusic, Heart, Mic, Disc } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { usePlayerStore } from '../../store/usePlayerStore';

export default function LibraryContent() {
  const { user } = useAuthStore();
  const { queue } = usePlayerStore();
  const [stats, setStats] = useState({
    favorites: 0,
    playlists: 0,
    albums: 0,
    artists: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      const [favs, playlists] = await Promise.all([
        supabase.from('favorites').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('playlists').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);

      // Calculate from local track list (queue)
      const artists = new Set(queue.map(t => t.artist)).size;
      const albums = new Set(queue.map(t => t.album)).size;

      setStats({
        favorites: favs.count || 0,
        playlists: playlists.count || 0,
        albums: albums || 0,
        artists: artists || 0
      });
    };

    fetchStats();
  }, [user, queue]);

  const collections = [
    { name: 'Favorites', icon: Heart, count: stats.favorites, color: 'text-red-500' },
    { name: 'Playlists', icon: ListMusic, count: stats.playlists, color: 'text-blue-500' },
    { name: 'Albums', icon: Disc, count: stats.albums, color: 'text-purple-500' },
    { name: 'Artists', icon: Mic, count: stats.artists, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <header className="flex items-center justify-between">
        <h1 className="text-4xl font-black tracking-tighter text-zinc-900">Library</h1>
        <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-xl active:scale-90 transition-transform">
          <Plus size={24} />
        </button>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {collections.map((col) => (
          <div key={col.name} className="glass-card p-6 flex flex-col items-center text-center group cursor-pointer hover:bg-white/80 transition-all border-white/50">
            <div className={`p-4 bg-zinc-50 rounded-2xl mb-4 group-hover:scale-110 transition-transform ${col.color} shadow-sm shadow-zinc-100`}>
              <col.icon size={28} />
            </div>
            <h3 className="font-black text-zinc-900 text-sm tracking-tight">{col.name}</h3>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-2">{col.count} items</p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 px-1">Recently Added</h2>
        <div className="space-y-4">
           {queue.length > 0 ? (
             queue.slice(0, 3).map((track) => (
                <div key={track.id} className="flex items-center gap-4 glass-card p-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
                    <img src={track.thumbnailUrl} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900 truncate">{track.title}</p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{track.artist}</p>
                  </div>
                </div>
             ))
           ) : (
             <div className="flex items-center justify-center py-10 opacity-30 italic text-sm text-zinc-500">
               No recent music found...
             </div>
           )}
        </div>
      </section>
    </div>
  );
}
