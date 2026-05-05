/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Clock, TrendingUp, Music } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';

export default function StatsContent() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any[]>([]);
  const [totalListened, setTotalListened] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('listening_stats')
        .select('*')
        .eq('user_id', user.id);

      if (data) {
        setStats(data);
        setTotalListened(data.length);
      }
    };

    fetchStats();
  }, [user]);

  // Aggregate stats per day (simplified for demo)
  const chartData = [
    { name: 'Mon', count: stats.filter(s => new Date(s.played_at).getDay() === 1).length },
    { name: 'Tue', count: stats.filter(s => new Date(s.played_at).getDay() === 2).length },
    { name: 'Wed', count: stats.filter(s => new Date(s.played_at).getDay() === 3).length },
    { name: 'Thu', count: stats.filter(s => new Date(s.played_at).getDay() === 4).length },
    { name: 'Fri', count: stats.filter(s => new Date(s.played_at).getDay() === 5).length },
    { name: 'Sat', count: stats.filter(s => new Date(s.played_at).getDay() === 6).length },
    { name: 'Sun', count: stats.filter(s => new Date(s.played_at).getDay() === 0).length },
  ];

  return (
    <div className="space-y-8 pb-10">
      <header>
        <h1 className="text-4xl font-black tracking-tighter text-zinc-900">Stats</h1>
        <p className="text-zinc-400 text-sm font-bold uppercase tracking-[0.2em] mt-1">Real-time Activity</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card flex flex-col items-center justify-center py-6 text-center">
          <div className="p-2 bg-zinc-900 text-white rounded-xl mb-3">
             <Clock size={16} />
          </div>
          <span className="text-2xl font-bold text-zinc-900">{Math.floor(totalListened * 3.5 / 60)}h</span>
          <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Est. Time</span>
        </div>
        <div className="glass-card flex flex-col items-center justify-center py-6 text-center">
          <div className="p-2 bg-zinc-900 text-white rounded-xl mb-3">
             <Music size={16} />
          </div>
          <span className="text-2xl font-bold text-zinc-900">{totalListened}</span>
          <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Tracks Played</span>
        </div>
      </div>

      <section className="glass-card h-64 p-6">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
          <TrendingUp size={12} /> Real Activity Data
        </h2>
        <div className="w-full h-full pb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
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
                dataKey="count" 
                stroke="#18181b" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorCount)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
