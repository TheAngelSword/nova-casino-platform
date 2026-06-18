'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function LoginForm({ supabaseConfigured }: { supabaseConfigured: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const clientSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const configured = true;

  async function onSubmit(formData: FormData) {
    if (!configured) {
      router.push('/dashboard');
      return;
    }

    setLoading(true);

    const email = String(formData.get('email'));
    const password = String(formData.get('password'));

    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <form action={onSubmit} className="space-y-4">
      {!configured ? (
        <div className="rounded-xl border border-nova-gold/30 bg-nova-gold/10 p-3 text-sm text-nova-gold">
          Modo demo: revisa las variables NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en Vercel.
        </div>
      ) : null}

      <div>
        <label className="nova-label">Email</label>
        <input
          name="email"
          type="email"
          required
          className="nova-input mt-2"
          placeholder="usuario@empresa.com"
        />
      </div>

      <div>
        <label className="nova-label">Contraseña</label>
        <input
          name="password"
          type="password"
          required
          className="nova-input mt-2"
          placeholder="••••••••"
        />
      </div>

      <button disabled={loading} className="nova-btn-primary w-full" type="submit">
        {loading ? 'Entrando…' : configured ? 'Entrar' : 'Entrar en modo demo'}
      </button>
    </form>
  );
}
