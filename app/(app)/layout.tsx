export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { createSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return <AppShell userEmail="Modo demo sin Supabase">{children}</AppShell>;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/login');

  return <AppShell userEmail={data.user.email}>{children}</AppShell>;
}
