import { getDocuments, getGames } from '@/lib/data';
import { FileUploader } from './FileUploader';

export default async function DocumentsPage() {
  const [documents, games] = await Promise.all([getDocuments(), getGames()]);
  return (
    <div className="space-y-7">
      <section>
        <div className="nova-label">Biblioteca documental</div>
        <h1 className="nova-title mt-2">Documentos y archivos</h1>
        <p className="nova-subtitle">Sube, clasifica, versiona y controla documentos, reportes, builds, demos, videos, audios, imágenes, certificados y evidencias.</p>
      </section>
      <FileUploader games={games} />
      <section className="nova-card-pad overflow-x-auto">
        <table className="nova-table">
          <thead><tr><th>Nombre</th><th>Categoría</th><th>Juego</th><th>Versión</th><th>Estado</th><th>Fecha</th></tr></thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td className="font-medium text-white">{doc.name}</td>
                <td>{doc.category}</td>
                <td>{doc.game_name ?? 'General'}</td>
                <td>{doc.version}</td>
                <td>{doc.status}</td>
                <td>{doc.created_at?.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
