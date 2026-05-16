import React from 'react';
import { MapPin, Calendar as CalendarIcon, CheckCircle2, Circle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '../lib/utils';

export default function Calendar({ calendar }: { calendar: any[] }) {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-1 bg-white/10 p-1">
      <div className="bg-[#0B0B0E] p-8 border border-white/5 mb-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4 italic underline underline-offset-4">Season Calendar</h3>
        <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none mb-2">Race Schedule</h2>
      </div>

      <div className="flex flex-col gap-1">
        {calendar.map((race, idx) => (
          <div key={race.id} className="relative flex flex-col md:flex-row md:items-center bg-[#0B0B0E] p-6 border border-white/5 group hover:bg-white/5 transition-colors">
            
            <div className="flex items-center gap-6 md:w-48 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 mb-4 md:mb-0 md:mr-8 pr-4">
              <span className="text-5xl font-black italic text-[var(--color-primary)] opacity-50">{String(race.round).padStart(2, '0')}</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-50 mb-1">{format(parseISO(race.Date), 'MMM')}</span>
                <span className="text-4xl font-black italic">{format(parseISO(race.Date), 'dd')}</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <h3 className="text-3xl font-black italic uppercase mb-2 group-hover:text-[var(--color-primary)] transition-colors tracking-tight">{race.name}</h3>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50">
                <MapPin className="w-3 h-3" />
                <span>{race.circuit}</span>
              </div>
            </div>

            <div className="mt-6 md:mt-0 md:w-40 flex justify-end">
              <span className={cn(
                "px-4 py-3 font-black italic uppercase text-xs transform -skew-x-12 border",
                race.status === 'completed' ? "border-white/10 text-white/30" :
                race.status === 'upcoming' ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" :
                "border-white/20 text-white/50"
              )}>
                <span className="block transform skew-x-12">
                  {race.status === 'completed' ? 'Completed' : race.status === 'upcoming' ? 'Up Next' : 'TBA'}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
