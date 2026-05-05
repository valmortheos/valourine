/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { type Track } from './types';

export const MOCK_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Nights',
    artist: 'Synthwave Queen',
    album: 'Cybercity',
    thumbnailUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&h=500&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372
  },
  {
    id: '2',
    title: 'Deep Sea Dreams',
    artist: 'Oceanic',
    album: 'Abyss',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&h=500&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 432
  },
  {
    id: '3',
    title: 'Mountain Echo',
    artist: 'Alpine Trails',
    album: 'Summit',
    thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&h=500&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 312
  },
  {
    id: '4',
    title: 'Urban Jungle',
    artist: 'Concrete Jungle',
    album: 'Metropolis',
    thumbnailUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=500&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 256
  }
];

export const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
