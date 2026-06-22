import Link from 'next/link';
import { ArrowUpRight, Gamepad2 } from 'lucide-react';
import type { Game } from '@/lib/types';
import { ProgressBar } from './ui/ProgressBar';

export function SlotProjectCard({ game }: { game: Game & { logo_url?: string | null; hero_image_url?: string | null; tags?: string[] | null } }) {
  return (
    <Link href={`/games/${game.slug}`} className="nova-card group block overflow-hidden transition hover:-translate-y-1 hover:border-nova-cyan/40">
      <div className="h-1 bg-gradient-to-r from-fuchsia-400 via-nova-violet to-nova-cyan" />
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="h-20 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            {game.logo_url || game.hero_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={game.logo_url ?? game.hero_image_url ?? ''} alt={game.name} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center text-nova-cyan"><Gamepad2 size={28} /></div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-xl font-bold leading-tight text-white">{game.name}</h3>
              <ArrowUpRight size={18} className="text-white/30 transition group-hover:text-white" />
            </div>
            <p className="mt-1 text-sm text-nova-text2">{game.game_type ?? 'Slot'} · {game.theme ?? 'Tema por definir'}</p>
            <p className="text-xs text-nova-text2">{game.stage === 'concepto' ? 'En preparación' : 'En producción'}</p>
          </div>
        </div>
        <div className="mt-5"><ProgressBar value={game.progress} label="Avance general" /></div>
        <div className="mt-4 flex flex-wrap gap-2">
          {(game.tags?.length ? game.tags : ['slots']).slice(0, 4).map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-display text-[10px] uppercase tracking-wider text-white/70">{tag}</span>
          ))}
        </div>
        <button className="mt-5 rounded-xl bg-gradient-to-r from-nova-violet to-nova-cyan px-5 py-2.5 text-sm font-bold text-white shadow-glow">Ver detalle</button>
      </div>
    </Link>
  );
}
