import { createSupabaseServerClient, isSupabaseConfigured } from './supabase/server';
import { getGames, getTasks } from './data';

export type TestingSummary = {
  totalCases: number;
  executed: number;
  passed: number;
  failed: number;
  openBugs: number;
  criticalBugs: number;
  sessionsToday: number;
};

export async function getTestingSummary(): Promise<TestingSummary> {
  if (!isSupabaseConfigured()) {
    return { totalCases: 24, executed: 9, passed: 6, failed: 3, openBugs: 5, criticalBugs: 1, sessionsToday: 1 };
  }

  const supabase = await createSupabaseServerClient();
  const [casesRes, execRes, bugsRes, sessionsRes] = await Promise.all([
    supabase.from('test_cases').select('id,status', { count: 'exact' }),
    supabase.from('test_executions').select('id,result', { count: 'exact' }),
    supabase.from('testing_bug_reports').select('id,status,severity', { count: 'exact' }),
    supabase.from('testing_sessions').select('id,session_date', { count: 'exact' }).eq('session_date', new Date().toISOString().slice(0, 10))
  ]);

  const executions = execRes.data ?? [];
  const bugs = bugsRes.data ?? [];
  return {
    totalCases: casesRes.count ?? casesRes.data?.length ?? 0,
    executed: execRes.count ?? executions.length,
    passed: executions.filter((e: any) => e.result === 'aprobado').length,
    failed: executions.filter((e: any) => e.result === 'fallido').length,
    openBugs: bugs.filter((b: any) => !['cerrado', 'rechazado', 'corregido'].includes(String(b.status ?? '').toLowerCase())).length,
    criticalBugs: bugs.filter((b: any) => ['critica', 'bloqueante'].includes(String(b.severity ?? '').toLowerCase())).length,
    sessionsToday: sessionsRes.count ?? sessionsRes.data?.length ?? 0
  };
}

export async function getTestingSessions() {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('testing_sessions')
    .select('*, games(name, slug), tester_profiles(tester_name)')
    .order('created_at', { ascending: false })
    .limit(20);
  return data ?? [];
}

export async function getTestingBugs() {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('testing_bug_reports')
    .select('*, games(name, slug), tester_profiles(tester_name)')
    .order('created_at', { ascending: false })
    .limit(30);
  return data ?? [];
}

export async function getTestingBugDetail(id: string) {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSupabaseServerClient();

  const { data: bug, error } = await supabase
    .from('testing_bug_reports')
    .select('*, games(id, name, slug), tester_profiles(tester_name)')
    .eq('id', id)
    .single();

  if (error || !bug) return null;

  const [evidenceRes, reviewsRes] = await Promise.all([
    supabase
      .from('testing_bug_evidence')
      .select('*')
      .eq('bug_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('testing_bug_reviews')
      .select('*')
      .eq('bug_id', id)
      .order('reviewed_at', { ascending: false })
  ]);

  return {
    bug,
    evidence: evidenceRes.data ?? [],
    reviews: reviewsRes.data ?? []
  };
}

export async function getTestCases() {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('test_cases')
    .select('*, games(name, slug)')
    .order('created_at', { ascending: false })
    .limit(50);
  return data ?? [];
}

export async function getSlotGames() {
  const games = await getGames();
  return games.filter((g: any) => g.category === 'slot' || String(g.game_type ?? '').toLowerCase() === 'slot' || (g.tags ?? []).includes('slots'));
}

export async function getRecentTestingTasks() {
  const tasks = await getTasks();
  return tasks.filter((t) => ['QA', 'Testing', 'Homologación', 'Matemática', 'Programación'].includes(t.area)).slice(0, 6);
}
