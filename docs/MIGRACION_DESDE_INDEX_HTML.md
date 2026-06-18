# Migración desde la maqueta index.html

La maqueta original usa React cargado por CDN y datos demo dentro del mismo archivo. Esta versión migra la idea a un proyecto Next.js.

## Qué se conserva

- Estética oscura/neón.
- Dashboard.
- Catálogo de juegos.
- Vista individual por juego.
- Vista ejecutiva/técnica.
- Estadísticas.
- Documentos.
- Tareas.

## Qué cambia

- Los datos dejan de vivir en constantes JavaScript.
- La información se guarda en PostgreSQL.
- Los archivos se suben a Supabase Storage.
- El login usa Supabase Auth.
- Los roles se controlan con RLS.
- Los cambios quedan en activity_log.

## Qué falta implementar en fases siguientes

- Drag & drop real en kanban.
- Subformularios avanzados por cada sección.
- Signed URLs para descargas privadas.
- Notificaciones en tiempo real.
- Aprobaciones visuales.
- Exportación de reportes.
- Comentarios por coordenada en imágenes.
