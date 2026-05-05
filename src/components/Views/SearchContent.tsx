/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search as SearchIcon } from 'lucide-react';

export default function SearchContent() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Search</h1>
      </header>

      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <SearchIcon className="text-zinc-400" size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Artists, songs, or podcasts"
          className="w-full h-14 pl-12 pr-4 bg-white/50 border border-zinc-200 rounded-2xl outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all text-sm font-medium"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {['Electronic', 'Jazz', 'Pop', 'Indie', 'Lo-Fi', 'Rock'].map((genre) => (
          <div key={genre} className="aspect-[16/9] rounded-2xl bg-zinc-900 relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-transparent opacity-60" />
            <span className="absolute bottom-3 left-4 text-white font-bold text-sm tracking-wide">{genre}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
