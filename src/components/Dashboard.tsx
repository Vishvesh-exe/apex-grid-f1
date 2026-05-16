import React from 'react';
import { format, parseISO } from 'date-fns';
import { Tab } from '../App';
import { motion } from 'motion/react';

export default function Dashboard({ user, drivers, calendar, news, onNavigate }: { user: any, drivers: any[], calendar: any[], news: any[], onNavigate: (t: Tab) => void }) {
  const nextRace = calendar.find(r => r.status === 'upcoming');
  const pointsInCurrentLevel = user.points % 500;
  const progressPercentage = (pointsInCurrentLevel / 500) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 bg-white/10 p-1">
      
      {/* Profile Section */}
      <section className="col-span-1 lg:col-span-4 bg-[#0B0B0E] p-6 flex flex-col border border-white/5">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-8 italic underline underline-offset-4">Fan Profile</h3>
        
        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <span className="text-4xl font-black italic uppercase">{user.name}</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-3xl font-black italic">LEVEL {user.level}</span>
            <span className="text-xs font-bold opacity-50 mb-1 uppercase">Pro Tier</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 mt-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-[var(--color-primary)]"
            />
          </div>
          <p className="text-[10px] font-medium text-white/40 mt-1 uppercase tracking-tighter">{user.nextRewardAt - user.points} PTS TO NEXT LEVEL</p>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">Active Streak</span>
            <div className="flex items-center gap-2">
              <span className="text-5xl font-black italic text-white">{user.streak}</span>
              <span className="text-xs font-bold leading-tight uppercase">DAYS<br/>FLAMING</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">Total Points</span>
            <div className="flex items-center gap-2">
              <span className="text-5xl font-black italic text-[var(--color-primary)]">{user.points}</span>
              <span className="text-xs font-bold leading-tight uppercase">LIFETIME<br/>PTS</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
           <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">Badges Earned</span>
           {user.badges.map((b: string, i: number) => (
             <div key={i} className="border border-white/20 p-2 font-black italic uppercase text-center text-xs opacity-50">
               {b}
             </div>
           ))}
        </div>
      </section>

      {/* Main Center Action Area */}
      <section className="col-span-1 lg:col-span-5 bg-[#0B0B0E] p-8 flex flex-col border border-white/5">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black italic uppercase leading-none tracking-tight">Live Predictions</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)]">Open</span>
          </div>
        </div>

        {nextRace ? (
          <div className="flex-grow flex flex-col gap-4">
            <div className="group bg-white/5 p-6 border-l-4 border-[var(--color-primary)] relative">
              <span className="absolute top-0 right-4 text-[60px] font-black italic text-white/[0.03] leading-none pointer-events-none">{String(nextRace.round).padStart(2, '0')}</span>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2 italic">Next Grand Prix</h4>
              <p className="text-3xl font-black italic uppercase mb-1">{nextRace.name}</p>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-6 opacity-70 border-b border-white/10 pb-4">{format(parseISO(nextRace.Date), 'MMM d, yyyy')}</p>
              
              {!user.predictions[nextRace.id] ? (
                <div>
                   <p className="text-sm font-bold uppercase mb-4 italic text-[var(--color-primary)]">Predict the Podium</p>
                   <button 
                     onClick={() => onNavigate('predict')}
                     className="w-full bg-[var(--color-primary)] p-4 text-center cursor-pointer transform hover:scale-[1.02] transition-transform flex items-center justify-center font-black italic uppercase text-white"
                   >
                     Make Prediction Object
                   </button>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-3 text-center">Predict correct podium for 150 PTS</p>
                </div>
              ) : (
                <div className="border border-white/20 p-4 text-center bg-white/5">
                   <p className="font-black italic uppercase text-white">Predictions Locked In</p>
                   <p className="text-[10px] font-bold uppercase opacity-50 mt-1">Good luck this weekend</p>
                </div>
              )}
            </div>
            
            {/* Some generic prediction extra stat */}
            <div className="group bg-white/5 p-6 border-l-4 border-white/20">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2 italic">Driver to Watch</h4>
              <p className="text-xl font-bold italic uppercase mb-4">Most overtakes?</p>
              <div className="flex items-center gap-4 border-t border-white/10 pt-4 cursor-pointer hover:opacity-80">
                <div className="flex -space-x-4">
                  <div className="w-10 h-10 rounded-full bg-[#1F1F27] border-2 border-[var(--color-primary)] flex items-center justify-center font-bold text-xs italic">ALO</div>
                  <div className="w-10 h-10 rounded-full bg-[#1F1F27] border-2 border-white/20 flex items-center justify-center font-bold text-xs italic">HAM</div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)]">Overtake King &rarr;</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center text-white/50 font-black italic uppercase">
             No Upcoming Races
          </div>
        )}
      </section>

      {/* Right Column: News / Secondary */}
      <section className="col-span-1 lg:col-span-3 bg-[#0B0B0E] p-6 flex flex-col border border-white/5">
         <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-6 italic underline underline-offset-4">Paddock News</h3>
         
         <div className="flex-grow space-y-6">
           {news.slice(0, 3).map((item, idx) => (
             <div key={idx} className="flex gap-4 group cursor-pointer">
               <span className="text-2xl font-black italic text-white/20 leading-none">0{idx + 1}</span>
               <div className="flex-grow border-b border-white/10 pb-3 group-hover:border-[var(--color-primary)] transition-colors">
                 <p className="text-sm font-black italic uppercase leading-tight mb-1">{item.title}</p>
                 <div className="flex justify-between items-center">
                   <span className="text-[9px] font-bold text-white/50 uppercase">{format(parseISO(item.date), 'dd MMM ha')}</span>
                 </div>
               </div>
             </div>
           ))}
         </div>

         <div className="mt-8">
           <div className="bg-white/5 p-4 border border-white/10">
             <p className="text-[10px] font-black uppercase text-[var(--color-primary)] mb-2 italic">Next Reward</p>
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-white/10 flex items-center justify-center italic font-bold">XP</div>
               <div className="flex-grow">
                 <p className="text-xs font-bold uppercase italic">Circuit Pass</p>
                 <p className="text-[9px] font-bold uppercase opacity-50">Reach Level {user.level + 1}</p>
               </div>
             </div>
           </div>
         </div>
      </section>
    </div>
  );
}
