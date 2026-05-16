import React, { useState } from 'react';
import { Flag, ShieldAlert, CheckCircle, ChevronDown, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { savePrediction } from '../lib/data';
import { auth } from '../lib/firebase';

export default function Predict({ user, drivers, calendar, refreshData }: { user: any, drivers: any[], calendar: any[], refreshData: () => void }) {
  const nextRace = calendar.find(r => r.status === 'upcoming');
  const existingPrediction = nextRace ? user.predictions[nextRace.id] : null;

  const [p1, setP1] = useState(existingPrediction?.p1 || '');
  const [p2, setP2] = useState(existingPrediction?.p2 || '');
  const [p3, setP3] = useState(existingPrediction?.p3 || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!nextRace) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400">
        <Flag className="w-12 h-12 mb-4 opacity-50" />
        <h2 className="text-xl font-[var(--font-display)]">No Upcoming Races</h2>
        <p>The season has concluded. Check back later!</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!p1 || !p2 || !p3) return;
    if (new Set([p1, p2, p3]).size !== 3) {
      alert('Drivers must be unique across the podium.');
      return;
    }
    if (!auth.currentUser) return;

    setIsSubmitting(true);
    try {
      const isNew = await savePrediction(auth.currentUser.uid, nextRace.id, { p1, p2, p3 });
      setSuccessMsg(isNew ? "+50 Points for submitting your prediction!" : "Prediction updated successfully.");
      refreshData();
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const positions = [
    { id: 'p1', label: '1st Place', state: p1, setter: setP1, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
    { id: 'p2', label: '2nd Place', state: p2, setter: setP2, color: 'text-gray-300', bg: 'bg-gray-300/10', border: 'border-gray-300/30' },
    { id: 'p3', label: '3rd Place', state: p3, setter: setP3, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 bg-white/5 p-8 border border-white/10">
      <div className="mb-10 text-center border-b border-white/10 pb-8 flex flex-col items-center">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4 italic underline underline-offset-4">Prediction Phase</h3>
        <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none mb-2">Predict the Podium</h2>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Lock in your top 3 for the <span className="text-white">{nextRace.name}</span></p>
      </div>

      {successMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center gap-3 justify-center text-sm font-bold shadow-lg"
        >
          <CheckCircle className="w-5 h-5" /> {successMsg}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {positions.map((pos, idx) => (
            <div key={pos.id} className={cn("bg-[#0B0B0E] border-2 p-6 flex flex-col items-center relative transition-colors group", pos.state ? pos.border : "border-white/10")}>
              
              <div className="flex items-center gap-2 mb-6">
                <span className={cn("font-black italic text-4xl", pos.color)}>{pos.id.toUpperCase()}</span>
              </div>

              <div className="relative w-full">
                <select 
                  value={pos.state}
                  onChange={(e) => pos.setter(e.target.value)}
                  className="w-full appearance-none bg-transparent border border-white/20 text-white p-4 font-black italic uppercase text-lg outline-none focus:border-white transition-all cursor-pointer"
                  required
                >
                  <option value="" disabled className="bg-[#0B0B0E] text-white/50">Select Driver...</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id} disabled={[p1, p2, p3].includes(d.id) && pos.state !== d.id} className="bg-[#0B0B0E] text-white">
                      {d.name} ({d.team})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>

              {pos.state && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 flex flex-col items-center">
                  <div className="w-20 h-20 overflow-hidden border-2 border-white/20 bg-white/5 mb-3">
                    <img src={drivers.find(d => d.id === pos.state)?.image} alt="Driver" className="w-full h-full object-cover object-top filter grayscale contrast-125" />
                  </div>
                  <span className="text-xl font-black italic uppercase text-center">
                    {drivers.find(d => d.id === pos.state)?.name}
                  </span>
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{drivers.find(d => d.id === pos.state)?.team}</span>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <button 
            type="submit" 
            disabled={isSubmitting || !p1 || !p2 || !p3 || (existingPrediction && p1 === existingPrediction.p1 && p2 === existingPrediction.p2 && p3 === existingPrediction.p3)}
            className="bg-[var(--color-primary)] hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed text-white font-black italic uppercase py-5 px-12 transition-all transform -skew-x-12 cursor-pointer"
          >
            <span className="block transform skew-x-12">
              {isSubmitting ? 'Saving...' : existingPrediction ? 'Update Prediction' : 'Lock Prediction'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
