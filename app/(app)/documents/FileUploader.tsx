'use client';

import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import type { Game } from '@/lib/types';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const categories = [
  'Documento general', 'Documento técnico', 'Documento matemático', 'Guía gráfica', 'Lista de assets', 'Tabla de pagos',
  'Reporte de simulación', 'Reporte QA', 'Evidencia homologación', 'Certificado', 'Manual operación', 'Manual instalación',
  'Build', 'Demo', 'Video', 'Audio', 'Imagen'
];

export function FileUploader({ games }: { games: Game[] }) {
  const [loading, setLoading] = useState(false);

  async function upload(formData: FormData) {
    const file = formData.get('file') as File | null;
    if (!file) return;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      toast.warning('Modo demo: configura Supabase para subir archivos reales.');
      return;
    }
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const bucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET || 'nova-files';
    const path = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
    if (uploadError) {
      setLoading(false);
      toast.error(uploadError.message);
      return;
    }
    const { error } = await supabase.from('documents').insert({
      name: String(formData.get('name') || file.name),
      category: String(formData.get('category') || 'Documento general'),
      game_id: String(formData.get('game_id') || '') || null,
      version: String(formData.get('version') || 'v0.1'),
      status: String(formData.get('status') || 'Subido'),
      storage_path: path,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      toast.success('Archivo subido y documentado.');
      window.location.reload();
    }
  }

  return (
    <section className="nova-card-pad">
      <h2 className="flex items-center gap-2 font-display text-lg font-bold"><UploadCloud size={18} /> Subir archivo</h2>
      <form action={upload} className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        <input name="name" className="nova-input" placeholder="Nombre visible" />
        <select name="category" className="nova-select">{categories.map((c) => <option key={c}>{c}</option>)}</select>
        <select name="game_id" className="nova-select"><option value="">General</option>{games.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}</select>
        <input name="version" className="nova-input" defaultValue="v0.1" />
        <input name="file" type="file" className="nova-input" required />
        <button disabled={loading} className="nova-btn-primary">{loading ? 'Subiendo…' : 'Subir'}</button>
      </form>
    </section>
  );
}
