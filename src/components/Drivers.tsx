import React from 'react';
import { Trophy, Medal, MapPin } from 'lucide-react';

export default function Drivers({ drivers }: { drivers: any[] }) {
  // Sort drivers by points descending
  const sortedDrivers = [...drivers].sort((a, b) => b.points - a.points);

  return (
    <div className="max-w-6xl mx-auto p-1 bg-white/10 grid grid-cols-1 md:grid-cols-12 gap-1 border border-white/5">
      <div className="col-span-full bg-[#0B0B0E] border-b border-white/5 p-8">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4 italic underline underline-offset-4">2026 Season</h3>
        <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-2">Driver Standings</h2>
      </div>

      {sortedDrivers.map((driver, index) => (
        <div key={driver.id} className="col-span-1 md:col-span-4 bg-[#0B0B0E] p-6 text-white border border-white/5 relative group hover:bg-white/5 transition-colors">
          <div className="absolute top-2 right-4 text-[80px] font-black italic text-white/[0.03] leading-none pointer-events-none group-hover:text-white/[0.05] transition-colors z-0">
            {driver.number}
          </div>

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
              <span className="text-4xl font-black italic text-white/80">{String(index + 1).padStart(2, '0')}</span>
              <div className="w-16 h-16 border-2 border-[var(--color-primary)] bg-white/5 grayscale group-hover:grayscale-0 transition-all filter contrast-125">
                <img src={driver.image} alt={driver.name} className="w-full h-full object-cover object-top" />
              </div>
            </div>

            <div className="mb-8 flex-grow">
              <span className="text-[10px] font-bold uppercase opacity-50 tracking-widest block mb-1">{driver.team}</span>
              <h3 className="text-3xl font-black italic uppercase leading-none">{driver.name}</h3>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
              <div>
                <p className="text-[10px] font-bold text-white/50 mb-1 uppercase tracking-widest">Pts</p>
                <p className="font-black italic text-2xl">{driver.points}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/50 mb-1 uppercase tracking-widest">Wins</p>
                <p className="font-black italic text-2xl">{driver.wins}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/50 mb-1 uppercase tracking-widest">Pod</p>
                <p className="font-black italic text-2xl">{driver.podiums}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
