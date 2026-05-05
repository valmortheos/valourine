/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Plus, ListMusic, Heart, Mic, Disc } from 'lucide-react';

export default function LibraryContent() {
  const collections = [
    { name: 'Favorites', icon: Heart, count: 42, color: 'text-red-500' },
    { name: 'Playlists', icon: ListMusic, count: 12, color: 'text-blue-500' },
    { name: 'Albums', icon: Disc, count: 8, color: 'text-purple-500' },
    { name: 'Artists', icon: Mic, count: 15, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Library</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg active:scale-90 transition-transform">
          <Plus size={24} />
        </button>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {collections.map((col) => (
          <div key={col.name} className="glass-card p-6 flex flex-col items-center text-center group cursor-pointer hover:bg-white/50 transition-colors">
            <div className={`p-4 bg-zinc-50 rounded-2xl mb-4 group-hover:scale-110 transition-transform ${col.color}`}>
              <col.icon size={24} />
            </div>
            <h3 className="font-bold text-zinc-900 text-sm tracking-tight">{col.name}</h3>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{col.count} items</p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Recently Added</h2>
        <div className="space-y-4">
           {/* Add placeholders or link to global tracks */}
           <div className="flex items-center opacity-50 italic text-sm text-zinc-500">
             No recent activity...
           </div>
        </div>
      </section>
    </div>
  );
}
