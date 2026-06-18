-- Row Level Security - NOVA Casino Studio

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.user_roles enable row level security;
alter table public.status_catalog enable row level security;
alter table public.games enable row level security;
alter table public.game_creative enable row level security;
alter table public.file_uploads enable row level security;
alter table public.art_assets enable row level security;
alter table public.audio_assets enable row level security;
alter table public.math_models enable row level security;
alter table public.paytables enable row level security;
alter table public.simulations enable row level security;
alter table public.simulation_results enable row level security;
alter table public.development_builds enable row level security;
alter table public.demos enable row level security;
alter table public.documents enable row level security;
alter table public.qa_tests enable row level security;
alter table public.bugs enable row level security;
alter table public.homologation_requirements enable row level security;
alter table public.homologation_tests enable row level security;
alter table public.certifications enable row level security;
alter table public.market_launches enable row level security;
alter table public.tasks enable row level security;
alter table public.task_comments enable row level security;
alter table public.changelog enable row level security;
alter table public.version_history enable row level security;
alter table public.activity_log enable row level security;
alter table public.notifications enable row level security;

-- Lectura general para usuarios autenticados, con restricción de documentos por access_level.
create policy profiles_read on public.profiles for select to authenticated using (id = auth.uid() or public.has_permission('users.manage'));
create policy profiles_update_self on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy roles_read on public.roles for select to authenticated using (true);
create policy permissions_read on public.permissions for select to authenticated using (true);
create policy role_permissions_read on public.role_permissions for select to authenticated using (true);
create policy user_roles_read on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_permission('users.manage'));
create policy user_roles_manage on public.user_roles for all to authenticated using (public.has_permission('users.manage')) with check (public.has_permission('users.manage'));

create policy status_read on public.status_catalog for select to authenticated using (true);
create policy status_manage on public.status_catalog for all to authenticated using (public.has_permission('settings.manage')) with check (public.has_permission('settings.manage'));

create policy games_read on public.games for select to authenticated using (deleted_at is null and public.has_permission('games.read'));
create policy games_insert on public.games for insert to authenticated with check (public.has_permission('games.write'));
create policy games_update on public.games for update to authenticated using (public.has_permission('games.write')) with check (public.has_permission('games.write'));
create policy games_delete on public.games for delete to authenticated using (public.has_permission('games.delete'));

create policy creative_read on public.game_creative for select to authenticated using (public.has_permission('games.read'));
create policy creative_write on public.game_creative for all to authenticated using (public.has_permission('creative.write')) with check (public.has_permission('creative.write'));

create policy files_read on public.file_uploads for select to authenticated using (
  access_level in ('public','client','lab','internal') and public.has_permission('documents.read')
);
create policy files_write on public.file_uploads for insert to authenticated with check (public.has_permission('documents.write'));
create policy files_update on public.file_uploads for update to authenticated using (public.has_permission('documents.write')) with check (public.has_permission('documents.write'));

create policy art_read on public.art_assets for select to authenticated using (public.has_permission('games.read'));
create policy art_write on public.art_assets for all to authenticated using (public.has_permission('art.write')) with check (public.has_permission('art.write'));

create policy audio_read on public.audio_assets for select to authenticated using (public.has_permission('games.read'));
create policy audio_write on public.audio_assets for all to authenticated using (public.has_permission('audio.write')) with check (public.has_permission('audio.write'));

create policy math_read on public.math_models for select to authenticated using (public.has_permission('games.read'));
create policy math_write on public.math_models for all to authenticated using (public.has_permission('math.write')) with check (public.has_permission('math.write'));
create policy paytables_read on public.paytables for select to authenticated using (public.has_permission('games.read'));
create policy paytables_write on public.paytables for all to authenticated using (public.has_permission('math.write')) with check (public.has_permission('math.write'));

create policy simulations_read on public.simulations for select to authenticated using (public.has_permission('games.read'));
create policy simulations_write on public.simulations for all to authenticated using (public.has_permission('math.write')) with check (public.has_permission('math.write'));
create policy simulation_results_read on public.simulation_results for select to authenticated using (public.has_permission('games.read'));
create policy simulation_results_write on public.simulation_results for all to authenticated using (public.has_permission('math.write')) with check (public.has_permission('math.write'));

create policy builds_read on public.development_builds for select to authenticated using (public.has_permission('games.read'));
create policy builds_write on public.development_builds for all to authenticated using (public.has_permission('development.write')) with check (public.has_permission('development.write'));

create policy demos_read on public.demos for select to authenticated using (public.has_permission('games.read'));
create policy demos_write on public.demos for all to authenticated using (public.has_permission('development.write')) with check (public.has_permission('development.write'));

create policy documents_read on public.documents for select to authenticated using (
  deleted_at is null and public.has_permission('documents.read') and (
    access_level = 'internal'
    or access_level = 'public'
    or (access_level = 'client' and (public.has_role('client') or public.has_role('admin') or public.has_role('producer')))
    or (access_level = 'lab' and (public.has_role('lab_certifier') or public.has_role('admin') or public.has_role('producer')))
  )
);
create policy documents_insert on public.documents for insert to authenticated with check (public.has_permission('documents.write'));
create policy documents_update on public.documents for update to authenticated using (public.has_permission('documents.write')) with check (public.has_permission('documents.write'));
create policy documents_delete on public.documents for delete to authenticated using (public.has_permission('documents.delete'));

create policy qa_read on public.qa_tests for select to authenticated using (public.has_permission('games.read'));
create policy qa_write on public.qa_tests for all to authenticated using (public.has_permission('qa.write')) with check (public.has_permission('qa.write'));
create policy bugs_read on public.bugs for select to authenticated using (public.has_permission('games.read'));
create policy bugs_write on public.bugs for all to authenticated using (public.has_permission('qa.write') or public.has_permission('development.write')) with check (public.has_permission('qa.write') or public.has_permission('development.write'));

create policy homolog_read on public.homologation_requirements for select to authenticated using (public.has_permission('games.read'));
create policy homolog_write on public.homologation_requirements for all to authenticated using (public.has_permission('homologation.write')) with check (public.has_permission('homologation.write'));
create policy homolog_tests_read on public.homologation_tests for select to authenticated using (public.has_permission('games.read'));
create policy homolog_tests_write on public.homologation_tests for all to authenticated using (public.has_permission('homologation.write')) with check (public.has_permission('homologation.write'));

create policy certifications_read on public.certifications for select to authenticated using (public.has_permission('games.read'));
create policy certifications_write on public.certifications for all to authenticated using (public.has_permission('certification.write')) with check (public.has_permission('certification.write'));

create policy market_read on public.market_launches for select to authenticated using (public.has_permission('games.read'));
create policy market_write on public.market_launches for all to authenticated using (public.has_permission('games.write')) with check (public.has_permission('games.write'));

create policy tasks_read on public.tasks for select to authenticated using (deleted_at is null and public.has_permission('tasks.read'));
create policy tasks_write on public.tasks for all to authenticated using (public.has_permission('tasks.write')) with check (public.has_permission('tasks.write'));
create policy task_comments_read on public.task_comments for select to authenticated using (public.has_permission('tasks.read'));
create policy task_comments_write on public.task_comments for insert to authenticated with check (public.has_permission('tasks.write'));

create policy changelog_read on public.changelog for select to authenticated using (public.has_permission('games.read'));
create policy changelog_write on public.changelog for all to authenticated using (public.has_permission('development.write')) with check (public.has_permission('development.write'));

create policy history_read on public.version_history for select to authenticated using (public.has_permission('games.read'));
create policy activity_read on public.activity_log for select to authenticated using (public.has_permission('games.read'));
create policy notifications_read on public.notifications for select to authenticated using (user_id = auth.uid());
create policy notifications_update on public.notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Storage: crear bucket privado "nova-files" desde Supabase Storage o ejecutar:
insert into storage.buckets (id, name, public) values ('nova-files', 'nova-files', false)
on conflict (id) do nothing;

create policy "nova files authenticated upload" on storage.objects
for insert to authenticated
with check (bucket_id = 'nova-files' and public.has_permission('documents.write'));

create policy "nova files authenticated read" on storage.objects
for select to authenticated
using (bucket_id = 'nova-files' and public.has_permission('documents.read'));

create policy "nova files authenticated update" on storage.objects
for update to authenticated
using (bucket_id = 'nova-files' and public.has_permission('documents.write'))
with check (bucket_id = 'nova-files' and public.has_permission('documents.write'));

create policy "nova files authenticated delete" on storage.objects
for delete to authenticated
using (bucket_id = 'nova-files' and public.has_permission('documents.delete'));
