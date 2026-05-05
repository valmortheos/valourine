import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API to scan music files
  app.get('/api/tracks', (req, res) => {
    const musicDir = path.join(__dirname, 'public', 'music');
    const thumbDir = path.join(__dirname, 'public', 'musicthumb');
    
    const errors: any[] = [];
    const tracks: any[] = [];

    if (!fs.existsSync(musicDir)) {
      errors.push({ type: 'DIR_MISSING', path: '/public/music', message: 'Music directory is missing' });
      return res.json({ tracks: [], errors });
    }

    if (!fs.existsSync(thumbDir)) {
      errors.push({ type: 'DIR_MISSING', path: '/public/musicthumb', message: 'Thumbnail directory is missing' });
    }

    const musicFiles = fs.readdirSync(musicDir).filter(f => /\.(mp3|flac|m4a|opus)$/i.test(f));
    const thumbFiles = fs.existsSync(thumbDir) ? fs.readdirSync(thumbDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f)) : [];

    musicFiles.forEach(file => {
      const name = path.parse(file).name;
      const thumb = thumbFiles.find(tf => path.parse(tf).name === name);
      
      // Parse "Artist - Title" pattern
      const parts = name.split(' - ');
      const artist = parts.length > 1 ? parts[0].trim() : 'Unknown Artist';
      const title = parts.length > 1 ? parts[1].trim() : name.replace(/_/g, ' ');

      if (!thumb) {
        errors.push({ type: 'THUMB_MISSING', file, message: `Audio "${file}" has no matching thumbnail` });
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

    // Check for orphan thumbnails
    thumbFiles.forEach(thumb => {
      const name = path.parse(thumb).name;
      const audio = musicFiles.find(af => path.parse(af).name === name);
      if (!audio) {
        errors.push({ type: 'AUDIO_MISSING', file: thumb, message: `Thumbnail "${thumb}" has no matching audio file` });
      }
    });

    res.json({ tracks, errors, scanTime: new Date().toISOString() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
