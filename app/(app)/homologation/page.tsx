import { ShieldCheck } from 'lucide-react';

const checklist = [
  'Comunicación con sistema de caja',
  'Créditos entrantes y salientes',
  'Cashout',
  'Retiro de tarjeta durante bonus/evento',
  'Puerta abierta',
  'Pérdida de energía / AC power lost',
  'Recuperación después de apagado',
  'Logs y trazabilidad',
  'Eventos SAS / AFT',
  'Revalidación después de correcciones'
];

export default function HomologationPage() {
  return (
    <div className="space-y-7">
      <section>
        <div className="nova-label">SAS / AFT / Caja</div>
        <h1 className="nova-title mt-2">Homologación y certificación</h1>
        <p className="nova-subtitle">Módulo para requisitos, pruebas, hallazgos, correcciones, evidencias, documentos enviados, observaciones del laboratorio y certificados.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {checklist.map((item) => (
          <div key={item} className="nova-card-pad flex items-start gap-3">
            <ShieldCheck className="mt-1 text-nova-gold" size={18} />
            <div>
              <h2 className="font-display text-sm font-bold">{item}</h2>
              <p className="mt-2 text-sm text-nova-text2">Estado editable, responsable, evidencia, comentario, fecha de prueba y resultado.</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
