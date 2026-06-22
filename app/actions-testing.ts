'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';

export async function createTestingSessionAction(formData: FormData) {
  if (!isSupabaseConfigured()) redirect('/testing?demoMode=1');
  const supabase = await createSupabaseServerClient();
  const payload = {
    game_id: String(formData.get('game_id') ?? '') || null,
    session_date: String(formData.get('session_date') ?? new Date().toISOString().slice(0, 10)),
    start_time: String(formData.get('start_time') ?? '') || null,
    end_time: String(formData.get('end_time') ?? '') || null,
    hours_worked: Number(formData.get('hours_worked') ?? 0),
    build_version: String(formData.get('build_version') ?? ''),
    device_environment: String(formData.get('device_environment') ?? ''),
    test_scope: String(formData.get('test_scope') ?? ''),
    notes: String(formData.get('notes') ?? ''),
    status: 'abierta'
  };
  const { error } = await supabase.from('testing_sessions').insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath('/testing');
}

export async function createBugReportAction(formData: FormData) {
  if (!isSupabaseConfigured()) redirect('/testing?demoMode=1');
  const supabase = await createSupabaseServerClient();
  const payload = {
    game_id: String(formData.get('game_id') ?? '') || null,
    title: String(formData.get('title') ?? ''),
    description: String(formData.get('description') ?? ''),
    steps_to_reproduce: String(formData.get('steps_to_reproduce') ?? ''),
    expected_result: String(formData.get('expected_result') ?? ''),
    actual_result: String(formData.get('actual_result') ?? ''),
    severity: String(formData.get('severity') ?? 'media'),
    priority: String(formData.get('priority') ?? 'Media'),
    assigned_area: String(formData.get('assigned_area') ?? 'Programación'),
    assigned_to_name: String(formData.get('assigned_to_name') ?? ''),
    build_version: String(formData.get('build_version') ?? ''),
    environment: String(formData.get('environment') ?? ''),
    status: 'abierto'
  };
  const { error } = await supabase.from('testing_bug_reports').insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath('/testing');
}

export async function createBugReviewAction(formData: FormData) {
  if (!isSupabaseConfigured()) redirect('/testing?demoMode=1');
  const supabase = await createSupabaseServerClient();
  const payload = {
    bug_id: String(formData.get('bug_id') ?? ''),
    reviewer_name: String(formData.get('reviewer_name') ?? ''),
    reviewer_area: String(formData.get('reviewer_area') ?? ''),
    review_status: String(formData.get('review_status') ?? 'pendiente'),
    technical_comment: String(formData.get('technical_comment') ?? ''),
    fix_version: String(formData.get('fix_version') ?? ''),
    fix_commit_url: String(formData.get('fix_commit_url') ?? '')
  };
  const { error } = await supabase.from('testing_bug_reviews').insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath('/testing');
}
