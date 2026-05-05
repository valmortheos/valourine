/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Clock, TrendingUp, Music } from 'lucide-react';

const DATA = [
  { name: 'Mon', hours: 1.2 },
  { name: 'Tue', hours: 2.1 },
  { name: 'Wed', hours: 1.8 },
  { name: 'Thu', hours: 3.4 },
  { name: 'Fri', hours: 2.5 },
  { name: 'Sat', hours: 4.2 },
  { name: 'Sun', hours: 3.8 },
];

export default function StatsContent() {
  return (
    <div className="space-y-8 pb-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Statistics</h1>
        <p className="text-zinc-500 font-medium">Your listening journey this week.</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card flex flex-col items-center justify-center py-6 text-center">
          <div className="p-2 bg-zinc-900 text-white rounded-xl mb-3">
             <Clock size={16} />
          </div>
          <span className="text-2xl font-bold text-zinc-900">19.5</span>
          <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Hours Listened</span>
        </div>
        <div className="glass-card flex flex-col items-center justify-center py-6 text-center">
          <div className="p-2 bg-zinc-900 text-white rounded-xl mb-3">
             <Music size={16} />
          </div>
          <span className="text-2xl font-bold text-zinc-900">142</span>
          <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Tracks Played</span>
        </div>
      </div>

      <section className="glass-card h-64 p-6">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
          <TrendingUp size={12} /> Listening Activity
        </h2>
        <div className="w-full h-full pb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DATA}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18181b" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 600, fill: '#a1a1aa' }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase' }}
              />
              <Area 
                type="monotone" 
                dataKey="hours" 
                stroke="#18181b" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorHours)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
