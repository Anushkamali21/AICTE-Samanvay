import {
  BarChart3,
  Building2,
  FolderKanban,
  GitMerge,
  Inbox,
  LayoutDashboard,
  SlidersHorizontal,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  badge?: number
  badgeTone?: 'accent' | 'danger'
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    label: 'Monitor',
    items: [
      { label: 'Command Centre', to: '/', icon: LayoutDashboard },
      { label: 'Overlap Queue', to: '/overlaps', icon: GitMerge, badge: 7, badgeTone: 'accent' },
      { label: 'Triage Inbox', to: '/triage', icon: Inbox, badge: 5, badgeTone: 'danger' },
    ],
  },
  {
    label: 'Casework',
    items: [
      { label: 'All Cases', to: '/cases', icon: FolderKanban },
      { label: 'Institutions', to: '/institutions', icon: Building2 },
      { label: 'Reports', to: '/reports', icon: BarChart3 },
    ],
  },
  {
    label: 'System',
    items: [{ label: 'Configuration', to: '/settings', icon: SlidersHorizontal }],
  },
]

export const routeLabels: { pattern: RegExp; label: string }[] = [
  { pattern: /^\/$/, label: 'Command Centre' },
  { pattern: /^\/institutions$/, label: 'Institutions' },
  { pattern: /^\/institutions\/[^/]+$/, label: 'Institution profile' },
  { pattern: /^\/cases$/, label: 'Case registry' },
  { pattern: /^\/cases\/[^/]+$/, label: 'Case workbench' },
  { pattern: /^\/overlaps$/, label: 'Overlap queue' },
  { pattern: /^\/triage$/, label: 'Triage inbox' },
  { pattern: /^\/reports$/, label: 'Reports & analytics' },
  { pattern: /^\/settings$/, label: 'Configuration' },
]

export function getRouteLabel(pathname: string): string {
  return routeLabels.find((entry) => entry.pattern.test(pathname))?.label ?? 'AICTE Samanvay'
}
