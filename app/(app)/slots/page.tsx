import { SlotProjectCard } from '@/components/SlotProjectCard';
import { getSlotGames } from '@/lib/testing-data';

export default async function SlotsPage() {
  const slots = await getSlotGames();
  return (
    <div className="space-y-7">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="nova-label">Catálogo de slots</div>
          <h1 className="nova-title mt-2">Slots en producción</h1>
          <p className="nova-subtitle">Nueva sección para los juegos de slots: logos, avance, tags, detalle de producción, testing, matemática, arte, audio y certificación.</p>
        </div>
      </section>
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {slots.map((game: any) => <SlotProjectCard key={game.id} game={game} />)}
      </section>
    </div>
  );
}
