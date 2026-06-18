import { ROLE_PERMISSIONS } from '@/lib/permissions';

const roleLabels: Record<string, string> = {
  admin: 'Administrador', producer: 'Productor', designer: 'Diseñador', animator: 'Animador', developer: 'Programador',
  mathematician: 'Matemático', qa_tester: 'QA Tester', audio_designer: 'Audio Designer', client: 'Cliente', lab_certifier: 'Laboratorio certificador', viewer: 'Viewer / invitado'
};

export default function UsersPage() {
  return (
    <div className="space-y-7">
      <section>
        <div className="nova-label">Control de acceso</div>
        <h1 className="nova-title mt-2">Usuarios, roles y permisos</h1>
        <p className="nova-subtitle">El alta real de usuarios se hace desde Supabase Auth o desde una función administrativa con service role. Aquí queda el mapa funcional de permisos.</p>
      </section>
      <section className="nova-card-pad overflow-x-auto">
        <table className="nova-table">
          <thead><tr><th>Rol</th><th>Permisos principales</th></tr></thead>
          <tbody>
            {Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => (
              <tr key={role}>
                <td className="font-semibold text-white">{roleLabels[role]}</td>
                <td>{permissions.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
