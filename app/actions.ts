'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';

const gameSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  game_type: z.string().optional(),
  theme: z.string().optional(),
  stage: z.string().default('concepto'),
  progress: z.coerce.number().min(0).max(100).default(0),
  priority: z.string().optional(),
  owner_name: z.string().optional(),
  estimated_delivery: z.string().optional()
});

export async function createGameAction(formData: FormData) {
  if (!isSupabaseConfigured()) redirect('/games?demoMode=1');
  const supabase = await createSupabaseServerClient();
  const parsed = gameSchema.parse(Object.fromEntries(formData.entries()));

  const { error } = await supabase.from('games').insert({
    ...parsed,
    area_progress: { arte: 0, musica: 0, sonidos: 0, matematica: 0, programacion: 0, qa: 0, homologacion: 0, certificacion: 0 },
    risks: [],
    next_steps: []
  });

  if (error) throw new Error(error.message);
  revalidatePath('/games');
  redirect(`/games/${parsed.slug}`);
}

export async function updateGameAction(id: string, formData: FormData) {
  if (!isSupabaseConfigured()) redirect('/games?demoMode=1');
  const supabase = await createSupabaseServerClient();
  const parsed = gameSchema.partial().parse(Object.fromEntries(formData.entries()));
  const { error } = await supabase.from('games').update(parsed).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/games');
}

export async function createTaskAction(formData: FormData) {
  if (!isSupabaseConfigured()) redirect('/tasks?demoMode=1');
  const supabase = await createSupabaseServerClient();
  const payload = {
    title: String(formData.get('title') ?? ''),
    description: String(formData.get('description') ?? ''),
    game_id: String(formData.get('game_id') ?? '') || null,
    area: String(formData.get('area') ?? 'Programación'),
    owner_name: String(formData.get('owner_name') ?? ''),
    priority: String(formData.get('priority') ?? 'Media'),
    status: String(formData.get('status') ?? 'pendiente'),
    due_date: String(formData.get('due_date') ?? '') || null
  };
  const { error } = await supabase.from('tasks').insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath('/tasks');
}

export async function updateTaskStatusAction(id: string, status: string) {
  if (!isSupabaseConfigured()) redirect('/tasks?demoMode=1');
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('tasks').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/tasks');
}
