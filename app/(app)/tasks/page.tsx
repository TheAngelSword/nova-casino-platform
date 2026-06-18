import { createTaskAction } from '@/app/actions';
import { TASK_COLUMNS, AREAS } from '@/lib/constants';
import { getGames, getTasks } from '@/lib/data';

export default async function TasksPage() {
  const [tasks, games] = await Promise.all([getTasks(), getGames()]);
  return (
    <div className="space-y-7">
      <section>
        <div className="nova-label">Roadmap / Kanban</div>
        <h1 className="nova-title mt-2">Tareas de producción</h1>
        <p className="nova-subtitle">Controla entregables por juego, área, responsable, prioridad, fechas, comentarios y archivos relacionados.</p>
      </section>

      <section className="nova-card-pad">
        <h2 className="font-display text-lg font-bold">Crear tarea</h2>
        <form action={createTaskAction} className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-7">
          <input name="title" className="nova-input" placeholder="Nombre de tarea" required />
          <select name="game_id" className="nova-select"><option value="">General</option>{games.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}</select>
          <select name="area" className="nova-select">{AREAS.map((a) => <option key={a}>{a}</option>)}</select>
          <input name="owner_name" className="nova-input" placeholder="Responsable" />
          <select name="priority" className="nova-select"><option>Alta</option><option>Media</option><option>Baja</option></select>
          <input name="due_date" type="date" className="nova-input" />
          <button className="nova-btn-primary">Guardar</button>
        </form>
      </section>

      <section className="grid auto-cols-[280px] grid-flow-col gap-4 overflow-x-auto pb-3">
        {TASK_COLUMNS.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column.key);
          return (
            <div key={column.key} className="nova-card p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-sm font-bold uppercase tracking-wider">{column.label}</h2>
                <span className="rounded-lg bg-white/8 px-2 py-1 font-mono text-xs text-nova-text2">{columnTasks.length}</span>
              </div>
              <div className="space-y-3">
                {columnTasks.map((task) => (
                  <article key={task.id} className="rounded-2xl border border-white/10 bg-nova-surface/80 p-4">
                    <h3 className="text-sm font-semibold text-white">{task.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-nova-text2">{task.description || task.game_name || 'Sin descripción'}</p>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <span className="rounded-lg border border-white/10 px-2 py-1 font-display text-[10px] uppercase text-white/60">{task.area}</span>
                      <span className="text-xs text-nova-text2">{task.priority}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
