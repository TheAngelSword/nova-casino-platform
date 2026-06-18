import { createGameAction } from '@/app/actions';
import { GameCard } from '@/components/GameCard';
import { getGames } from '@/lib/data';
import { STAGES } from '@/lib/constants';

export default async function GamesPage() {
  const games = await getGames();
  return (
    <div className="space-y-7">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="nova-label">Catálogo editable</div>
          <h1 className="nova-title mt-2">Juegos</h1>
          <p className="nova-subtitle">Cada juego tiene su ficha completa: creativo, arte, audio, matemática, programación, QA, homologación, certificación, demos, documentos y mercado.</p>
        </div>
      </section>

      <section className="nova-card-pad">
        <h2 className="font-display text-lg font-bold">Crear juego</h2>
        <form action={createGameAction} className="mt-4 grid gap-3 md:grid-cols-4">
          <input name="name" className="nova-input" placeholder="Nombre" required />
          <input name="slug" className="nova-input" placeholder="slug-ejemplo" required />
          <select name="stage" className="nova-select">
            {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
          <input name="progress" type="number" min="0" max="100" className="nova-input" placeholder="Avance %" />
          <input name="game_type" className="nova-input" placeholder="Tipo de juego" />
          <input name="theme" className="nova-input" placeholder="Tema visual" />
          <input name="owner_name" className="nova-input" placeholder="Responsable" />
          <button className="nova-btn-primary" type="submit">Guardar</button>
        </form>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {games.map((game) => <GameCard key={game.id} game={game} />)}
      </section>
    </div>
  );
}
