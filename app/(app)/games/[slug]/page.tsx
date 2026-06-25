import { notFound } from 'next/navigation';
import {
  createGameDocumentReferenceAction,
  createProductionRecordAction,
  updateGameAreaProgressAction,
  updateGameSummaryAction
} from '@/app/actions-game-detail';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { STAGES } from '@/lib/constants';
import { getGameBySlug } from '@/lib/data';
import { createSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { Calculator, FileText, Headphones, ImageIcon, ListChecks, Rocket, ShieldCheck, Wrench } from 'lucide-react';

type ProductionSection = {
  key: string;
  title: string;
  icon: typeof FileText;
  body: string;
  hint: string;
};

type HistoryItem = {
  id: string;
  section: string;
  title: string;
  subtitle: string;
  status?: string | null;
  version?: string | null;
  created_at?: string | null;
};

type HistoryBySection = Record<string, HistoryItem[]>;

const sections: ProductionSection[] = [
  {
    key: 'creative',
    title: 'Creativo',
    icon: FileText,
    body: 'Concepto narrativo, ambientación, moodboard, paleta de colores, personajes, escenario, experiencia esperada y diferenciador creativo.',
    hint: 'Registra concepto, experiencia, diferenciador, moodboard o cambios creativos.'
  },
  {
    key: 'art',
    title: 'Arte y diseño',
    icon: ImageIcon,
    body: 'Logo, pantalla principal, fondos, personajes, símbolos, botones, UI, animaciones, jackpot, versiones y aprobación de assets.',
    hint: 'Registra assets, versiones gráficas, aprobaciones, pendientes o comentarios de diseño.'
  },
  {
    key: 'audio',
    title: 'Música y sonido',
    icon: Headphones,
    body: 'Música principal, bonus, free games, jackpot, sonidos de botón, giro, premio, error, alerta y voces especiales.',
    hint: 'Registra pistas, efectos, voces, versiones, duración, pendientes o aprobación de audio.'
  },
  {
    key: 'math',
    title: 'Matemática',
    icon: Calculator,
    body: 'RTP objetivo/observado, volatilidad, hit frequency, ciclo, apuestas, denominaciones, tabla de pagos, simulaciones y reportes.',
    hint: 'Registra RTP, volatilidad, ciclo matemático, simulaciones, desviaciones y aprobación.'
  },
  {
    key: 'programming',
    title: 'Programación',
    icon: Wrench,
    body: 'Build actual, motor, repositorio, módulos terminados/pendientes, bugs, changelog, SAS/AFT, logs, demo y build descargable.',
    hint: 'Registra build, motor, repositorio, bugs abiertos/corregidos, módulos y estado técnico.'
  },
  {
    key: 'qa',
    title: 'QA y pruebas',
    icon: ListChecks,
    body: 'Pruebas funcionales, matemáticas, rendimiento, apagado inesperado, recuperación, cashout, puerta abierta, sesión y evidencias.',
    hint: 'Registra casos de prueba, resultados, tester responsable, evidencias y observaciones.'
  },
  {
    key: 'homologation',
    title: 'Homologación / certificación',
    icon: ShieldCheck,
    body: 'Checklist, requisitos, hallazgos, correcciones, documentos enviados, laboratorio, observaciones, fechas y certificados.',
    hint: 'Registra requisitos, hallazgos, sistemas externos, vencimientos y correcciones.'
  },
  {
    key: 'market',
    title: 'Mercado y demos',
    icon: Rocket,
    body: 'Cliente objetivo, casino objetivo, versión lista, manuales, material promocional, demo pública/privada y métricas post instalación.',
    hint: 'Registra cliente/casino objetivo, versión lista, requerimientos y materiales de salida a mercado.'
  }
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

function sectionTitle(sectionKey: string) {
  return sections.find((section) => section.key === sectionKey)?.title ?? sectionKey;
}

async function getHistory(gameId: string): Promise<HistoryBySection> {
  const empty = Object.fromEntries(sections.map((section) => [section.key, []])) as HistoryBySection;
  if (!isSupabaseConfigured()) return empty;

  const supabase = await createSupabaseServerClient();

  const [creative, art, audio, math, programming, qa, homologation, market, documents] = await Promise.all([
    supabase
      .from('game_creative')
      .select('id, narrative_concept, ambience, status, version, created_at')
      .eq('game_id', gameId)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('art_assets')
      .select('id, name, asset_type, status, version, owner_name, created_at')
      .eq('game_id', gameId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('audio_assets')
      .select('id, name, audio_type, status, version, owner_name, created_at')
      .eq('game_id', gameId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('math_models')
      .select('id, version, volatility, rtp_target, rtp_observed, approval_status, created_at')
      .eq('game_id', gameId)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('development_builds')
      .select('id, build_version, engine, status, bugs_open, bugs_fixed, created_at')
      .eq('game_id', gameId)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('qa_tests')
      .select('id, name, description, status, result, owner_name, test_date, created_at')
      .eq('game_id', gameId)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('homologation_requirements')
      .select('id, name, description, external_system, status, due_date, created_at')
      .eq('game_id', gameId)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('market_launches')
      .select('id, commercial_status, target_client, target_casino, market_ready_version, created_at')
      .eq('game_id', gameId)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('documents')
      .select('id, name, category, version, status, file_name, created_at')
      .eq('game_id', gameId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(30)
  ]);

  const result = { ...empty };

  result.creative = (creative.data ?? []).map((item: any) => ({
    id: item.id,
    section: 'creative',
    title: item.narrative_concept ?? 'Registro creativo',
    subtitle: item.ambience ?? 'Sin descripción',
    status: item.status,
    version: item.version,
    created_at: item.created_at
  }));

  result.art = (art.data ?? []).map((item: any) => ({
    id: item.id,
    section: 'art',
    title: item.name,
    subtitle: `${item.asset_type ?? 'Asset'}${item.owner_name ? ` · ${item.owner_name}` : ''}`,
    status: item.status,
    version: item.version,
    created_at: item.created_at
  }));

  result.audio = (audio.data ?? []).map((item: any) => ({
    id: item.id,
    section: 'audio',
    title: item.name,
    subtitle: `${item.audio_type ?? 'Audio'}${item.owner_name ? ` · ${item.owner_name}` : ''}`,
    status: item.status,
    version: item.version,
    created_at: item.created_at
  }));

  result.math = (math.data ?? []).map((item: any) => ({
    id: item.id,
    section: 'math',
    title: item.volatility ?? 'Modelo matemático',
    subtitle: `RTP objetivo ${item.rtp_target ?? '—'} · RTP observado ${item.rtp_observed ?? '—'}`,
    status: item.approval_status,
    version: item.version,
    created_at: item.created_at
  }));

  result.programming = (programming.data ?? []).map((item: any) => ({
    id: item.id,
    section: 'programming',
    title: item.build_version,
    subtitle: `${item.engine ?? 'Build'} · Bugs ${item.bugs_open ?? 0}/${item.bugs_fixed ?? 0}`,
    status: item.status,
    version: item.build_version,
    created_at: item.created_at
  }));

  result.qa = (qa.data ?? []).map((item: any) => ({
    id: item.id,
    section: 'qa',
    title: item.name,
    subtitle: `${item.description ?? 'Prueba'}${item.result ? ` · ${item.result}` : ''}`,
    status: item.status,
    version: item.test_date,
    created_at: item.created_at
  }));

  result.homologation = (homologation.data ?? []).map((item: any) => ({
    id: item.id,
    section: 'homologation',
    title: item.name,
    subtitle: `${item.external_system ?? 'Requisito'} · ${item.description ?? 'Sin descripción'}`,
    status: item.status,
    version: item.due_date,
    created_at: item.created_at
  }));

  result.market = (market.data ?? []).map((item: any) => ({
    id: item.id,
    section: 'market',
    title: item.target_client ?? 'Salida a mercado',
    subtitle: `${item.target_casino ?? 'Casino no definido'} · ${item.market_ready_version ?? 'Sin versión'}`,
    status: item.commercial_status,
    version: item.market_ready_version,
    created_at: item.created_at
  }));

  const docsBySection: Record<string, string> = {
    'Creativo': 'creative',
    'Arte y diseño': 'art',
    'Música y sonido': 'audio',
    'Matemática': 'math',
    'Programación': 'programming',
    'QA y pruebas': 'qa',
    'Homologación / certificación': 'homologation',
    'Mercado y demos': 'market'
  };

  for (const doc of documents.data ?? []) {
    const key = docsBySection[(doc as any).category] ?? null;
    if (!key) continue;
    result[key].push({
      id: (doc as any).id,
      section: key,
      title: `Archivo: ${(doc as any).name}`,
      subtitle: (doc as any).file_name ?? 'Referencia documental',
      status: (doc as any).status,
      version: (doc as any).version,
      created_at: (doc as any).created_at
    });
  }

  return result;
}

export default async function GameDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ error?: string; success?: string }>;
}) {
  const { slug } = await params;
  const query = searchParams ? await searchParams : {};
  const game = await getGameBySlug(slug);
  if (!game) notFound();

  const history = await getHistory(game.id);
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
      {query.success ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          {decodeURIComponent(query.success)}
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
        {sections.map((section) => (
          <ProductionSectionCard key={section.key} section={section} gameId={game.id} history={history[section.key] ?? []} />
        ))}
      </section>
    </div>
  );
}

function ProductionSectionCard({ section, gameId, history }: { section: ProductionSection; gameId: string; history: HistoryItem[] }) {
  const Icon = section.icon;
  return (
    <div className="nova-card-pad">
      <h3 className="flex items-center gap-2 font-display text-lg font-bold"><Icon size={18} />{section.title}</h3>
      <p className="mt-3 text-sm leading-6 text-nova-text2">{section.body}</p>
      <p className="mt-2 text-xs text-nova-text2/70">{section.hint}</p>

      <div className="mt-4 grid gap-3">
        <details className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <summary className="cursor-pointer list-none rounded-xl px-3 py-2 text-sm font-semibold text-white hover:bg-white/5">
            Crear registro
          </summary>
          <form action={createProductionRecordAction.bind(null, gameId, section.key)} className="mt-3 grid gap-3 md:grid-cols-2">
            <input name="title" className="nova-input" placeholder="Título / nombre del registro" required />
            <select name="status" className="nova-select" defaultValue="pendiente">
              <option value="pendiente">Pendiente</option>
              <option value="proceso">En proceso</option>
              <option value="revision">En revisión</option>
              <option value="aprobado">Aprobado</option>
              <option value="bloqueado">Bloqueado</option>
              <option value="terminado">Terminado</option>
            </select>
            <input name="version" className="nova-input" placeholder="Versión / build" defaultValue="v0.1" />
            <input name="owner_name" className="nova-input" placeholder="Responsable" />
            <input name="date" type="date" className="nova-input" />
            <input name="url" className="nova-input" placeholder="URL repositorio/demo/referencia" />
            {section.key === 'math' ? (
              <>
                <input name="rtp_target" type="number" step="0.001" className="nova-input" placeholder="RTP objetivo" />
                <input name="rtp_observed" type="number" step="0.001" className="nova-input" placeholder="RTP observado" />
              </>
            ) : null}
            {section.key === 'programming' ? (
              <>
                <input name="bugs_open" type="number" min="0" className="nova-input" placeholder="Bugs abiertos" />
                <input name="bugs_fixed" type="number" min="0" className="nova-input" placeholder="Bugs corregidos" />
              </>
            ) : null}
            {section.key === 'homologation' ? (
              <input name="external_system" className="nova-input md:col-span-2" placeholder="Sistema externo: SAS/AFT/Caja/GLI" />
            ) : null}
            <textarea name="description" className="nova-input md:col-span-2 min-h-24" placeholder="Descripción / tipo / alcance" />
            <textarea name="notes" className="nova-input md:col-span-2 min-h-24" placeholder="Notas, pendientes, evidencia, cambios o comentarios" />
            <button className="nova-btn-primary md:col-span-2">Guardar registro</button>
          </form>
        </details>

        <details className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <summary className="cursor-pointer list-none rounded-xl px-3 py-2 text-sm font-semibold text-white hover:bg-white/5">
            Subir archivo / registrar referencia
          </summary>
          <form action={createGameDocumentReferenceAction.bind(null, gameId, section.key)} className="mt-3 grid gap-3 md:grid-cols-2">
            <input name="title" className="nova-input" placeholder="Nombre visible del archivo" required />
            <input name="version" className="nova-input" placeholder="Versión" defaultValue="v0.1" />
            <input name="file_name" className="nova-input" placeholder="Nombre del archivo" />
            <input name="url" className="nova-input" placeholder="URL externa o ruta en storage" />
            <select name="status" className="nova-select" defaultValue="registrado">
              <option value="registrado">Registrado</option>
              <option value="subido">Subido</option>
              <option value="revision">En revisión</option>
              <option value="aprobado">Aprobado</option>
            </select>
            <input name="storage_path" className="nova-input" placeholder="Ruta opcional: carpeta/archivo.ext" />
            <textarea name="notes" className="nova-input md:col-span-2 min-h-20" placeholder="Comentarios del archivo" />
            <button className="nova-btn-primary md:col-span-2">Guardar referencia de archivo</button>
            <a className="nova-btn md:col-span-2 text-center" href="/documents">
              Ir a biblioteca para carga física de archivo
            </a>
          </form>
        </details>

        <details className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <summary className="cursor-pointer list-none rounded-xl px-3 py-2 text-sm font-semibold text-white hover:bg-white/5">
            Ver historial ({history.length})
          </summary>
          <div className="mt-3 space-y-2">
            {history.length ? history.map((item) => (
              <div key={`${item.section}-${item.id}`} className="rounded-xl border border-white/10 bg-black/20 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-semibold text-white">{item.title}</div>
                  <div className="text-xs text-nova-text2/70">{item.created_at?.slice(0, 10) ?? 'Sin fecha'}</div>
                </div>
                <div className="mt-1 text-xs text-nova-text2">{item.subtitle}</div>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-[.14em] text-nova-text2/70">
                  {item.status ? <span className="rounded-full border border-white/10 px-2 py-1">{item.status}</span> : null}
                  {item.version ? <span className="rounded-full border border-white/10 px-2 py-1">{item.version}</span> : null}
                  <span className="rounded-full border border-white/10 px-2 py-1">{sectionTitle(item.section)}</span>
                </div>
              </div>
            )) : (
              <div className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-nova-text2">
                Todavía no hay registros o archivos para esta sección.
              </div>
            )}
          </div>
        </details>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return <div className="rounded-xl border border-white/10 bg-black/25 p-3 backdrop-blur-sm"><div className="nova-label">{label}</div><div className="mt-1 text-sm text-white">{value || '—'}</div></div>;
}
