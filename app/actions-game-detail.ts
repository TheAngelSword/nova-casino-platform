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

export async function updateGameSummaryAction(gameId: string, formData: FormData) {
  const supabase = createSupabaseServerClient();

  const { data: currentGame, error: currentError } = await supabase
    .from('games')
    .select('slug')
    .eq('id', gameId)
    .single();

  if (currentError || !currentGame) {
    redirect('/games?error=juego-no-encontrado');
  }

  const currentSlug = currentGame.slug as string;
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

  if (error) {
    console.error('updateGameSummaryAction error:', error.message);
    redirect(`/games/${currentSlug}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/dashboard');
  revalidatePath('/games');
  revalidatePath('/slots');
  revalidatePath(`/games/${currentSlug}`);
  revalidatePath(`/games/${nextSlug}`);
  redirect(`/games/${nextSlug}`);
}

export async function updateGameAreaProgressAction(gameId: string, formData: FormData) {
  const supabase = createSupabaseServerClient();

  const { data: currentGame, error: currentError } = await supabase
    .from('games')
    .select('slug, area_progress')
    .eq('id', gameId)
    .single();

  if (currentError || !currentGame) {
    redirect('/games?error=juego-no-encontrado');
  }

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

  if (error) {
    console.error('updateGameAreaProgressAction error:', error.message);
    redirect(`/games/${currentSlug}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/dashboard');
  revalidatePath('/games');
  revalidatePath('/slots');
  revalidatePath(`/games/${currentSlug}`);
  redirect(`/games/${currentSlug}`);
}
