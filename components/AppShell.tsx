'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Hexagon, LogOut, Menu, Search, X } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useState } from 'react';

export function AppShell({ children, userEmail }: { children: React.ReactNode; userEmail?: string | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-nova-bg text-white">
      <div className={open ? 'fixed inset-0 z-30 bg-black/60 lg:hidden' : 'hidden'} onClick={() => setOpen(false)} />
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 bg-nova-bg2/95 backdrop-blur transition lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-nova-violet to-nova-blue shadow-glow">
              <Hexagon size={21} />
            </div>
            <div>
              <div className="font-display text-base font-bold leading-none">NOVA</div>
              <div className="mt-1 font-display text-[10px] uppercase tracking-[.18em] text-white/45">Casino Studio</div>
            </div>
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Cerrar menú"><X size={18} /></button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <div className="px-3 pb-2 pt-3 font-display text-[10px] uppercase tracking-[.2em] text-white/40">Producción</div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? 'border border-nova-violet/40 bg-nova-violet/15 text-white' : 'text-nova-text2 hover:bg-white/5 hover:text-white'}`}>
                <Icon size={18} />{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="text-xs text-nova-text2">{userEmail ?? 'Modo demo local'}</div>
          <button onClick={signOut} className="mt-3 flex w-full items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-nova-text2 hover:bg-white/5 hover:text-white">
            <LogOut size={16} /> Salir
          </button>
        </div>
      </aside>

      <main className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/10 bg-nova-bg/75 px-4 py-3 backdrop-blur lg:px-7">
          <button className="nova-btn px-3 lg:hidden" onClick={() => setOpen(true)} aria-label="Abrir menú"><Menu size={18} /></button>
          <div className="hidden min-w-[260px] items-center gap-2 rounded-xl border border-white/10 bg-nova-surface2 px-3 py-2 text-nova-text2 md:flex">
            <Search size={16} />
            <input placeholder="Buscar juego, documento o tarea…" className="w-full bg-transparent text-sm outline-none placeholder:text-white/30" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/games/new" className="nova-btn-primary">Nuevo juego</Link>
          </div>
        </header>
        <div className="mx-auto max-w-7xl p-4 lg:p-7">{children}</div>
      </main>
    </div>
  );
}
