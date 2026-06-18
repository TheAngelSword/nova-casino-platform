import { createSupabaseServerClient, isSupabaseConfigured } from './supabase/server';
import { demoDocuments, demoGames, demoStats, demoTasks } from './demo-data';
import type { DashboardStats, DocumentRecord, Game, Task } from './types';

export async function getGames(): Promise<Game[]> {
  if (!isSupabaseConfigured()) return demoGames;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: true });
  if (error || !data) return demoGames;
  return data as Game[];
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
  const fallback = demoGames.find((g) => g.slug === slug) ?? null;
  if (!isSupabaseConfigured()) return fallback;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('games').select('*').eq('slug', slug).is('deleted_at', null).single();
  if (error || !data) return fallback;
  return data as Game;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const games = await getGames();
  if (!isSupabaseConfigured()) return demoStats;
  return {
    totalGames: games.length,
    averageProgress: games.length ? Math.round(games.reduce((a, g) => a + Number(g.progress ?? 0), 0) / games.length) : 0,
    inDevelopment: games.filter((g) => ['concepto', 'diseno', 'arte', 'matematica', 'programacion', 'integracion'].includes(g.stage)).length,
    inQa: games.filter((g) => g.stage === 'qa' || g.stage === 'simulacion').length,
    inHomologation: games.filter((g) => g.stage === 'homologacion').length,
    certified: games.filter((g) => g.stage === 'certificacion').length,
    marketReady: games.filter((g) => g.stage === 'mercado').length
  };
}

export async function getTasks(): Promise<Task[]> {
  if (!isSupabaseConfigured()) return demoTasks;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('tasks')
    .select('*, games(name)')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });
  if (error || !data) return demoTasks;
  return data.map((t: any) => ({ ...t, game_name: t.games?.name ?? null })) as Task[];
}

export async function getDocuments(): Promise<DocumentRecord[]> {
  if (!isSupabaseConfigured()) return demoDocuments;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('documents')
    .select('*, games(name)')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });
  if (error || !data) return demoDocuments;
  return data.map((d: any) => ({ ...d, game_name: d.games?.name ?? null })) as DocumentRecord[];
}
