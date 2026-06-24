import Link from 'next/link';
import { ArrowUpRight, Gamepad2 } from 'lucide-react';
import type { Game } from '@/lib/types';
import { ProgressBar } from './ui/ProgressBar';
import { STAGES } from '@/lib/constants';

function gameAsset(slug: string, file: string) {
  return `/assets/games/${slug}/${file}`;
}

export function GameCard({ game }: { game: Game }) {
  const stage = STAGES.find((s) => s.key === game.stage);
  const coverUrl = gameAsset(game.slug, 'cover_card.webp');

  return (
    <Link href={`/games/${game.slug}`} className="nova-card group block overflow-hidden transition hover:-translate-y-1 hover:border-white/20">
      <div className="h-1 bg-gradient-to-r from-nova-violet via-nova-blue to-nova-cyan" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <div
              className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 bg-cover bg-center shadow-[inset_0_0_0_1px_rgba(255,255,255,.04)]"
              style={{ backgroundImage: `linear-gradient(135deg, rgba(15,15,30,.15), rgba(15,15,30,.55)), url('${coverUrl}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/35" />
              <div className="absolute bottom-2 right-2 rounded-lg border border-white/10 bg-black/35 p-1.5 text-nova-cyan opacity-80 backdrop-blur-sm transition group-hover:opacity-0">
                <Gamepad2 size={16} />
              </div>
            </div>

            <div className="min-w-0">
              <h3 className="line-clamp-2 font-display text-lg font-bold leading-tight text-white">{game.name}</h3>
              <p className="mt-1 text-xs text-nova-text2">{game.game_type ?? 'Mini game'} · {game.complexity ?? 'Media'}</p>
            </div>
          </div>
          <ArrowUpRight size={18} className="shrink-0 text-white/35 transition group-hover:text-white" />
        </div>

        <p className="mt-4 line-clamp-2 min-h-[40px] text-sm leading-5 text-nova-text2">{game.description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 px-2.5 py-1 font-display text-[10px] uppercase tracking-wider text-white/65">{stage?.label ?? game.stage}</span>
          <span className="rounded-full border border-white/10 px-2.5 py-1 font-display text-[10px] uppercase tracking-wider text-white/65">{game.priority ?? 'Media'}</span>
        </div>

        <div className="mt-5"><ProgressBar value={game.progress} label="Avance general" /></div>
      </div>
    </Link>
  );
}
