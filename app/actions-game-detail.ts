'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function optionalText(formData: FormData, key: string) {
  const value = textValue(formData, key);
  return value.length ? value : null;
}

function optionalNumber(formData: FormData, key: string) {
  const value = textValue(formData, key);
  if (!value.length) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function optionalDate(formData: FormData, key: string) {
  const value = textValue(formData, key);
  return value.length ? value : null;
}

function clampPercent(value: unknown) {
  const number = Number(value);
  if (Number.isNaN(number)) return 0;
  return Math.max(0, Math.min(100, Math.round(number)));
}

function normalizeSlug(value: string, fallback: string) {
  const clean = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return clean || fallback;
}

async function getCurrentGame(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>, gameId: string) {
  const { data, error } = await supabase
    .from('games')
    .select('id, slug')
    .eq('id', gameId)
    .single();

  if (error || !data) redirect('/games?error=juego-no-encontrado');
  return data as { id: string; slug: string };
}

function redirectWithError(slug: string, message: string) {
  redirect(`/games/${slug}?error=${encodeURIComponent(message)}`);
}

function redirectWithSuccess(slug: string, message: string) {
  redirect(`/games/${slug}?success=${encodeURIComponent(message)}`);
}

function buildTitle(formData: FormData, fallback: string) {
  return textValue(formData, 'title') || fallback;
}

export async function updateGameSummaryAction(gameId: string, formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const currentGame = await getCurrentGame(supabase, gameId);
  const currentSlug = currentGame.slug;

  const requestedSlug = textValue(formData, 'slug');
  const nextSlug = normalizeSlug(requestedSlug, currentSlug);

  const payload = {
    name: textValue(formData, 'name'),
    slug: nextSlug,
    stage: optionalText(formData, 'stage'),
    progress: clampPercent(formData.get('progress')),
    game_type: optionalText(formData, 'game_type'),
    theme: optionalText(formData, 'theme')
  };

  const { error } = await supabase
    .from('games')
    .update(payload)
    .eq('id', gameId);

  if (error) redirectWithError(currentSlug, error.message);

  revalidatePath('/dashboard');
  revalidatePath('/games');
  revalidatePath('/slots');
  revalidatePath(`/games/${currentSlug}`);
  revalidatePath(`/games/${nextSlug}`);
  redirect(`/games/${nextSlug}`);
}

export async function updateGameAreaProgressAction(gameId: string, formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const { data: currentGame, error: currentError } = await supabase
    .from('games')
    .select('slug, area_progress')
    .eq('id', gameId)
    .single();

  if (currentError || !currentGame) redirect('/games?error=juego-no-encontrado');

  const currentSlug = currentGame.slug as string;
  const existing = (currentGame.area_progress ?? {}) as Record<string, number>;

  const nextAreaProgress: Record<string, number> = {
    ...existing,
    qa: clampPercent(formData.get('qa')),
    arte: clampPercent(formData.get('arte')),
    matematica: clampPercent(formData.get('matematica')),
    programacion: clampPercent(formData.get('programacion')),
    homologacion: clampPercent(formData.get('homologacion')),
    certificacion: clampPercent(formData.get('certificacion'))
  };

  const average = Math.round(
    Object.values(nextAreaProgress).reduce((total, value) => total + Number(value || 0), 0) /
      Math.max(Object.values(nextAreaProgress).length, 1)
  );

  const { error } = await supabase
    .from('games')
    .update({
      area_progress: nextAreaProgress,
      progress: average
    })
    .eq('id', gameId);

  if (error) redirectWithError(currentSlug, error.message);

  revalidatePath('/dashboard');
  revalidatePath('/games');
  revalidatePath('/slots');
  revalidatePath(`/games/${currentSlug}`);
  redirect(`/games/${currentSlug}`);
}

export async function createProductionRecordAction(gameId: string, sectionKey: string, formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const currentGame = await getCurrentGame(supabase, gameId);
  const slug = currentGame.slug;

  const title = buildTitle(formData, 'Nuevo registro');
  const description = optionalText(formData, 'description');
  const notes = optionalText(formData, 'notes');
  const status = optionalText(formData, 'status') ?? 'pendiente';
  const ownerName = optionalText(formData, 'owner_name');
  const version = optionalText(formData, 'version') ?? 'v0.1';
  const url = optionalText(formData, 'url');
  const date = optionalDate(formData, 'date');

  let errorMessage: string | null = null;

  if (sectionKey === 'creative') {
    const { error } = await supabase.from('game_creative').insert({
      game_id: gameId,
      narrative_concept: title,
      ambience: description,
      creative_differentiator: notes,
      version,
      status
    });
    errorMessage = error?.message ?? null;
  } else if (sectionKey === 'art') {
    const { error } = await supabase.from('art_assets').insert({
      game_id: gameId,
      name: title,
      asset_type: description ?? 'General',
      status,
      owner_name: ownerName,
      version,
      comments: notes,
      approval_status: status
    });
    errorMessage = error?.message ?? null;
  } else if (sectionKey === 'audio') {
    const { error } = await supabase.from('audio_assets').insert({
      game_id: gameId,
      name: title,
      audio_type: description ?? 'General',
      status,
      owner_name: ownerName,
      version,
      comments: notes
    });
    errorMessage = error?.message ?? null;
  } else if (sectionKey === 'math') {
    const { error } = await supabase.from('math_models').insert({
      game_id: gameId,
      version,
      volatility: title,
      rtp_target: optionalNumber(formData, 'rtp_target'),
      rtp_observed: optionalNumber(formData, 'rtp_observed'),
      hit_frequency: optionalNumber(formData, 'hit_frequency'),
      math_cycle: description,
      approval_status: status,
      real_result: optionalNumber(formData, 'real_result'),
      expected_result: optionalNumber(formData, 'expected_result')
    });
    errorMessage = error?.message ?? null;
  } else if (sectionKey === 'programming') {
    const { error } = await supabase.from('development_builds').insert({
      game_id: gameId,
      build_version: version || title,
      engine: description,
      repository_url: url,
      status,
      bugs_open: Math.max(0, Number(optionalNumber(formData, 'bugs_open') ?? 0)),
      bugs_fixed: Math.max(0, Number(optionalNumber(formData, 'bugs_fixed') ?? 0)),
      asset_integration_status: notes
    });
    errorMessage = error?.message ?? null;
  } else if (sectionKey === 'qa') {
    const { error } = await supabase.from('qa_tests').insert({
      game_id: gameId,
      name: title,
      description,
      owner_name: ownerName,
      test_date: date,
      result: optionalText(formData, 'result'),
      status,
      comments: notes
    });
    errorMessage = error?.message ?? null;
  } else if (sectionKey === 'homologation') {
    const { error } = await supabase.from('homologation_requirements').insert({
      game_id: gameId,
      name: title,
      description,
      external_system: optionalText(formData, 'external_system') ?? 'SAS/AFT/Caja',
      status,
      due_date: date,
      comments: notes
    });
    errorMessage = error?.message ?? null;
  } else if (sectionKey === 'market') {
    const { error } = await supabase.from('market_launches').insert({
      game_id: gameId,
      commercial_status: status,
      target_client: title,
      target_casino: description,
      market_ready_version: version,
      technical_requirements: notes,
      required_equipment: optionalText(formData, 'required_equipment'),
      suggested_cabinet: optionalText(formData, 'suggested_cabinet')
    });
    errorMessage = error?.message ?? null;
  } else {
    errorMessage = `Sección no reconocida: ${sectionKey}`;
  }

  if (errorMessage) redirectWithError(slug, errorMessage);

  await supabase.from('activity_log').insert({
    action: `Crear registro ${sectionKey}`,
    entity_table: sectionKey,
    entity_id: gameId,
    payload: { title, status, version }
  });

  revalidatePath('/dashboard');
  revalidatePath('/games');
  revalidatePath(`/games/${slug}`);
  redirectWithSuccess(slug, 'Registro creado correctamente');
}

export async function createGameDocumentReferenceAction(gameId: string, sectionKey: string, formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const currentGame = await getCurrentGame(supabase, gameId);
  const slug = currentGame.slug;

  const name = buildTitle(formData, 'Archivo del juego');
  const storagePath = optionalText(formData, 'storage_path') ?? optionalText(formData, 'url');
  const fileName = optionalText(formData, 'file_name') ?? storagePath?.split('/').filter(Boolean).pop() ?? name;

  const categoryMap: Record<string, string> = {
    creative: 'Creativo',
    art: 'Arte y diseño',
    audio: 'Música y sonido',
    math: 'Matemática',
    programming: 'Programación',
    qa: 'QA y pruebas',
    homologation: 'Homologación / certificación',
    market: 'Mercado y demos'
  };

  const { error } = await supabase.from('documents').insert({
    name,
    category: categoryMap[sectionKey] ?? sectionKey,
    game_id: gameId,
    version: optionalText(formData, 'version') ?? 'v0.1',
    status: optionalText(formData, 'status') ?? 'registrado',
    storage_path: storagePath,
    file_name: fileName,
    comments: optionalText(formData, 'notes')
  });

  if (error) redirectWithError(slug, error.message);

  await supabase.from('activity_log').insert({
    action: `Registrar archivo ${sectionKey}`,
    entity_table: 'documents',
    entity_id: gameId,
    payload: { name, category: categoryMap[sectionKey] ?? sectionKey }
  });

  revalidatePath('/documents');
  revalidatePath(`/games/${slug}`);
  redirectWithSuccess(slug, 'Archivo registrado correctamente');
}
