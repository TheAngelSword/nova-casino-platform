import type { LucideIcon } from 'lucide-react';

export function StatCard({ label, value, icon: Icon, note }: { label: string; value: string | number; icon: LucideIcon; note?: string }) {
  return (
    <div className="nova-card-pad">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="nova-label">{label}</div>
          <div className="mt-3 font-display text-3xl font-bold text-white">{value}</div>
          {note ? <div className="mt-2 text-xs text-nova-text2">{note}</div> : null}
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-nova-violet to-nova-blue shadow-glow">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
