import type { VercelRequest, VercelResponse } from '@vercel/node';
import path from 'path';
import fs from 'fs';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Gunakan path.resolve untuk keamanan di environment serverless
  const root = process.cwd();
  // Di Vercel, includeFiles akan meletakkan file relatif terhadap function
  // Kita coba deteksi folder music di beberapa lokasi common
  const musicDir = path.resolve(root, 'public/music');
  const thumbDir = path.resolve(root, 'public/musicthumb');
  
  console.log('Vercel Scan Start:', { root, musicDir, thumbDir });

  // Backup detection jika path standar gagal (Vercel specific)
  let finalMusicDir = musicDir;
  let finalThumbDir = thumbDir;

  if (!fs.existsSync(finalMusicDir)) {
    // Coba path relatif jika process.cwd() berbeda
    const altPath = path.resolve(root, '../public/music');
    if (fs.existsSync(altPath)) {
       finalMusicDir = altPath;
       finalThumbDir = path.resolve(root, '../public/musicthumb');
    }
  }

  if (!fs.existsSync(finalMusicDir)) {
    return res.status(200).json({ 
      tracks: [], 
      errors: [{ 
        type: 'DIR_MISSING', 
        path: finalMusicDir, 
        message: 'Data musik tidak ditemukan (403/NotFound Prevention).' 
      }] 
    });
  }

  try {
    const errors: any[] = [];
    const tracks: any[] = [];
    const musicFiles = fs.readdirSync(finalMusicDir).filter(f => /\.(mp3|flac|m4a|opus)$/i.test(f));
    const thumbFiles = fs.existsSync(finalThumbDir) ? fs.readdirSync(finalThumbDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f)) : [];

    musicFiles.forEach(file => {
      const name = path.parse(file).name;
      const thumb = thumbFiles.find(tf => path.parse(tf).name === name);

      const parts = name.split(' - ');
      const artist = parts.length > 1 ? parts[0].trim() : 'Unknown Artist';
      const title = parts.length > 1 ? parts[1].trim() : name.replace(/_/g, ' ');

      if (!thumb) {
        errors.push({ 
          type: 'THUMB_MISSING', 
          file, 
          message: `Audio "${file}" tidak memiliki thumbnail yang cocok.` 
        });
      }

      tracks.push({
        id: name,
        title: title,
        artist: artist,
        album: 'Local',
        audioUrl: `/music/${file}`,
        thumbnailUrl: thumb ? `/musicthumb/${thumb}` : 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&h=500&fit=crop',
        hasThumb: !!thumb
      });
    });

    // Cek thumbnail yatim (tanpa audio)
    thumbFiles.forEach(thumb => {
      const name = path.parse(thumb).name;
      const audio = musicFiles.find(af => path.parse(af).name === name);
      if (!audio) {
        errors.push({ 
          type: 'AUDIO_MISSING', 
          file: thumb, 
          message: `Thumbnail "${thumb}" tidak memiliki file audio yang cocok.` 
        });
      }
    });

    return res.status(200).json({ 
      tracks, 
      errors, 
      scanTime: new Date().toISOString(),
      env: process.env.NODE_ENV
    });
  } catch (err: any) {
    return res.status(500).json({ 
      error: 'Failed to scan directory', 
      message: err.message 
    });
  }
}
