import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Role } from '@/data/types'

interface Persona {
  name: string
  role: Role
  unit: string
  description: string
}

export const personas: Persona[] = [
  {
    name: 'Ananya Menon',
    role: 'PGRC Officer',
    unit: 'Public Grievance Redressal Cell',
    description: 'Triage, route and monitor institution complaints.',
  },
  {
    name: 'Vikram Rao',
    role: 'RB Officer',
    unit: 'Regulation Bureau',
    description: 'Handle approval and APH compliance cases.',
  },
  {
    name: 'Meera Krishnan',
    role: 'Cell Officer',
    unit: 'Anti-Ragging Cell',
    description: 'Access sealed and sensitive inquiries.',
  },
  {
    name: 'Dr. R. K. Soni',
    role: 'Senior Management',
    unit: 'AICTE Headquarters',
    description: 'Portfolio oversight and escalation authority.',
  },
]

interface RoleContextValue {
  role: Role
  setRole: (role: Role) => void
  persona: Persona
  canViewSealed: boolean
}

const RoleContext = createContext<RoleContextValue | null>(null)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('PGRC Officer')

  const value = useMemo<RoleContextValue>(() => {
    const persona = personas.find((entry) => entry.role === role) ?? personas[0]
    return {
      role,
      setRole,
      persona,
      canViewSealed: role === 'Cell Officer' || role === 'Senior Management',
    }
  }, [role])

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}

export function useRole() {
  const context = useContext(RoleContext)
  if (!context) throw new Error('useRole must be used inside RoleProvider')
  return context
}
