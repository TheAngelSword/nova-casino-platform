import { redirect } from 'next/navigation';
import { createSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { LoginForm } from './LoginForm';

export default async function LoginPage() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    if (data.user) redirect('/dashboard');
  }

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-md nova-card-pad">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-nova-violet to-nova-blue shadow-glow font-display text-xl font-bold">N</div>
          <h1 className="font-display text-2xl font-bold">NOVA Casino Studio</h1>
          <p className="mt-2 text-sm text-nova-text2">Acceso privado para producción, documentación, archivos y certificación.</p>
        </div>
        <LoginForm supabaseConfigured={isSupabaseConfigured()} />
      </div>
    </main>
  );
}
