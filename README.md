# NOVA Casino Studio Platform

Plataforma web editable para administrar el desarrollo completo de juegos de casino / mini games: creativo, arte, audio, matemática, simulaciones, programación, QA, homologación, certificación, documentos, demos, tareas, roles y usuarios.

Este paquete convierte la maqueta `index.html` en un ambiente real basado en **Next.js + TypeScript + Supabase + PostgreSQL + Supabase Storage + Supabase Auth**.

## Qué incluye

- Dashboard general.
- Catálogo de juegos.
- Página individual por juego.
- Formulario de creación/edición de juegos.
- Biblioteca documental con carga a Supabase Storage.
- Kanban de tareas.
- Módulo inicial de estadísticas con Recharts.
- Módulo de homologación/certificación.
- Módulo de usuarios, roles y permisos.
- Esquema SQL completo.
- Políticas Row Level Security.
- Datos demo iniciales: Mini Ruleta, Inflar Globos, Ruleta Calle, Plinko, Avión, Carreritas y Mini Minas.
- Fallback demo: si no configuras Supabase, la app abre con datos locales para revisar diseño.

## Instalación local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre:

```bash
http://localhost:3000
```

## Activar Supabase

1. Crea un proyecto en Supabase.
2. Copia URL y anon key a `.env.local`.
3. Ejecuta los SQL en la carpeta `database/` en este orden:
   - `00_extensions.sql`
   - `01_schema.sql`
   - `02_policies.sql`
   - `03_seed.sql`
4. Crea usuarios en Supabase Auth.
5. Inserta perfil y rol admin según `database/README_SQL.md`.
6. Reinicia `npm run dev`.

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STORAGE_BUCKET=nova-files
```

## Despliegue web

Recomendado:

- Frontend: Vercel.
- Backend/base de datos/auth/storage: Supabase.

Pasos:

1. Sube el repo a GitHub.
2. Conecta el repo a Vercel.
3. Agrega variables de entorno en Vercel.
4. Ejecuta SQL en Supabase.
5. Verifica login y permisos.

## Estructura

```text
app/
  (auth)/login/
  (app)/dashboard/
  (app)/games/
  (app)/documents/
  (app)/tasks/
  (app)/statistics/
  (app)/homologation/
  (app)/admin/users/
components/
lib/
  supabase/
  data.ts
  demo-data.ts
  permissions.ts
  types.ts
database/
```

## Módulos de producción contemplados

Cada juego puede crecer con estos submódulos:

- Resumen.
- Creatividad.
- Arte.
- Audio.
- Matemática.
- Simulaciones.
- Programación.
- QA.
- Bugs.
- Homologación.
- Certificación.
- Demos.
- Mercado.
- Documentos.
- Historial.
- Comentarios.

## Roles

- Administrador.
- Productor.
- Diseñador.
- Animador.
- Programador.
- Matemático.
- QA Tester.
- Audio Designer.
- Cliente.
- Laboratorio certificador.
- Viewer / invitado.

Los permisos están definidos en `lib/permissions.ts` y en SQL mediante `roles`, `permissions` y `role_permissions`.

## Nota importante

Esta es una primera versión funcional de ambiente. No es todavía el producto terminado completo. Ya deja lista la base para que el equipo conecte CRUD profundo por cada submódulo y mejore componentes específicos como drag & drop, aprobación visual de assets, reproductores avanzados, comparación de versiones, firmas de certificación y reportes exportables.
