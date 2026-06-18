-- NOVA Casino Studio - esquema base Supabase/PostgreSQL
-- Ejecutar en Supabase SQL Editor en este orden: 00_extensions, 01_schema, 02_policies, 03_seed.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  company text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  description text
);

create table if not exists public.role_permissions (
  role_id uuid references public.roles(id) on delete cascade,
  permission_id uuid references public.permissions(id) on delete cascade,
  primary key(role_id, permission_id)
);

create table if not exists public.user_roles (
  user_id uuid references public.profiles(id) on delete cascade,
  role_id uuid references public.roles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(user_id, role_id)
);

create table if not exists public.status_catalog (
  id uuid primary key default gen_random_uuid(),
  scope text not null,
  key text not null,
  label text not null,
  color text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  unique(scope, key)
);

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  game_type text,
  theme text,
  target_audience text,
  complexity text,
  stage text not null default 'concepto',
  progress int not null default 0 check(progress between 0 and 100),
  priority text default 'Media',
  owner_id uuid references public.profiles(id),
  owner_name text,
  estimated_delivery text,
  area_progress jsonb not null default '{"arte":0,"musica":0,"sonidos":0,"matematica":0,"programacion":0,"qa":0,"homologacion":0,"certificacion":0}',
  risks text[] not null default '{}',
  next_steps text[] not null default '{}',
  confidentiality text not null default 'internal',
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.game_creative (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  narrative_concept text,
  ambience text,
  story text,
  player_experience text,
  visual_references text,
  moodboard_url text,
  color_palette jsonb not null default '[]',
  graphic_style text,
  character_type text,
  scenario_type text,
  emotional_feeling text,
  creative_differentiator text,
  version text default 'v0.1',
  status text default 'borrador',
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.file_uploads (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'nova-files',
  storage_path text not null,
  file_name text not null,
  mime_type text,
  file_size bigint,
  checksum text,
  access_level text not null default 'internal',
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique(bucket, storage_path)
);

create table if not exists public.art_assets (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  name text not null,
  asset_type text not null,
  status text not null default 'pendiente',
  owner_id uuid references public.profiles(id),
  owner_name text,
  due_date date,
  version text default 'v0.1',
  file_id uuid references public.file_uploads(id),
  comments text,
  approval_status text default 'pendiente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.audio_assets (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  name text not null,
  audio_type text not null,
  duration_seconds numeric,
  format text,
  file_size bigint,
  owner_id uuid references public.profiles(id),
  owner_name text,
  status text default 'pendiente',
  version text default 'v0.1',
  file_id uuid references public.file_uploads(id),
  comments text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.math_models (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  rtp_target numeric(6,3),
  rtp_observed numeric(6,3),
  volatility text,
  hit_frequency numeric(8,4),
  math_cycle text,
  min_bet numeric(12,2),
  max_bet numeric(12,2),
  denominations text[],
  bonus_frequency numeric(10,6),
  jackpot_frequency numeric(10,6),
  simulated_plays bigint default 0,
  expected_result numeric(14,4),
  real_result numeric(14,4),
  statistical_delta numeric(14,6),
  approval_status text default 'en_desarrollo',
  version text default 'v0.1',
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.paytables (
  id uuid primary key default gen_random_uuid(),
  math_model_id uuid references public.math_models(id) on delete cascade,
  game_id uuid references public.games(id) on delete cascade,
  symbol_or_event text not null,
  payout text not null,
  probability numeric(18,12),
  frequency_label text,
  sort_order int default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.simulations (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  math_model_id uuid references public.math_models(id) on delete set null,
  name text not null,
  plays bigint not null,
  rtp_expected numeric(6,3),
  rtp_observed numeric(6,3),
  deviation numeric(8,5),
  hit_frequency numeric(8,4),
  volatility numeric(14,6),
  max_prize numeric(14,2),
  avg_prize numeric(14,6),
  bonus_frequency numeric(10,6),
  jackpot_frequency numeric(10,6),
  report_file_id uuid references public.file_uploads(id),
  status text default 'borrador',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.simulation_results (
  id uuid primary key default gen_random_uuid(),
  simulation_id uuid not null references public.simulations(id) on delete cascade,
  metric_key text not null,
  metric_label text,
  metric_value numeric,
  payload jsonb default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.development_builds (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  build_version text not null,
  engine text,
  repository_url text,
  modules_done text[] default '{}',
  modules_pending text[] default '{}',
  bugs_open int default 0,
  bugs_fixed int default 0,
  asset_integration_status text,
  audio_integration_status text,
  math_integration_status text,
  cash_system_status text,
  sas_aft_status text,
  build_file_id uuid references public.file_uploads(id),
  demo_url text,
  status text default 'alpha',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.demos (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  name text not null,
  demo_type text not null,
  version text default 'v0.1',
  upload_date date default current_date,
  release_notes text,
  status text default 'interna',
  playable_url text,
  download_file_id uuid references public.file_uploads(id),
  changelog_url text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  game_id uuid references public.games(id) on delete set null,
  version text default 'v0.1',
  status text default 'borrador',
  storage_path text,
  file_id uuid references public.file_uploads(id),
  file_name text,
  mime_type text,
  file_size bigint,
  comments text,
  access_level text not null default 'internal',
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.qa_tests (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  name text not null,
  description text,
  owner_id uuid references public.profiles(id),
  owner_name text,
  test_date date,
  result text,
  status text default 'no_iniciada',
  evidence_file_id uuid references public.file_uploads(id),
  comments text,
  related_bug_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bugs (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references public.games(id) on delete cascade,
  title text not null,
  description text,
  severity text default 'media',
  status text default 'abierto',
  owner_id uuid references public.profiles(id),
  owner_name text,
  evidence_file_id uuid references public.file_uploads(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz
);

alter table public.qa_tests drop constraint if exists qa_tests_related_bug_id_fkey;
alter table public.qa_tests add constraint qa_tests_related_bug_id_fkey foreign key (related_bug_id) references public.bugs(id) on delete set null;

create table if not exists public.homologation_requirements (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references public.games(id) on delete cascade,
  name text not null,
  description text,
  external_system text default 'SAS/AFT/Caja',
  status text default 'pendiente',
  owner_id uuid references public.profiles(id),
  due_date date,
  evidence_file_id uuid references public.file_uploads(id),
  comments text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.homologation_tests (
  id uuid primary key default gen_random_uuid(),
  requirement_id uuid references public.homologation_requirements(id) on delete cascade,
  game_id uuid references public.games(id) on delete cascade,
  name text not null,
  test_date date,
  result text,
  status text default 'no_iniciada',
  finding text,
  correction text,
  revalidation_date date,
  evidence_file_id uuid references public.file_uploads(id),
  created_at timestamptz not null default now()
);

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references public.games(id) on delete cascade,
  lab_name text,
  status text default 'no_iniciado',
  math_sent boolean default false,
  build_sent boolean default false,
  reports_sent boolean default false,
  evidence_sent boolean default false,
  observations text,
  requested_corrections text,
  estimated_certificate_date date,
  real_certificate_date date,
  certificate_file_id uuid references public.file_uploads(id),
  certified_version text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.market_launches (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references public.games(id) on delete cascade,
  commercial_status text default 'exploracion',
  target_client text,
  target_casino text,
  estimated_installation_date date,
  market_ready_version text,
  installation_manual_id uuid references public.file_uploads(id),
  operation_manual_id uuid references public.file_uploads(id),
  promotional_material_id uuid references public.file_uploads(id),
  technical_requirements text,
  required_equipment text,
  suggested_cabinet text,
  installation_checklist jsonb default '[]',
  launch_checklist jsonb default '[]',
  post_install_metrics jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  game_id uuid references public.games(id) on delete set null,
  area text not null,
  owner_id uuid references public.profiles(id),
  owner_name text,
  priority text default 'Media',
  due_date date,
  status text default 'pendiente',
  comments text,
  related_file_id uuid references public.file_uploads(id),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  author_id uuid references public.profiles(id),
  body text not null,
  file_id uuid references public.file_uploads(id),
  created_at timestamptz not null default now()
);

create table if not exists public.changelog (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references public.games(id) on delete cascade,
  build_id uuid references public.development_builds(id) on delete set null,
  version text not null,
  title text not null,
  description text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.version_history (
  id uuid primary key default gen_random_uuid(),
  entity_table text not null,
  entity_id uuid not null,
  version text,
  previous_data jsonb,
  new_data jsonb,
  changed_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_table text,
  entity_id uuid,
  old_status text,
  new_status text,
  payload jsonb default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  is_read boolean default false,
  entity_table text,
  entity_id uuid,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.log_activity()
returns trigger language plpgsql security definer as $$
begin
  if tg_op = 'INSERT' then
    insert into public.activity_log(actor_id, action, entity_table, entity_id, payload)
    values(auth.uid(), 'insert', tg_table_name, new.id, to_jsonb(new));
    return new;
  elsif tg_op = 'UPDATE' then
    insert into public.activity_log(actor_id, action, entity_table, entity_id, old_status, new_status, payload)
    values(
      auth.uid(),
      'update',
      tg_table_name,
      new.id,
      coalesce(to_jsonb(old)->>'status', to_jsonb(old)->>'stage'),
      coalesce(to_jsonb(new)->>'status', to_jsonb(new)->>'stage'),
      jsonb_build_object('old', to_jsonb(old), 'new', to_jsonb(new))
    );
    return new;
  elsif tg_op = 'DELETE' then
    insert into public.activity_log(actor_id, action, entity_table, entity_id, payload)
    values(auth.uid(), 'delete', tg_table_name, old.id, to_jsonb(old));
    return old;
  end if;
  return null;
end;
$$;

create or replace function public.has_role(role_key text)
returns boolean language sql stable security definer as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid() and r.key = role_key
  );
$$;

create or replace function public.has_permission(permission_key text)
returns boolean language sql stable security definer as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.role_permissions rp on rp.role_id = ur.role_id
    join public.permissions p on p.id = rp.permission_id
    where ur.user_id = auth.uid() and p.key = permission_key
  ) or public.has_role('admin');
$$;

create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
create trigger games_touch before update on public.games for each row execute function public.touch_updated_at();
create trigger tasks_touch before update on public.tasks for each row execute function public.touch_updated_at();
create trigger documents_touch before update on public.documents for each row execute function public.touch_updated_at();
create trigger art_assets_touch before update on public.art_assets for each row execute function public.touch_updated_at();
create trigger audio_assets_touch before update on public.audio_assets for each row execute function public.touch_updated_at();

create trigger games_log after insert or update or delete on public.games for each row execute function public.log_activity();
create trigger tasks_log after insert or update or delete on public.tasks for each row execute function public.log_activity();
create trigger documents_log after insert or update or delete on public.documents for each row execute function public.log_activity();
