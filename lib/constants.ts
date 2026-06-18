import {
  LayoutDashboard,
  Gamepad2,
  BarChart3,
  FolderOpen,
  KanbanSquare,
  Users,
  Settings,
  ShieldCheck
} from 'lucide-react';

export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/games', label: 'Juegos', icon: Gamepad2 },
  { href: '/statistics', label: 'Estadísticas', icon: BarChart3 },
  { href: '/documents', label: 'Documentos', icon: FolderOpen },
  { href: '/tasks', label: 'Tareas', icon: KanbanSquare },
  { href: '/homologation', label: 'Homologación', icon: ShieldCheck },
  { href: '/admin/users', label: 'Usuarios', icon: Users },
  { href: '/settings', label: 'Configuración', icon: Settings }
];

export const STAGES = [
  { key: 'concepto', label: 'Concepto', color: '#777C99' },
  { key: 'diseno', label: 'Diseño', color: '#4F8DFF' },
  { key: 'arte', label: 'Arte en producción', color: '#9B6CF6' },
  { key: 'matematica', label: 'Matemática en desarrollo', color: '#2DD4DE' },
  { key: 'programacion', label: 'Programación', color: '#4F8DFF' },
  { key: 'integracion', label: 'Integración', color: '#9B6CF6' },
  { key: 'qa', label: 'QA interno', color: '#FB923C' },
  { key: 'simulacion', label: 'Simulación estadística', color: '#2DD4DE' },
  { key: 'homologacion', label: 'Homologación', color: '#FB923C' },
  { key: 'certificacion', label: 'Certificación', color: '#F4C657' },
  { key: 'demo', label: 'Demo disponible', color: '#46D399' },
  { key: 'mercado', label: 'Listo para mercado', color: '#3BE3A0' }
] as const;

export const AREAS = [
  'Creatividad',
  'Arte',
  'Animación',
  'Audio',
  'Matemática',
  'Programación',
  'QA',
  'Homologación',
  'Certificación',
  'Comercialización',
  'Instalación'
];

export const TASK_COLUMNS = [
  { key: 'pendiente', label: 'Pendiente' },
  { key: 'proceso', label: 'En proceso' },
  { key: 'revision', label: 'En revisión' },
  { key: 'aprobado', label: 'Aprobado' },
  { key: 'bloqueado', label: 'Bloqueado' },
  { key: 'terminado', label: 'Terminado' }
];
