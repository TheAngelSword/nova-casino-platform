export function TestingStatusPill({ value }: { value?: string | null }) {
  const normalized = String(value ?? 'pendiente').toLowerCase();
  const tone =
    ['aprobado', 'cerrado', 'corregido'].includes(normalized) ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200' :
    ['fallido', 'critica', 'bloqueante', 'abierto'].includes(normalized) ? 'border-red-400/30 bg-red-400/10 text-red-200' :
    ['revision', 'revalidacion', 'en_correccion', 'asignado'].includes(normalized) ? 'border-amber-400/30 bg-amber-400/10 text-amber-200' :
    'border-white/10 bg-white/5 text-white/65';

  return <span className={`rounded-full border px-2.5 py-1 font-display text-[10px] uppercase tracking-wider ${tone}`}>{normalized.replaceAll('_', ' ')}</span>;
}
