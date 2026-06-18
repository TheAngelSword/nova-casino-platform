export type RoleKey =
  | 'admin'
  | 'producer'
  | 'designer'
  | 'animator'
  | 'developer'
  | 'mathematician'
  | 'qa_tester'
  | 'audio_designer'
  | 'client'
  | 'lab_certifier'
  | 'viewer';

export type GameStage =
  | 'concepto'
  | 'diseno'
  | 'arte'
  | 'matematica'
  | 'programacion'
  | 'integracion'
  | 'qa'
  | 'simulacion'
  | 'homologacion'
  | 'certificacion'
  | 'demo'
  | 'mercado';

export type Game = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  game_type: string | null;
  theme: string | null;
  target_audience: string | null;
  complexity: string | null;
  stage: GameStage;
  progress: number;
  priority: string | null;
  owner_name: string | null;
  estimated_delivery: string | null;
  area_progress: Record<string, number>;
  risks: string[];
  next_steps: string[];
};

export type DashboardStats = {
  totalGames: number;
  averageProgress: number;
  inDevelopment: number;
  inQa: number;
  inHomologation: number;
  certified: number;
  marketReady: number;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  game_id: string | null;
  game_name?: string | null;
  area: string;
  owner_name: string | null;
  priority: string;
  status: string;
  due_date: string | null;
};

export type DocumentRecord = {
  id: string;
  name: string;
  category: string;
  game_id: string | null;
  game_name?: string | null;
  version: string;
  status: string;
  storage_path: string | null;
  created_at: string;
};
