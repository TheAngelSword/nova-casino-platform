import { notFound } from 'next/navigation';
import { updateGameAreaProgressAction, updateGameSummaryAction } from '@/app/actions-game-detail';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { STAGES } from '@/lib/constants';
import { getGameBySlug } from '@/lib/data';
import { Calculator, FileText, Headphones, ImageIcon, ListChecks, Rocket, ShieldCheck, Wrench } from 'lucide-react';

const sections = [
  { title: 'Creativo', icon: FileText, body: 'Concepto narrativo, ambientación, moodboard, paleta de colores, personajes, escenario, experiencia esperada y diferenciador creativo.' },
  { title: 'Arte y diseño', icon: ImageIcon, body: 'Logo, pantalla principal, fondos, personajes, símbolos, botones, UI, animaciones, jackpot, versiones y aprobación de assets.' },
  { title: 'Música y sonido', icon: Headphones, body: 'Música principal, bonus, free games, jackpot, sonidos de botón, giro, premio, error, alerta y voces especiales.' },
  { title: 'Matemática', icon: Calculator, body: 'RTP objetivo/observado, volatilidad, hit frequency, ciclo, apuestas, denominaciones, tabla de pagos, simulaciones y reportes.' },
  { title: 'Programación', icon: Wrench, body: 'Build actual, motor, repositorio, módulos terminados/pendientes, bugs, changelog, SAS/AFT, logs, demo y build descargable.' },
  { title: 'QA y pruebas', icon: ListChecks, body: 'Pruebas funcionales, matemáticas, rendimiento, apagado inesperado, recuperación, cashout, puerta abierta, sesión y evidencias.' },
  { title: 'Homologación / certificación', icon: ShieldCheck, body: 'Checklist, requisitos, hallazgos, correcciones, documentos enviados, laboratorio, observaciones, fechas y certificados.' },
  { title: 'Mercado y demos', icon: Rocket, body: 'Cliente objetivo, casino objetivo, versión lista, manuales, material promocional, demo pública/privada y métricas post instalación.' }
];

const areaLabels: Record<string, string> = {
  qa: 'QA',
  arte: 'Arte',
  matematica: 'Matemática',
  programacion: 'Programación',
  homologacion: 'Homologación',
  certificacion: 'Certificación'
};

const areaOrder = ['qa', 'arte', 'matematica', 'programacion', 'homologacion', 'certificacion'];

function gameAsset(slug: string, file: string) {
  return `/assets/games/${slug}/${file}`;
}

export default async function GameDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ error?: string }>;
}) {
  const { slug } = await params;
  const query = searchParams ? await searchParams : {};
  const game = await getGameBySlug(slug);
  if (!game) notFound();

  const bannerUrl = gameAsset(game.slug, 'banner_wide.webp');
  const logoUrl = gameAsset(game.slug, 'logo_horizontal.png');
  const areaProgress = (game.area_progress ?? {}) as Record<string, number>;

  return (
    <div className="space-y-7">
      {query.error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          No se pudo guardar el cambio: {decodeURIComponent(query.error)}
        </div>
      ) : null}

      <section
        className="nova-card overflow-hidden relative min-h-[360px] bg-cover bg-center p-6 md:p-8"
        style={{ backgroundImage: `linear-gradient(90deg, rgba(7,7,15,.94), rgba(7,7,15,.72), rgba(7,7,15,.95)), url('${bannerUrl}')` }}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-nova-violet via-nova-blue to-nova-cyan" />
        <div className="grid gap-7 xl:grid-cols-[1.2fr_.8fr]">
          <div>
            <div className="mb-5 flex min-h-[96px] items-center">
              <div
                className="min-h-[88px] w-full max-w-[420px] bg-contain bg-left bg-no-repeat"
                style={{ backgroundImage: `url('${logoUrl}')` }}
                aria-label={`Logo ${game.name}`}
              />
            </div>
            <div className="nova-label">Ficha individual editable</div>
            <h1 className="mt-2 font-display text-3xl font-bold">{game.name}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-nova-text2">{game.description}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <Info label="Tipo" value={game.game_type} />
              <Info label="Tema visual" value={game.theme} />
              <Info label="Complejidad" value={game.complexity} />
              <Info label="Responsable" value={game.owner_name} />
              <Info label="Prioridad" value={game.priority} />
              <Info label="Entrega" value={game.estimated_delivery} />
            </div>
          </div>
          <div className="space-y-4">
            <ProgressBar value={game.progress} label="Avance general" />
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-sm">
              <div className="nova-label">Riesgos principales</div>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-nova-text2">
                {(game.risks ?? []).length ? (game.risks ?? []).map((risk) => <li key={risk}>{risk}</li>) : <li>Sin riesgos registrados.</li>}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-sm">
              <div className="nova-label">Próximos pasos</div>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-nova-text2">
                {(game.next_steps ?? []).length ? (game.next_steps ?? []).map((step) => <li key={step}>{step}</li>) : <li>Sin próximos pasos registrados.</li>}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="nova-card-pad">
        <h2 className="font-display text-lg font-bold">Editar resumen del juego</h2>
        <p className="mt-2 text-sm text-nova-text2">
          Este formulario actualiza el resumen general. El porcentaje de aquí es el avance general del juego.
          Para cambiar Programación, Arte, QA u otra área, usa el formulario de avance por área.
        </p>
        <form action={updateGameSummaryAction.bind(null, game.id)} className="mt-4 grid gap-3 md:grid-cols-4">
          <input name="name" defaultValue={game.name} className="nova-input" placeholder="Nombre" />
          <input name="slug" defaultValue={game.slug} className="nova-input" placeholder="slug-del-juego" />
          <select name="stage" defaultValue={game.stage} className="nova-select">
            {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
          <input name="progress" type="number" min="0" max="100" defaultValue={game.progress} className="nova-input" placeholder="Avance general %" />
          <input name="game_type" defaultValue={game.game_type ?? ''} className="nova-input" placeholder="Tipo" />
          <input name="theme" defaultValue={game.theme ?? ''} className="nova-input" placeholder="Tema" />
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-nova-text2 md:col-span-1">
            Responsable: {game.owner_name || '—'}
          </div>
          <button className="nova-btn-primary">Guardar resumen</button>
        </form>
      </section>

      <section className="nova-card-pad">
        <h2 className="font-display text-lg font-bold">Editar avance por área</h2>
        <p className="mt-2 text-sm text-nova-text2">
          Estos porcentajes actualizan las barras de QA, Arte, Matemática, Programación, Homologación y Certificación.
          Al guardar, el avance general se recalcula automáticamente como promedio.
        </p>
        <form action={updateGameAreaProgressAction.bind(null, game.id)} className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {areaOrder.map((area) => (
            <label key={area} className="block">
              <span className="nova-label">{areaLabels[area]}</span>
              <input
                name={area}
                type="number"
                min="0"
                max="100"
                defaultValue={Number(areaProgress[area] ?? 0)}
                className="nova-input mt-2"
              />
            </label>
          ))}
          <button className="nova-btn-primary md:col-span-3 xl:col-span-6">Guardar avance por área</button>
        </form>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(areaProgress).map(([area, value]) => (
          <div key={area} className="nova-card-pad">
            <ProgressBar value={Number(value)} label={areaLabels[area] ?? area} />
          </div>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {sections.map(({ title, icon: Icon, body }) => (
          <div key={title} className="nova-card-pad">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold"><Icon size={18} />{title}</h3>
            <p className="mt-3 text-sm leading-6 text-nova-text2">{body}</p>
            <div className="mt-4 flex gap-2">
              <button className="nova-btn">Crear registro</button>
              <button className="nova-btn">Subir archivo</button>
              <button className="nova-btn">Ver historial</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return <div className="rounded-xl border border-white/10 bg-black/25 p-3 backdrop-blur-sm"><div className="nova-label">{label}</div><div className="mt-1 text-sm text-white">{value || '—'}</div></div>;
}
