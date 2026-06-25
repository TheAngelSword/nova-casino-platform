import Link from 'next/link';
import { Bug, ClipboardCheck, Clock, Eye, Link as LinkIcon, ShieldAlert, UserCheck } from 'lucide-react';
import { getGames } from '@/lib/data';
import { getTestingBugs, getTestingSessions, getTestingSummary, getTestCases } from '@/lib/testing-data';
import { createBugReportAction, createTestingSessionAction } from '@/app/actions-testing';
import { StatCard } from '@/components/ui/StatCard';
import { TestingStatusPill } from '@/components/TestingStatusPill';

export default async function TestingPage() {
  const [summary, games, sessions, bugs, cases] = await Promise.all([
    getTestingSummary(),
    getGames(),
    getTestingSessions(),
    getTestingBugs(),
    getTestCases()
  ]);

  return (
    <div className="space-y-7">
      <section>
        <div className="nova-label">Anexo operativo</div>
        <h1 className="nova-title mt-2">Testing / QA de juegos</h1>
        <p className="nova-subtitle">
          Registro de testers, horarios laborados, alcance revisado, casos de prueba, bugs, evidencias y revisión de responsables.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Casos de prueba" value={summary.totalCases} icon={ClipboardCheck} />
        <StatCard label="Ejecutadas" value={summary.executed} icon={UserCheck} />
        <StatCard label="Aprobadas" value={summary.passed} icon={ClipboardCheck} />
        <StatCard label="Fallidas" value={summary.failed} icon={ShieldAlert} />
        <StatCard label="Bugs abiertos" value={summary.openBugs} icon={Bug} />
        <StatCard label="Sesiones hoy" value={summary.sessionsToday} icon={Clock} />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <div className="nova-card-pad">
          <h2 className="font-display text-lg font-bold">Registrar sesión de tester</h2>
          <form action={createTestingSessionAction} className="mt-4 grid gap-3 md:grid-cols-2">
            <select name="game_id" className="nova-select" required>
              <option value="">Juego</option>
              {games.map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
            <input name="session_date" type="date" className="nova-input" />
            <input name="start_time" type="time" className="nova-input" />
            <input name="end_time" type="time" className="nova-input" />
            <input name="hours_worked" type="number" step="0.25" className="nova-input" placeholder="Horas laboradas" />
            <input name="build_version" className="nova-input" placeholder="Build / versión" />
            <input name="device_environment" className="nova-input md:col-span-2" placeholder="Ambiente: PC, gabinete, navegador, resolución, sistema de caja" />
            <textarea name="test_scope" className="nova-input min-h-[88px] md:col-span-2" placeholder="Qué revisó: flujo, matemática, arte, audio, cashout, recuperación, SAS/AFT..." required />
            <textarea name="notes" className="nova-input min-h-[88px] md:col-span-2" placeholder="Notas generales del tester" />
            <button className="nova-btn-primary md:col-span-2" type="submit">Guardar sesión</button>
          </form>
        </div>

        <div className="nova-card-pad">
          <h2 className="font-display text-lg font-bold">Reportar bug</h2>
          <form action={createBugReportAction} className="mt-4 grid gap-3 md:grid-cols-2">
            <select name="game_id" className="nova-select" required>
              <option value="">Juego</option>
              {games.map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
            <select name="severity" className="nova-select">
              <option value="bloqueante">Bloqueante</option>
              <option value="critica">Crítica</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
            <input name="title" className="nova-input md:col-span-2" placeholder="Título del bug" required />
            <textarea name="description" className="nova-input min-h-[80px] md:col-span-2" placeholder="Descripción del problema" required />
            <textarea name="steps_to_reproduce" className="nova-input min-h-[80px] md:col-span-2" placeholder="Pasos para reproducir" />
            <input name="expected_result" className="nova-input" placeholder="Resultado esperado" />
            <input name="actual_result" className="nova-input" placeholder="Resultado real" />
            <select name="assigned_area" className="nova-select">
              <option>Programación</option>
              <option>Diseño</option>
              <option>Arte</option>
              <option>Audio</option>
              <option>Matemática</option>
              <option>Integración</option>
              <option>Homologación</option>
            </select>
            <input name="assigned_to_name" className="nova-input" placeholder="Responsable" />
            <input name="build_version" className="nova-input" placeholder="Build donde ocurrió" />
            <input name="environment" className="nova-input" placeholder="Ambiente / gabinete / navegador" />
            <input name="image_url" className="nova-input" placeholder="URL de imagen de evidencia" />
            <input name="video_url" className="nova-input" placeholder="URL de video de evidencia" />
            <input name="evidence_url" className="nova-input md:col-span-2" placeholder="Otra liga de evidencia: Drive, Supabase, YouTube privado, log, documento" />
            <button className="nova-btn-primary md:col-span-2" type="submit">Guardar bug y abrir reporte</button>
          </form>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <div className="nova-card-pad overflow-hidden">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold">Bugs recientes</h2>
              <p className="mt-1 text-xs text-nova-text2">Haz clic en un reporte para abrir detalle, evidencias y corrección técnica.</p>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-white/45">
                <tr>
                  <th className="py-3">Bug</th>
                  <th>Juego</th>
                  <th>Severidad</th>
                  <th>Estado</th>
                  <th>Área</th>
                  <th>Responsable</th>
                  <th>Evidencia</th>
                  <th>Reporte</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {bugs.map((b: any) => (
                  <tr key={b.id} className="text-nova-text2 hover:bg-white/[0.025]">
                    <td className="py-3 font-semibold text-white">
                      <Link className="hover:text-cyan-300" href={`/testing/bugs/${b.id}`}>{b.title}</Link>
                    </td>
                    <td>{b.games?.name ?? '—'}</td>
                    <td><TestingStatusPill value={b.severity} /></td>
                    <td><TestingStatusPill value={b.status} /></td>
                    <td>{b.assigned_area ?? '—'}</td>
                    <td>{b.assigned_to_name ?? '—'}</td>
                    <td>{b.evidence_url || b.image_url || b.video_url ? <LinkIcon className="h-4 w-4 text-cyan-300" /> : '—'}</td>
                    <td>
                      <Link href={`/testing/bugs/${b.id}`} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10">
                        <Eye className="h-3.5 w-3.5" /> Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bugs.length === 0 ? <p className="py-8 text-sm text-nova-text2">No hay bugs reportados todavía.</p> : null}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="nova-card-pad">
            <h2 className="font-display text-lg font-bold">Sesiones recientes</h2>
            <div className="mt-4 space-y-3">
              {sessions.map((s: any) => (
                <div key={s.id} className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
                  <div className="text-sm font-semibold text-white">{s.games?.name ?? 'Juego'} · {s.build_version ?? 'Build'}</div>
                  <div className="text-xs text-nova-text2">{s.session_date} · {s.hours_worked ?? 0} h · {s.test_scope}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="nova-card-pad">
            <h2 className="font-display text-lg font-bold">Casos de prueba</h2>
            <div className="mt-4 space-y-3">
              {cases.slice(0, 8).map((c: any) => (
                <div key={c.id} className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
                  <div className="text-sm font-semibold text-white">{c.title}</div>
                  <div className="text-xs text-nova-text2">{c.games?.name ?? 'Juego'} · {c.area} · {c.priority}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
