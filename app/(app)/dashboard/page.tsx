import { Activity, Award, Gamepad2, Gauge, ListChecks, Rocket, ShieldCheck } from 'lucide-react';
import { getDashboardStats, getGames, getTasks } from '@/lib/data';
import { StatCard } from '@/components/ui/StatCard';
import { GameCard } from '@/components/GameCard';
import { ProgressBar } from '@/components/ui/ProgressBar';

export default async function DashboardPage() {
  const [stats, games, tasks] = await Promise.all([getDashboardStats(), getGames(), getTasks()]);
  const areaTotals = ['arte', 'matematica', 'programacion', 'qa', 'homologacion', 'certificacion'].map((area) => {
    const avg = games.length ? Math.round(games.reduce((sum, g) => sum + Number(g.area_progress?.[area] ?? 0), 0) / games.length) : 0;
    return { area, avg };
  });

  return (
    <div className="space-y-7">
      <section>
        <div className="nova-label">Pipeline de producción</div>
        <h1 className="nova-title mt-2">Dashboard general</h1>
        <p className="nova-subtitle">Vista global para controlar el avance de juegos, áreas, tareas, documentos, homologación, certificación, demos y salida a mercado.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total de juegos" value={stats.totalGames} icon={Gamepad2} />
        <StatCard label="Avance promedio" value={`${stats.averageProgress}%`} icon={Gauge} />
        <StatCard label="En desarrollo" value={stats.inDevelopment} icon={Activity} />
        <StatCard label="Homologación" value={stats.inHomologation} icon={ShieldCheck} />
        <StatCard label="Listos mercado" value={stats.marketReady} icon={Rocket} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="nova-card-pad">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Juegos activos</h2>
              <p className="text-sm text-nova-text2">Datos conectables a Supabase/PostgreSQL.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {games.map((game) => <GameCard key={game.id} game={game} />)}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="nova-card-pad">
            <h2 className="font-display text-lg font-bold">Avance por área</h2>
            <div className="mt-5 space-y-4">
              {areaTotals.map((item) => <ProgressBar key={item.area} value={item.avg} label={item.area} />)}
            </div>
          </div>
          <div className="nova-card-pad">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold"><ListChecks size={18} /> Tareas recientes</h2>
            <div className="mt-4 space-y-3">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
                  <div className="text-sm font-semibold text-white">{task.title}</div>
                  <div className="mt-1 text-xs text-nova-text2">{task.area} · {task.priority} · {task.status}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
