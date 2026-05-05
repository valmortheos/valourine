/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { Home, Search, Library, BarChart2, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePlayerStore } from './store/usePlayerStore';
import { useDebugStore } from './store/useDebugStore';
import { useAuthStore } from './store/useAuthStore';
import { useAudio } from './hooks/useAudio';
import { supabase } from './lib/supabase';
import { cn } from './lib/utils';

// Components
import MiniPlayer from './components/Player/MiniPlayer';
import FullPlayer from './components/Player/FullPlayer';
import BottomNav from './components/Navigation/BottomNav';
import HomeContent from './components/Views/HomeContent';
import SearchContent from './components/Views/SearchContent';
import LibraryContent from './components/Views/LibraryContent';
import StatsContent from './components/Views/StatsContent';
import SettingsContent from './components/Views/SettingsContent';
import AdminPanel from './components/Admin/AdminPanel';
import AuthScreen from './components/Auth/AuthScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { currentTrack, accentColor, isFullPlayerOpen } = usePlayerStore();
  const { isAdminMode, setLogs, setScanTime } = useDebugStore();
  const { session, setSession, isLoading: authLoading } = useAuthStore();
  
  // Initialize Global Audio
  useAudio();

  // Auth Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  useEffect(() => {
    if (!session) return;
    
    const fetchTracks = async () => {
      try {
        const res = await fetch('/api/tracks');
        const data = await res.json();
        setTracks(data.tracks);
        setLogs(data.errors);
        setScanTime(data.scanTime);
      } catch (err) {
        console.error('Failed to fetch tracks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [session, setLogs, setScanTime]);

  if (authLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  const renderContent = () => {
    if (loading) return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );

    switch (activeTab) {
      case 'home': return <HomeContent tracks={tracks} />;
      case 'search': return <SearchContent />;
      case 'library': return <LibraryContent />;
      case 'stats': return <StatsContent />;
      case 'settings': return <SettingsContent />;
      default: return <HomeContent tracks={tracks} />;
    }
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'library', icon: Library, label: 'Library' },
    { id: 'stats', icon: BarChart2, label: 'Stats' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="relative min-h-screen pb-32">
      {/* Dynamic Background */}
      <div 
        className="dynamic-bg" 
        style={{ 
          background: `radial-gradient(circle at 50% 50%, ${accentColor}33 0%, #ffffff 100%)`,
        }} 
      />
      
      {/* Background blobs for more texture */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div 
          className="absolute -top-1/4 -right-1/4 w-full h-full rounded-full blur-[120px] animate-pulse"
          style={{ backgroundColor: `${accentColor}22` }}
        />
        <div 
          className="absolute -bottom-1/4 -left-1/4 w-full h-full rounded-full blur-[120px]"
          style={{ backgroundColor: `${accentColor}11` }}
        />
      </div>

      {/* Main Content */}
      <main className="px-5 pt-8 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Players */}
      <div className="fixed bottom-24 left-0 right-0 px-4 z-40 max-w-lg mx-auto">
        <MiniPlayer />
      </div>

      <AnimatePresence>
        {isFullPlayerOpen && <FullPlayer />}
      </AnimatePresence>

      <AnimatePresence>
        {isAdminMode && <AdminPanel />}
      </AnimatePresence>

      {/* Navigation */}
      <BottomNav 
        items={navItems} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
    </div>
  );
}

