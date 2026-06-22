# Patch para `lib/constants.ts`

Abre `lib/constants.ts` y modifica el import de lucide-react para agregar:

```ts
ClipboardCheck,
Joystick,
```

Debe quedar parecido a:

```ts
import {
  LayoutDashboard,
  Gamepad2,
  BarChart3,
  FolderOpen,
  KanbanSquare,
  Users,
  Settings,
  ShieldCheck,
  ClipboardCheck,
  Joystick
} from 'lucide-react';
```

Después agrega estas dos líneas dentro de `NAV_ITEMS`:

```ts
{ href: '/testing', label: 'Testing / QA', icon: ClipboardCheck },
{ href: '/slots', label: 'Slots', icon: Joystick },
```

Recomendación de orden:

```ts
export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/games', label: 'Juegos', icon: Gamepad2 },
  { href: '/slots', label: 'Slots', icon: Joystick },
  { href: '/statistics', label: 'Estadísticas', icon: BarChart3 },
  { href: '/testing', label: 'Testing / QA', icon: ClipboardCheck },
  { href: '/documents', label: 'Documentos', icon: FolderOpen },
  { href: '/tasks', label: 'Tareas', icon: KanbanSquare },
  { href: '/homologation', label: 'Homologación', icon: ShieldCheck },
  { href: '/admin/users', label: 'Usuarios', icon: Users },
  { href: '/settings', label: 'Configuración', icon: Settings }
];
```
