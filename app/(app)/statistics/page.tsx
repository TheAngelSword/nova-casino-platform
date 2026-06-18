'use client';

import { rtpChart } from '@/lib/demo-data';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function StatisticsPage() {
  return (
    <div className="space-y-7">
      <section>
        <div className="nova-label">Simulaciones y comportamiento</div>
        <h1 className="nova-title mt-2">Estadísticas</h1>
        <p className="nova-subtitle">Comparativa de RTP objetivo vs observado, desviación, volatilidad, premios, frecuencia de bonus, jackpots e historial de simulaciones.</p>
      </section>
      <section className="nova-card-pad h-[420px]">
        <h2 className="mb-5 font-display text-lg font-bold">RTP observado vs objetivo</h2>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={rtpChart}>
            <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
            <XAxis dataKey="game" tick={{ fill: '#A7ADC4', fontSize: 11 }} />
            <YAxis tick={{ fill: '#A7ADC4', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#16162A', border: '1px solid rgba(255,255,255,.14)', borderRadius: 12 }} />
            <Legend />
            <Bar dataKey="objetivo" fill="#9B6CF6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="observado" fill="#2DD4DE" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
