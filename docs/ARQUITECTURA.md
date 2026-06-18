# Arquitectura propuesta

## Stack recomendado

- Next.js App Router.
- React.
- TypeScript.
- Tailwind CSS.
- Supabase Auth.
- Supabase PostgreSQL.
- Supabase Storage.
- Supabase RLS.
- Recharts para visualización.
- Vercel para hosting.

Supabase es conveniente porque integra Postgres, Auth, Storage, Realtime y políticas de seguridad. Next.js App Router permite Server Components y Server Actions para mutaciones seguras del lado servidor.

## Flujo de datos

1. Usuario entra por `/login`.
2. Supabase Auth crea sesión en cookies.
3. Middleware protege rutas privadas.
4. Server Components leen datos desde Supabase.
5. Server Actions escriben en Postgres.
6. Archivos se suben a Supabase Storage.
7. Registros de documentos/assets guardan metadata y ruta del archivo.
8. RLS valida permisos por rol.

## Seguridad

- Login obligatorio.
- Rutas protegidas.
- RLS por tabla.
- Policies por permiso.
- Bucket privado.
- Soft delete para tablas críticas.
- Activity log.
- Version history.

## Evolución recomendada

### Fase 1
Login, dashboard, juegos, documentos, tareas, roles y storage.

### Fase 2
CRUD profundo por submódulo: arte, audio, matemática, QA, homologación, certificación.

### Fase 3
Revisión/aprobación, comentarios por asset, historial visual, notificaciones.

### Fase 4
Reportes exportables, simuladores, carga de CSV/Excel, comparativas avanzadas.

### Fase 5
Portal cliente/laboratorio con permisos finos por archivo y demo.
