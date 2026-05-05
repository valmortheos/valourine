# Valourine - Modern Music Streaming Web App

Valourine is a high-performance music streaming application built with a Mobile-First approach and a sleek **Liquid Glass** aesthetic.

## 🚀 Fitur Utama
- **Liquid Glass Design**: Antarmuka transparan dengan efek backdrop-blur dan saturasi tinggi (iOS style).
- **Dynamic Backgrounds**: Warna latar belakang yang berubah secara halus mengikuti thumbnail lagu yang sedang diputar.
- **Offline Caching**: Menggunakan IndexedDB (Dexie) untuk menyimpan file audio secara lokal setelah diputar pertama kali.
- **Mobile-First Experience**: Navigasi bawah yang ergonomis dan performa tinggi di perangkat mobile.
- **Dashboard Statistik**: Grafik mingguan untuk memantau aktivitas mendengarkan musik menggunakan Recharts.
- **Cache Management**: Fitur untuk mengekspor (Zip) dan menghapus cache lokal.
- **MediaSession API**: Sinkronisasi kontrol musik dengan Lockscreen dan Control Center sistem (Play, Pause, Skip, Artwork).

## 🛠 Tech Stack
- **Frontend**: React (Vite) + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Database/Auth**: Supabase (Placeholder integrated)
- **Client Storage**: IndexedDB (Dexie)
- **Animations**: Framer Motion
- **Color Extraction**: Fast Average Color
- **Charts**: Recharts

## 📦 Instalasi & Pengembangan
1. Install dependencies: `npm install`
2. Jalankan server development: `npm run dev`
3. Build untuk produksi: `npm run build`

## 🧩 Sistem Caching
Aplikasi ini menggunakan logic lazy-loading:
1. Metadata dimuat di awal.
2. File audio diunduh hanya saat pengguna menekan 'Play'.
3. Setelah diunduh, file disimpan sebagai Blob di IndexedDB untuk akses offline di masa mendatang.

---
*Created with ❤️ for Valourine Project.*
