/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search as SearchIcon } from 'lucide-react';

export default function SearchContent() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl font-black tracking-tighter text-zinc-900">Search</h1>
      </header>

      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-300 group-focus-within:text-zinc-900 transition-colors">
          <SearchIcon size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Artists, songs, or podcasts"
          className="w-full h-15 pl-12 pr-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-zinc-900/5 transition-all text-sm font-bold placeholder:text-zinc-300"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {['Electronic', 'Jazz', 'Pop', 'Indie', 'Lo-Fi', 'Rock'].map((genre) => (
          <div key={genre} className="aspect-[16/10] rounded-2xl bg-zinc-50 border border-zinc-100 flex items-end p-4 group cursor-pointer hover:bg-zinc-900 transition-all shadow-sm shadow-zinc-100">
             <span className="text-zinc-900 font-bold text-xs uppercase tracking-widest group-hover:text-white transition-colors">
               {genre}
             </span>
          </div>
        ))}
      </div>
    </div>
  );
}
