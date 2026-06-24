import { SlotProjectCard } from '@/components/SlotProjectCard';
import { getSlotGames } from '@/lib/testing-data';

export default async function SlotsPage() {
  const slots = await getSlotGames();

  return (
    <div className="space-y-7">
      <section
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] bg-cover bg-center p-7 shadow-[0_24px_80px_rgba(0,0,0,.28)]"
        style={{ backgroundImage: "linear-gradient(90deg, rgba(7,7,15,.92), rgba(7,7,15,.72), rgba(7,7,15,.92)), url('/assets/platform/slots_header.webp')" }}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-fuchsia-400 via-nova-violet to-nova-cyan" />
        <div className="max-w-3xl">
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
