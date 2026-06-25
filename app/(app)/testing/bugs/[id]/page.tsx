import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Code2, ExternalLink, FileImage, Link as LinkIcon, PlaySquare, Plus, Wrench } from 'lucide-react';
import { createBugEvidenceAction, createBugReviewAction } from '@/app/actions-testing';
import { TestingStatusPill } from '@/components/TestingStatusPill';
import { getTestingBugDetail } from '@/lib/testing-data';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string; success?: string }>;
};

function formatDate(value?: string | null) {
  if (!value) return '—';
  try {
    return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  } catch {
    return value;
  }
}

function isImageUrl(url: string) {
  return /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(url);
}

function EvidencePreview({ item }: { item: any }) {
  const url = String(item.url ?? '');
  const type = String(item.evidence_type ?? 'link').toLowerCase();
  const image = type === 'image' || isImageUrl(url);
  const video = type === 'video';

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            {image ? <FileImage className="h-4 w-4 text-cyan-300" /> : video ? <PlaySquare className="h-4 w-4 text-cyan-300" /> : <LinkIcon className="h-4 w-4 text-cyan-300" />}
            <span className="truncate">{item.title || 'Evidencia'}</span>
          </div>
          <p className="mt-1 text-xs uppercase tracking-wider text-white/40">{item.evidence_type ?? 'link'} · {formatDate(item.created_at)}</p>
        </div>
        <a className="shrink-0 rounded-lg border border-white/10 px-2 py-1 text-xs font-bold text-white hover:bg-white/10" href={url} target="_blank" rel="noreferrer">
          Abrir
        </a>
      </div>

      {image ? (
        <a href={url} target="_blank" rel="noreferrer" className="mt-3 block overflow-hidden rounded-xl border border-white/10 bg-black/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={item.title || 'Evidencia'} className="max-h-72 w-full object-contain" />
        </a>
      ) : null}

      {item.notes ? <p className="mt-3 whitespace-pre-wrap text-sm text-nova-text2">{item.notes}</p> : null}
      {item.created_by_name ? <p className="mt-2 text-xs text-white/45">Agregado por: {item.created_by_name}</p> : null}
    </div>
  );
}

export default async function TestingBugDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const query = searchParams ? await searchParams : {};
  const detail = await getTestingBugDetail(id);

  if (!detail) notFound();

  const { bug, evidence, reviews } = detail;

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/testing" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/10">
          <ArrowLeft className="h-4 w-4" /> Volver a Testing
        </Link>
        <div className="flex items-center gap-2">
          <TestingStatusPill value={bug.severity} />
          <TestingStatusPill value={bug.status} />
        </div>
      </div>

      {query.error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{query.error}</div> : null}
      {query.success ? <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">{query.success}</div> : null}

      <section className="nova-card-pad">
        <div className="nova-label">Reporte de bug</div>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-black text-white">{bug.title}</h1>
            <p className="mt-2 text-nova-text2">{bug.games?.name ?? 'Juego no definido'} · {bug.build_version || 'Build no indicado'}</p>
          </div>
          <div className="text-right text-xs text-white/45">
            <div>ID</div>
            <div className="font-mono text-white/70">{bug.id}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4"><div className="nova-label">Área asignada</div><div className="mt-2 font-bold text-white">{bug.assigned_area ?? '—'}</div></div>
          <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4"><div className="nova-label">Responsable</div><div className="mt-2 font-bold text-white">{bug.assigned_to_name || '—'}</div></div>
          <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4"><div className="nova-label">Ambiente</div><div className="mt-2 font-bold text-white">{bug.environment || '—'}</div></div>
          <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4"><div className="nova-label">Creado</div><div className="mt-2 font-bold text-white">{formatDate(bug.created_at)}</div></div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <div className="nova-card-pad">
          <h2 className="font-display text-xl font-bold text-white">Descripción del problema</h2>
          <p className="mt-3 whitespace-pre-wrap text-nova-text2">{bug.description || 'Sin descripción.'}</p>
        </div>
        <div className="nova-card-pad">
          <h2 className="font-display text-xl font-bold text-white">Pasos para reproducir</h2>
          <p className="mt-3 whitespace-pre-wrap text-nova-text2">{bug.steps_to_reproduce || 'Sin pasos capturados.'}</p>
        </div>
        <div className="nova-card-pad">
          <h2 className="font-display text-xl font-bold text-white">Resultado esperado</h2>
          <p className="mt-3 whitespace-pre-wrap text-nova-text2">{bug.expected_result || '—'}</p>
        </div>
        <div className="nova-card-pad">
          <h2 className="font-display text-xl font-bold text-white">Resultado real</h2>
          <p className="mt-3 whitespace-pre-wrap text-nova-text2">{bug.actual_result || '—'}</p>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <div className="nova-card-pad">
          <div className="flex items-center gap-2">
            <FileImage className="h-5 w-5 text-cyan-300" />
            <h2 className="font-display text-xl font-bold text-white">Evidencias del problema</h2>
          </div>
          <p className="mt-2 text-sm text-nova-text2">Agrega imágenes, videos, logs, capturas, Drive, YouTube privado, Supabase Storage o ligas a documentos.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {evidence.map((item: any) => <EvidencePreview key={item.id} item={item} />)}
            {evidence.length === 0 ? <div className="rounded-2xl border border-dashed border-white/10 p-8 text-sm text-nova-text2">Aún no hay evidencias registradas.</div> : null}
          </div>
        </div>

        <div className="nova-card-pad">
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-cyan-300" />
            <h2 className="font-display text-xl font-bold text-white">Agregar evidencia</h2>
          </div>
          <form action={createBugEvidenceAction.bind(null, bug.id)} className="mt-4 space-y-3">
            <select name="evidence_type" className="nova-select">
              <option value="image">Imagen / captura</option>
              <option value="video">Video</option>
              <option value="log">Log</option>
              <option value="document">Documento</option>
              <option value="link">Liga general</option>
            </select>
            <input name="title" className="nova-input" placeholder="Título de evidencia" />
            <input name="url" className="nova-input" placeholder="URL de imagen, video, log o documento" required />
            <input name="created_by_name" className="nova-input" placeholder="Quién agregó la evidencia" />
            <textarea name="notes" className="nova-input min-h-[96px]" placeholder="Notas de la evidencia" />
            <button type="submit" className="nova-btn-primary w-full">Guardar evidencia</button>
          </form>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_520px]">
        <div className="nova-card-pad">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-cyan-300" />
            <h2 className="font-display text-xl font-bold text-white">Revisiones y correcciones técnicas</h2>
          </div>
          <div className="mt-5 space-y-4">
            {reviews.map((review: any) => (
              <div key={review.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-white">{review.reviewer_name || review.fixed_by_name || 'Revisión'}</div>
                    <div className="text-xs text-nova-text2">{review.reviewer_area ?? 'Área'} · {formatDate(review.reviewed_at)}</div>
                  </div>
                  <TestingStatusPill value={review.review_status} />
                </div>
                {review.root_cause ? <div className="mt-4"><div className="nova-label">Causa raíz</div><p className="mt-1 whitespace-pre-wrap text-sm text-nova-text2">{review.root_cause}</p></div> : null}
                {review.code_changes_summary ? <div className="mt-4"><div className="nova-label">Qué modificó del código</div><p className="mt-1 whitespace-pre-wrap text-sm text-nova-text2">{review.code_changes_summary}</p></div> : null}
                {review.files_changed ? <div className="mt-4"><div className="nova-label">Archivos modificados</div><pre className="mt-2 overflow-x-auto rounded-xl bg-black/30 p-3 text-xs text-cyan-100">{review.files_changed}</pre></div> : null}
                {review.fix_details ? <div className="mt-4"><div className="nova-label">Detalle de solución</div><p className="mt-1 whitespace-pre-wrap text-sm text-nova-text2">{review.fix_details}</p></div> : null}
                {review.test_notes ? <div className="mt-4"><div className="nova-label">Validación posterior</div><p className="mt-1 whitespace-pre-wrap text-sm text-nova-text2">{review.test_notes}</p></div> : null}
                <div className="mt-4 flex flex-wrap gap-3 text-xs">
                  {review.fix_version ? <span className="rounded-full bg-white/5 px-3 py-1 text-white/70">Build: {review.fix_version}</span> : null}
                  {review.fixed_by_name ? <span className="rounded-full bg-white/5 px-3 py-1 text-white/70">Corregido por: {review.fixed_by_name}</span> : null}
                  {review.fix_commit_url ? <a href={review.fix_commit_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-cyan-200 hover:bg-white/10">Commit <ExternalLink className="h-3 w-3" /></a> : null}
                  {review.review_evidence_url ? <a href={review.review_evidence_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-cyan-200 hover:bg-white/10">Evidencia fix <ExternalLink className="h-3 w-3" /></a> : null}
                </div>
              </div>
            ))}
            {reviews.length === 0 ? <div className="rounded-2xl border border-dashed border-white/10 p-8 text-sm text-nova-text2">Aún no hay revisión técnica registrada.</div> : null}
          </div>
        </div>

        <div className="nova-card-pad">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-cyan-300" />
            <h2 className="font-display text-xl font-bold text-white">Registrar corrección del programador</h2>
          </div>
          <form action={createBugReviewAction} className="mt-4 space-y-3">
            <input type="hidden" name="bug_id" value={bug.id} />
            <div className="grid gap-3 md:grid-cols-2">
              <input name="reviewer_name" className="nova-input" placeholder="Quién revisó" />
              <select name="reviewer_area" className="nova-select">
                <option>Programación</option>
                <option>Arte</option>
                <option>Diseño</option>
                <option>Audio</option>
                <option>Matemática</option>
                <option>QA</option>
                <option>Homologación</option>
              </select>
              <select name="review_status" className="nova-select">
                <option value="en_revision">En revisión</option>
                <option value="corregido">Corregido</option>
                <option value="cerrado">Cerrado</option>
                <option value="rechazado">Rechazado</option>
                <option value="duplicado">Duplicado</option>
                <option value="no_reproducible">No reproducible</option>
              </select>
              <input name="fixed_by_name" className="nova-input" placeholder="Programador responsable" />
            </div>
            <input name="fix_version" className="nova-input" placeholder="Build / versión donde se corrige" />
            <input name="fix_commit_url" className="nova-input" placeholder="Liga del commit / PR / rama" />
            <textarea name="root_cause" className="nova-input min-h-[82px]" placeholder="Causa raíz del problema" />
            <textarea name="code_changes_summary" className="nova-input min-h-[110px]" placeholder="Qué modificó del código para arreglarlo" required />
            <textarea name="files_changed" className="nova-input min-h-[96px] font-mono text-xs" placeholder="Archivos modificados. Ej: src/game/paytable.ts, src/sas/cashout.ts" />
            <textarea name="fix_details" className="nova-input min-h-[96px]" placeholder="Detalle técnico de la solución" />
            <textarea name="test_notes" className="nova-input min-h-[96px]" placeholder="Cómo se validó después de la corrección" />
            <input name="review_evidence_url" className="nova-input" placeholder="Liga a evidencia de corrección: video, imagen, log, deploy" />
            <button type="submit" className="nova-btn-primary w-full">
              <CheckCircle2 className="mr-2 inline h-4 w-4" /> Guardar revisión técnica
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
