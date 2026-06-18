export default function SettingsPage() {
  return (
    <div className="space-y-7">
      <section>
        <div className="nova-label">Administración</div>
        <h1 className="nova-title mt-2">Configuración</h1>
        <p className="nova-subtitle">Catálogos editables: estados, áreas, tipos de documento, roles, permisos, buckets de storage, vistas por rol, niveles de confidencialidad y reglas de aprobación.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {['Estados de juego', 'Estados de arte', 'Estados QA', 'Estados certificación', 'Tipos de documento', 'Niveles de acceso'].map((name) => (
          <div key={name} className="nova-card-pad">
            <h2 className="font-display text-lg font-bold">{name}</h2>
            <p className="mt-2 text-sm text-nova-text2">CRUD conectado a tablas de catálogo en Supabase.</p>
            <button className="nova-btn mt-4">Administrar</button>
          </div>
        ))}
      </section>
    </div>
  );
}
