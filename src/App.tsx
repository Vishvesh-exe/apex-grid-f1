import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flag, Calendar as CalendarIcon, Users, Trophy, LogIn } from 'lucide-react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Predict from './components/Predict';
import Calendar from './components/Calendar';
import Drivers from './components/Drivers';
import { auth } from './lib/firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { fetchPublicData, ensureUserProfile } from './lib/data';

export type Tab = 'home' | 'predict' | 'calendar' | 'drivers';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [user, setUser] = useState<any>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [calendar, setCalendar] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async (uid: string, displayName: string | null) => {
    const pub = await fetchPublicData();
    setDrivers(pub.drivers);
    setCalendar(pub.calendar);
    setNews(pub.news);

    const profile = await ensureUserProfile(uid, displayName);
    setUser(profile);
    setLoading(false);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setLoading(true);
        loadData(fbUser.uid, fbUser.displayName);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const loginAuth = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const forceRefresh = async () => {
    if (auth.currentUser) {
      const pub = await fetchPublicData();
      const profile = await ensureUserProfile(auth.currentUser.uid, auth.currentUser.displayName);
      setUser(profile);
      setDrivers(pub.drivers);
      setCalendar(pub.calendar);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-background)]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Trophy className="text-[var(--color-primary)] w-12 h-12" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-background)] text-white select-none">
        <div className="text-center p-8 border border-white/10 bg-[#0B0B0E] max-w-md w-full">
          <div className="w-16 h-16 bg-[var(--color-primary)] flex items-center justify-center font-black italic uppercase text-3xl mx-auto mb-6">AG</div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none mb-2">Apex Grid</h1>
          <p className="text-[10px] font-bold tracking-widest uppercase text-white/50 mb-8">Sign in to lock predictions and race up the leaderboard</p>
          <button 
            onClick={loginAuth}
            className="w-full bg-white hover:bg-gray-200 text-black font-black italic uppercase py-4 transition-all flex items-center justify-center gap-2 transform -skew-x-12 cursor-pointer"
          >
            <span className="block transform skew-x-12 flex items-center gap-2">
              <LogIn className="w-5 h-5" /> Sign in with Google
            </span>
          </button>
        </div>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard user={user} drivers={drivers} calendar={calendar} news={news} onNavigate={setActiveTab} />;
      case 'predict':
        return <Predict user={user} drivers={drivers} calendar={calendar} refreshData={forceRefresh} />;
      case 'calendar':
        return <Calendar calendar={calendar} />;
      case 'drivers':
        return <Drivers drivers={drivers} />;
      default:
        return <Dashboard user={user} drivers={drivers} calendar={calendar} news={news} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[#F3F3F3] flex flex-col font-sans md:flex-row select-none">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 w-full h-screen overflow-y-auto">
        <header className="flex justify-between items-end px-4 md:px-8 pt-8 pb-4 border-b border-white/10 bg-[#0B0B0E] sticky top-0 z-30">
          <div className="flex flex-col md:pl-20 lg:pl-56">
            <span className="text-[10px] font-bold tracking-[0.3em] text-[var(--color-primary)] uppercase mb-1">Season 2026</span>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none uppercase">Apex Grid</h1>
          </div>
          <div className="flex items-center gap-4 md:gap-8 mb-1">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest">Global Rank</p>
              <p className="text-3xl font-black italic">#412</p>
            </div>
            <div className="h-12 w-12 border-2 border-[var(--color-primary)] flex items-center justify-center bg-white/5 cursor-pointer" onClick={() => auth.signOut()}>
              <span className="text-xl font-black italic">{user?.name ? user.name.substring(0, 2).toUpperCase() : 'AG'}</span>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 md:pl-28 lg:pl-64 max-w-[1400px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderTab()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
