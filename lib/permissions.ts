import type { RoleKey } from './types';

export type Permission =
  | 'games.read' | 'games.write' | 'games.delete'
  | 'creative.write' | 'art.write' | 'audio.write' | 'math.write'
  | 'development.write' | 'qa.write' | 'homologation.write' | 'certification.write'
  | 'documents.read' | 'documents.write' | 'documents.delete'
  | 'tasks.read' | 'tasks.write'
  | 'users.manage' | 'settings.manage' | 'approvals.manage';

const ALL: Permission[] = [
  'games.read', 'games.write', 'games.delete', 'creative.write', 'art.write', 'audio.write', 'math.write',
  'development.write', 'qa.write', 'homologation.write', 'certification.write', 'documents.read', 'documents.write',
  'documents.delete', 'tasks.read', 'tasks.write', 'users.manage', 'settings.manage', 'approvals.manage'
];

export const ROLE_PERMISSIONS: Record<RoleKey, Permission[]> = {
  admin: ALL,
  producer: ['games.read', 'games.write', 'creative.write', 'art.write', 'audio.write', 'math.write', 'development.write', 'qa.write', 'homologation.write', 'certification.write', 'documents.read', 'documents.write', 'tasks.read', 'tasks.write', 'approvals.manage'],
  designer: ['games.read', 'creative.write', 'art.write', 'documents.read', 'documents.write', 'tasks.read', 'tasks.write'],
  animator: ['games.read', 'art.write', 'documents.read', 'documents.write', 'tasks.read', 'tasks.write'],
  developer: ['games.read', 'development.write', 'documents.read', 'documents.write', 'tasks.read', 'tasks.write'],
  mathematician: ['games.read', 'math.write', 'documents.read', 'documents.write', 'tasks.read', 'tasks.write'],
  qa_tester: ['games.read', 'qa.write', 'documents.read', 'documents.write', 'tasks.read', 'tasks.write'],
  audio_designer: ['games.read', 'audio.write', 'documents.read', 'documents.write', 'tasks.read', 'tasks.write'],
  client: ['games.read', 'documents.read', 'tasks.read'],
  lab_certifier: ['games.read', 'math.write', 'qa.write', 'homologation.write', 'certification.write', 'documents.read', 'documents.write'],
  viewer: ['games.read', 'documents.read', 'tasks.read']
};

export function can(role: RoleKey | undefined, permission: Permission) {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
