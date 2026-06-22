// Copiar estos imports y elementos a lib/constants.ts
// Import adicional:
// import { ClipboardCheck, Joystick } from 'lucide-react';

// Agregar dentro de NAV_ITEMS:
export const TESTING_NAV_ITEMS = [
  { href: '/testing', label: 'Testing / QA', iconName: 'ClipboardCheck' },
  { href: '/slots', label: 'Slots', iconName: 'Joystick' }
];

// Nota: en constants.ts real usa icon: ClipboardCheck e icon: Joystick, no iconName.
