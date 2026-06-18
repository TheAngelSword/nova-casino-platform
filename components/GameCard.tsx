import Link from 'next/link';
import { Gamepad2, ArrowUpRight } from 'lucide-react';
import type { Game } from '@/lib/types';
import { ProgressBar } from './ui/ProgressBar';
import { STAGES } from '@/lib/constants';

export function GameCard({ game }: { game: Game }) {
  const stage = STAGES.find((s) => s.key === game.stage);
  return (
    <Link href={`/games/${game.slug}`} className="nova-card group block overflow-hidden transition hover:-translate-y-1 hover:border-white/20">
      <div className="h-1 bg-gradient-to-r from-nova-violet via-nova-blue to-nova-cyan" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/8 text-nova-cyan">
              <Gamepad2 size={22} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white">{game.name}</h3>
              <p className="text-xs text-nova-text2">{game.game_type ?? 'Mini game'} · {game.complexity ?? 'Media'}</p>
            </div>
          </div>
          <ArrowUpRight size={18} className="text-white/35 transition group-hover:text-white" />
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
