import React from 'react';
import { Home, Trophy, CalendarDays, Users } from 'lucide-react';
import { cn } from '../lib/utils';
import { Tab } from '../App';

interface Props {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export default function Navigation({ activeTab, setActiveTab }: Props) {
  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'predict', label: 'Predict', icon: <Trophy className="w-5 h-5" /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarDays className="w-5 h-5" /> },
    { id: 'drivers', label: 'Drivers', icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 bg-[#0B0B0E] border-t border-white/10 pb-safe">
        <ul className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <li key={item.id} className="flex-1">
              <button
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors font-black italic uppercase",
                  activeTab === item.id ? "text-[#0B0B0E] bg-white" : "text-white/50 hover:text-white"
                )}
              >
                {item.icon}
                <span className="text-[10px]">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-20 lg:w-56 bg-[#0B0B0E] border-r border-white/10 py-6 z-40">
        <div className="px-4 lg:px-6 mb-12 flex justify-center lg:justify-start items-center">
          <span className="hidden lg:block font-black italic uppercase text-3xl tracking-tighter">AG</span>
          <span className="lg:hidden font-black italic uppercase text-2xl tracking-tighter">AG</span>
        </div>
        
        <ul className="flex flex-col space-y-3 px-4">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex items-center justify-center lg:justify-start w-full p-3 transition-colors font-black italic uppercase text-sm transform -skew-x-12 cursor-pointer border",
                  activeTab === item.id 
                    ? "bg-white text-black border-transparent" 
                    : "border-white/20 text-white/50 hover:opacity-100 hover:bg-white hover:text-black hover:border-transparent opacity-80"
                )}
              >
                {item.icon}
                <span className="hidden lg:block ml-3 transform skew-x-12">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
