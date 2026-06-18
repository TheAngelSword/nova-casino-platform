# Orden de ejecución SQL

1. Abre Supabase → SQL Editor.
2. Ejecuta `00_extensions.sql`.
3. Ejecuta `01_schema.sql`.
4. Ejecuta `02_policies.sql`.
5. Ejecuta `03_seed.sql`.
6. Crea tu primer usuario desde Supabase Auth.
7. Inserta su perfil y asígnale rol administrador:

```sql
insert into public.profiles(id, full_name)
values ('ID_DEL_USUARIO_AUTH', 'Administrador NOVA')
on conflict(id) do update set full_name = excluded.full_name;

insert into public.user_roles(user_id, role_id)
select 'ID_DEL_USUARIO_AUTH', id from public.roles where key = 'admin'
on conflict do nothing;
```

El bucket `nova-files` se crea en `02_policies.sql`. Si Supabase no permite crearlo desde SQL en tu proyecto, créalo manualmente en Storage con modo privado.
