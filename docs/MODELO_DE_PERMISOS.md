# Modelo de permisos

## Principio

Cada usuario puede tener uno o varios roles. Cada rol tiene permisos. Las políticas RLS preguntan por `public.has_permission('permiso')`.

## Vistas sugeridas

- Ejecutiva: Productor, Cliente, Viewer.
- Técnica: Programador, QA, Homologación.
- Diseño: Diseñador, Animador.
- Matemática: Matemático, Laboratorio.
- Certificación: Productor, Laboratorio, Administrador.

## Permisos clave

- games.read
- games.write
- games.delete
- creative.write
- art.write
- audio.write
- math.write
- development.write
- qa.write
- homologation.write
- certification.write
- documents.read
- documents.write
- documents.delete
- tasks.read
- tasks.write
- users.manage
- settings.manage
- approvals.manage

## Reglas recomendadas

- Cliente no ve documentos internos salvo `access_level = client` o `public`.
- Laboratorio solo ve documentos `lab`, `public` y datos de matemática/homologación/certificación.
- Viewer solo lectura.
- Admin puede todo.
- Productor puede aprobar o rechazar entregables.
