'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function optionalText(formData: FormData, key: string) {
  const value = textValue(formData, key);
  return value.length ? value : null;
}

function safeNumber(formData: FormData, key: string, fallback = 0) {
  const value = Number(formData.get(key) ?? fallback);
  return Number.isFinite(value) ? value : fallback;
}

function bugDetailPath(bugId: string) {
  return `/testing/bugs/${bugId}`;
}

export async function createTestingSessionAction(formData: FormData) {
  if (!isSupabaseConfigured()) redirect('/testing?demoMode=1');

  const supabase = await createSupabaseServerClient();
  const payload = {
    game_id: textValue(formData, 'game_id') || null,
    session_date: textValue(formData, 'session_date') || new Date().toISOString().slice(0, 10),
    start_time: optionalText(formData, 'start_time'),
    end_time: optionalText(formData, 'end_time'),
    hours_worked: safeNumber(formData, 'hours_worked'),
    build_version: textValue(formData, 'build_version'),
    device_environment: textValue(formData, 'device_environment'),
    test_scope: textValue(formData, 'test_scope'),
    notes: textValue(formData, 'notes'),
    status: 'abierta'
  };

  const { error } = await supabase.from('testing_sessions').insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath('/testing');
}

export async function createBugReportAction(formData: FormData) {
  if (!isSupabaseConfigured()) redirect('/testing?demoMode=1');

  const supabase = await createSupabaseServerClient();
  const imageUrl = optionalText(formData, 'image_url');
  const videoUrl = optionalText(formData, 'video_url');
  const evidenceUrl = optionalText(formData, 'evidence_url') ?? imageUrl ?? videoUrl;

  const payload = {
    game_id: textValue(formData, 'game_id') || null,
    title: textValue(formData, 'title'),
    description: textValue(formData, 'description'),
    steps_to_reproduce: textValue(formData, 'steps_to_reproduce'),
    expected_result: textValue(formData, 'expected_result'),
    actual_result: textValue(formData, 'actual_result'),
    severity: textValue(formData, 'severity') || 'media',
    priority: textValue(formData, 'priority') || 'Media',
    assigned_area: textValue(formData, 'assigned_area') || 'Programación',
    assigned_to_name: textValue(formData, 'assigned_to_name'),
    build_version: textValue(formData, 'build_version'),
    environment: textValue(formData, 'environment'),
    status: 'abierto',
    evidence_url: evidenceUrl,
    image_url: imageUrl,
    video_url: videoUrl
  };

  const { data, error } = await supabase
    .from('testing_bug_reports')
    .insert(payload)
    .select('id')
    .single();

  if (error) throw new Error(error.message);

  const bugId = data?.id as string | undefined;

  if (bugId && imageUrl) {
    await supabase.from('testing_bug_evidence').insert({
      bug_id: bugId,
      evidence_type: 'image',
      title: 'Imagen de referencia inicial',
      url: imageUrl,
      notes: 'Agregada durante el alta del bug',
      created_by_name: textValue(formData, 'reported_by_name') || null
    });
  }

  if (bugId && videoUrl) {
    await supabase.from('testing_bug_evidence').insert({
      bug_id: bugId,
      evidence_type: 'video',
      title: 'Video de referencia inicial',
      url: videoUrl,
      notes: 'Agregado durante el alta del bug',
      created_by_name: textValue(formData, 'reported_by_name') || null
    });
  }

  if (bugId && evidenceUrl && evidenceUrl !== imageUrl && evidenceUrl !== videoUrl) {
    await supabase.from('testing_bug_evidence').insert({
      bug_id: bugId,
      evidence_type: 'link',
      title: 'Referencia inicial',
      url: evidenceUrl,
      notes: 'Agregada durante el alta del bug',
      created_by_name: textValue(formData, 'reported_by_name') || null
    });
  }

  revalidatePath('/testing');
  if (bugId) redirect(bugDetailPath(bugId));
}

export async function createBugEvidenceAction(bugId: string, formData: FormData) {
  if (!isSupabaseConfigured()) redirect('/testing?demoMode=1');

  const supabase = await createSupabaseServerClient();
  const evidenceType = textValue(formData, 'evidence_type') || 'link';
  const url = textValue(formData, 'url');

  if (!url) redirect(`${bugDetailPath(bugId)}?error=${encodeURIComponent('La URL de evidencia es obligatoria')}`);

  const { error } = await supabase.from('testing_bug_evidence').insert({
    bug_id: bugId,
    evidence_type: evidenceType,
    title: optionalText(formData, 'title'),
    url,
    notes: optionalText(formData, 'notes'),
    created_by_name: optionalText(formData, 'created_by_name')
  });

  if (error) redirect(`${bugDetailPath(bugId)}?error=${encodeURIComponent(error.message)}`);

  await supabase
    .from('testing_bug_reports')
    .update({ last_reviewed_at: new Date().toISOString() })
    .eq('id', bugId);

  revalidatePath('/testing');
  revalidatePath(bugDetailPath(bugId));
  redirect(`${bugDetailPath(bugId)}?success=${encodeURIComponent('Evidencia agregada')}`);
}

export async function createBugReviewAction(formData: FormData) {
  if (!isSupabaseConfigured()) redirect('/testing?demoMode=1');

  const supabase = await createSupabaseServerClient();
  const bugId = textValue(formData, 'bug_id');
  const reviewStatus = textValue(formData, 'review_status') || 'pendiente';
  const fixedAt = reviewStatus === 'corregido' || reviewStatus === 'cerrado' ? new Date().toISOString() : null;

  const payload = {
    bug_id: bugId,
    reviewer_name: textValue(formData, 'reviewer_name'),
    reviewer_area: textValue(formData, 'reviewer_area') || 'Programación',
    review_status: reviewStatus,
    technical_comment: textValue(formData, 'technical_comment'),
    fix_version: textValue(formData, 'fix_version'),
    fix_commit_url: textValue(formData, 'fix_commit_url'),
    root_cause: textValue(formData, 'root_cause'),
    code_changes_summary: textValue(formData, 'code_changes_summary'),
    files_changed: textValue(formData, 'files_changed'),
    fix_details: textValue(formData, 'fix_details'),
    test_notes: textValue(formData, 'test_notes'),
    fixed_by_name: textValue(formData, 'fixed_by_name'),
    fixed_at: fixedAt,
    review_evidence_url: textValue(formData, 'review_evidence_url')
  };

  const { error } = await supabase.from('testing_bug_reviews').insert(payload);
  if (error) redirect(`${bugDetailPath(bugId)}?error=${encodeURIComponent(error.message)}`);

  const nextBugStatus =
    reviewStatus === 'corregido' ? 'corregido' :
    reviewStatus === 'cerrado' ? 'cerrado' :
    reviewStatus === 'rechazado' ? 'rechazado' :
    reviewStatus === 'no_reproducible' ? 'no_reproducible' :
    reviewStatus === 'duplicado' ? 'duplicado' :
    'en_revision';

  const updatePayload: Record<string, string | null> = {
    status: nextBugStatus,
    last_reviewed_at: new Date().toISOString()
  };

  if (nextBugStatus === 'cerrado') updatePayload.closed_at = new Date().toISOString();

  await supabase.from('testing_bug_reports').update(updatePayload).eq('id', bugId);

  const reviewEvidenceUrl = textValue(formData, 'review_evidence_url');
  if (reviewEvidenceUrl) {
    await supabase.from('testing_bug_evidence').insert({
      bug_id: bugId,
      evidence_type: 'link',
      title: 'Evidencia de corrección',
      url: reviewEvidenceUrl,
      notes: textValue(formData, 'test_notes'),
      created_by_name: textValue(formData, 'fixed_by_name') || textValue(formData, 'reviewer_name')
    });
  }

  revalidatePath('/testing');
  revalidatePath(bugDetailPath(bugId));
  redirect(`${bugDetailPath(bugId)}?success=${encodeURIComponent('Revisión guardada')}`);
}
