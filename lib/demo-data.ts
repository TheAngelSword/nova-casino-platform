import type { DashboardStats, DocumentRecord, Game, Task } from './types';

export const demoGames: Game[] = [
  {
    id: 'demo-mini-ruleta', slug: 'mini-ruleta', name: 'Mini Ruleta',
    description: 'Ruleta reducida de 13 números para partidas rápidas con apuestas a número, color y paridad.',
    game_type: 'Ruleta reducida', theme: 'Casino europeo compacto', target_audience: 'Jugador casual de mesa', complexity: 'Media',
    stage: 'matematica', progress: 26, priority: 'Alta', owner_name: 'Productor interno', estimated_delivery: 'Q3 2026',
    area_progress: { arte: 25, musica: 10, sonidos: 12, matematica: 48, programacion: 22, qa: 6, homologacion: 0, certificacion: 0 },
    risks: ['Definir RTP con rueda reducida', 'Validar pagos sin romper ventaja de casa'],
    next_steps: ['Cerrar tabla de pagos', 'Simular 100M de giros', 'Primer pase de arte']
  },
  {
    id: 'demo-inflar-globos', slug: 'inflar-globos', name: 'Inflar Globos',
    description: 'Juego tipo crash donde el multiplicador aumenta mientras el globo se infla; el jugador cobra antes de que reviente.',
    game_type: 'Crash / cobro anticipado', theme: 'Feria colorida', target_audience: 'Jugador de riesgo casual', complexity: 'Media',
    stage: 'diseno', progress: 14, priority: 'Media', owner_name: 'Productor interno', estimated_delivery: 'Q4 2026',
    area_progress: { arte: 18, musica: 8, sonidos: 14, matematica: 22, programacion: 16, qa: 4, homologacion: 0, certificacion: 0 },
    risks: ['Curva de reventado certificable', 'Cobro anticipado claro para el usuario'],
    next_steps: ['Definir curva', 'Prototipo de inflado', 'Moodboard de feria']
  },
  {
    id: 'demo-ruleta-calle', slug: 'ruleta-calle', name: 'Ruleta Calle',
    description: 'Ruleta con estética urbana, neón, asfalto mojado y tipografía graffiti.',
    game_type: 'Ruleta temática', theme: 'Calle nocturna y graffiti', target_audience: 'Jugador joven', complexity: 'Media-Alta',
    stage: 'arte', progress: 20, priority: 'Media', owner_name: 'Productor interno', estimated_delivery: 'Q4 2026',
    area_progress: { arte: 38, musica: 16, sonidos: 18, matematica: 20, programacion: 18, qa: 5, homologacion: 0, certificacion: 0 },
    risks: ['Legibilidad del tablero', 'Rendimiento con neones'],
    next_steps: ['Dirección de arte final', 'Set de símbolos', 'Reusar matemática base']
  },
  {
    id: 'demo-plinko', slug: 'plinko', name: 'Plinko',
    description: 'Caída de bolas por pines con volatilidad seleccionable y premios en ranuras.',
    game_type: 'Plinko', theme: 'Tablero luminoso', target_audience: 'Jugador casual', complexity: 'Media',
    stage: 'matematica', progress: 28, priority: 'Alta', owner_name: 'Matemático interno', estimated_delivery: 'Q3 2026',
    area_progress: { arte: 30, musica: 12, sonidos: 16, matematica: 52, programacion: 30, qa: 8, homologacion: 0, certificacion: 0 },
    risks: ['Distribución binomial vs pagos', 'Física determinista certificable'],
    next_steps: ['Validar distribución por filas', 'Simular caídas', 'Afinar multiplicadores']
  },
  {
    id: 'demo-avion', slug: 'avion', name: 'Avión',
    description: 'Crash de multiplicador en vuelo con cobro antes de que el avión desaparezca.',
    game_type: 'Crash', theme: 'Cielo y estela', target_audience: 'Jugador de riesgo social', complexity: 'Alta',
    stage: 'diseno', progress: 16, priority: 'Media', owner_name: 'Programación', estimated_delivery: '2027',
    area_progress: { arte: 20, musica: 10, sonidos: 12, matematica: 24, programacion: 18, qa: 4, homologacion: 0, certificacion: 0 },
    risks: ['Servidor de ronda', 'Reconexión a mitad de partida'],
    next_steps: ['Decidir solitario vs multijugador', 'Curva de vuelo', 'Servidor de ronda']
  },
  {
    id: 'demo-carreritas', slug: 'carreritas', name: 'Carreritas',
    description: 'Mini carrera de personajes/vehículos con apuestas a ganador y eventos de pista.',
    game_type: 'Racing bet', theme: 'Pista estilizada', target_audience: 'Jugador casual competitivo', complexity: 'Media',
    stage: 'concepto', progress: 10, priority: 'Media', owner_name: 'Creatividad', estimated_delivery: '2027',
    area_progress: { arte: 12, musica: 8, sonidos: 8, matematica: 12, programacion: 8, qa: 0, homologacion: 0, certificacion: 0 },
    risks: ['Probabilidades transparentes', 'Animación no debe revelar resultado antes de tiempo'],
    next_steps: ['Definir personajes', 'Modelo de probabilidades', 'Prototipo visual']
  },
  {
    id: 'demo-mini-minas', slug: 'mini-minas', name: 'Mini Minas',
    description: 'Juego de selección de casillas con minas ocultas y multiplicador creciente por acierto.',
    game_type: 'Mines', theme: 'Mina futurista', target_audience: 'Jugador de riesgo estratégico', complexity: 'Media',
    stage: 'concepto', progress: 12, priority: 'Alta', owner_name: 'Matemática', estimated_delivery: 'Q4 2026',
    area_progress: { arte: 14, musica: 8, sonidos: 10, matematica: 24, programacion: 12, qa: 0, homologacion: 0, certificacion: 0 },
    risks: ['Balance por número de minas', 'Tabla de multiplicadores'],
    next_steps: ['Definir niveles de riesgo', 'Tabla de pagos', 'Wireframe de tablero']
  }
];

export const demoStats: DashboardStats = {
  totalGames: demoGames.length,
  averageProgress: Math.round(demoGames.reduce((a, g) => a + g.progress, 0) / demoGames.length),
  inDevelopment: 7,
  inQa: 0,
  inHomologation: 0,
  certified: 0,
  marketReady: 0
};

export const demoTasks: Task[] = [
  { id: 't1', title: 'Cerrar tabla de pagos de Mini Ruleta', description: 'Definir pagos por número/color/paridad.', game_id: 'demo-mini-ruleta', game_name: 'Mini Ruleta', area: 'Matemática', owner_name: 'Matemático', priority: 'Alta', status: 'proceso', due_date: '2026-07-01' },
  { id: 't2', title: 'Set de pines y ranuras de Plinko', description: 'Arte final y exportación PNG/SVG.', game_id: 'demo-plinko', game_name: 'Plinko', area: 'Arte', owner_name: 'Diseñador', priority: 'Media', status: 'revision', due_date: '2026-07-08' },
  { id: 't3', title: 'Estructura de homologación SAS/AFT', description: 'Checklist de comunicación, cashout, eventos y recuperación.', game_id: null, game_name: null, area: 'Homologación', owner_name: 'Programador', priority: 'Alta', status: 'pendiente', due_date: '2026-07-15' }
];

export const demoDocuments: DocumentRecord[] = [
  { id: 'd1', name: 'Documento general del proyecto', category: 'Documento general', game_id: null, game_name: null, version: 'v0.1', status: 'Borrador', storage_path: null, created_at: '2026-06-17' },
  { id: 'd2', name: 'Modelo matemático Plinko', category: 'Documento matemático', game_id: 'demo-plinko', game_name: 'Plinko', version: 'v0.1', status: 'En revisión', storage_path: null, created_at: '2026-06-17' }
];

export const rtpChart = [
  { game: 'Mini Ruleta', objetivo: 96.0, observado: 95.7 },
  { game: 'Inflar Globos', objetivo: 95.5, observado: 94.9 },
  { game: 'Ruleta Calle', objetivo: 97.3, observado: 97.1 },
  { game: 'Plinko', objetivo: 96.4, observado: 96.2 },
  { game: 'Avión', objetivo: 95.0, observado: 94.2 },
  { game: 'Carreritas', objetivo: 95.0, observado: 0 },
  { game: 'Mini Minas', objetivo: 96.0, observado: 0 }
];
