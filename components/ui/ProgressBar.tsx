export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const v = Math.max(0, Math.min(100, value ?? 0));
  return (
    <div className="space-y-1.5">
      {label ? <div className="flex items-center justify-between text-xs text-nova-text2"><span>{label}</span><span className="font-mono text-white">{v}%</span></div> : null}
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-nova-violet via-nova-blue to-nova-cyan" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
