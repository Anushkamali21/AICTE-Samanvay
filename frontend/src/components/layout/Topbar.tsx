import {
  Bell,
  ChevronDown,
  Menu,
  Search,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useRole, personas } from '@/context/RoleContext'
import { notifications } from '@/data/mock'
import { getRouteLabel } from '@/lib/nav'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/Toast'
import { Avatar } from '@/components/ui/Avatar'

const toneStyles = {
  danger: 'bg-danger-soft text-danger border-danger/15',
  warning: 'bg-saffron-soft text-saffron border-saffron/20',
  info: 'bg-blue-soft text-blue border-blue/15',
  success: 'bg-teal-soft text-teal border-teal/15',
}

export function Topbar({
  onMenu,
  onOpenSearch,
}: {
  onMenu: () => void
  onOpenSearch: () => void
}) {
  const location = useLocation()
  const label = getRouteLabel(location.pathname)
  const { persona, role, setRole } = useRole()
  const { toast } = useToast()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [roleOpen, setRoleOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-paper/88 backdrop-blur-xl">
      <div className="flex h-[66px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenu}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-surface text-ink-soft transition hover:bg-paper-deep lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="hidden min-w-0 sm:block">
          <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-muted">
            AICTE · Regulation Bureau
          </p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="text-[12px] text-muted">Workspace</span>
            <span className="text-[10px] text-line-strong">/</span>
            <span className="truncate text-[12.5px] font-bold text-ink">{label}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenSearch}
          className="ml-auto flex h-9 w-9 items-center justify-center gap-2 rounded-lg border border-line-strong/80 bg-surface text-muted transition hover:border-line-strong hover:text-ink sm:h-9 sm:w-[260px] sm:justify-start sm:px-3 lg:w-[300px]"
          aria-label="Search institutions and cases"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden truncate text-[11.5px] sm:inline">Search cases, institutions…</span>
          <kbd className="ml-auto hidden rounded border border-line bg-paper px-1.5 py-0.5 font-mono text-[9px] font-semibold sm:inline-block">
            ⌘K
          </kbd>
        </button>

        <div className="hidden items-center gap-2 rounded-full border border-teal/15 bg-teal-soft/60 px-2.5 py-1.5 xl:flex">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-teal opacity-70 animate-soft-pulse" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal" />
          </span>
          <span className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-teal">Live</span>
          <span className="text-[9.5px] text-teal/60">· updated 2m ago</span>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen((open) => !open)
              setRoleOpen(false)
            }}
            className="relative grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-ink-soft transition hover:bg-paper-deep"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-saffron ring-2 ring-surface" />
          </button>

          {notificationsOpen ? (
            <>
              <button
                type="button"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setNotificationsOpen(false)}
                aria-label="Close notifications"
              />
              <div className="absolute right-0 top-11 z-50 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-line bg-surface shadow-lift animate-rise">
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                  <p className="text-[12px] font-bold text-ink">Notifications</p>
                  <span className="rounded-full bg-saffron-soft px-2 py-0.5 text-[9px] font-bold text-saffron">
                    4 new
                  </span>
                </div>
                <div className="divide-y divide-line/70">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex gap-2.5 px-4 py-3 transition hover:bg-paper/60">
                      <span
                        className={cn(
                          'mt-0.5 h-2 w-2 shrink-0 rounded-full border',
                          toneStyles[notification.tone as keyof typeof toneStyles],
                        )}
                      />
                      <div className="min-w-0">
                        <p className="text-[11.5px] font-bold leading-snug text-ink">{notification.title}</p>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-muted">{notification.body}</p>
                        <p className="mt-1 text-[9.5px] text-muted/70">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen(false)
                    toast({ title: 'Notification centre opened', description: 'All 4 items are part of the synthetic demo feed.' })
                  }}
                  className="w-full border-t border-line bg-paper/50 px-4 py-2.5 text-[11px] font-bold text-ink-soft transition hover:bg-paper"
                >
                  View all notifications
                </button>
              </div>
            </>
          ) : null}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setRoleOpen((open) => !open)
              setNotificationsOpen(false)
            }}
            className="flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-1.5 pr-2 transition hover:bg-paper-deep"
            aria-expanded={roleOpen}
            aria-label="Switch demo role"
          >
            <Avatar name={persona.name} size="sm" tone={1} />
            <div className="hidden text-left md:block">
              <p className="max-w-[110px] truncate text-[10.5px] font-bold leading-tight text-ink">{persona.name}</p>
              <p className="text-[8.5px] uppercase tracking-[0.08em] text-muted">{role}</p>
            </div>
            <ChevronDown className={cn('h-3 w-3 text-muted transition', roleOpen && 'rotate-180')} />
          </button>

          {roleOpen ? (
            <>
              <button
                type="button"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setRoleOpen(false)}
                aria-label="Close role menu"
              />
              <div className="absolute right-0 top-11 z-50 w-[290px] overflow-hidden rounded-xl border border-line bg-surface shadow-lift animate-rise">
                <div className="border-b border-line px-4 py-3">
                  <p className="text-[11px] font-bold text-ink">View as</p>
                  <p className="mt-0.5 text-[10.5px] leading-relaxed text-muted">
                    Switch persona to see role-based access in the prototype.
                  </p>
                </div>
                <div className="p-1.5">
                  {personas.map((entry) => (
                    <button
                      key={entry.role}
                      type="button"
                      onClick={() => {
                        setRole(entry.role)
                        setRoleOpen(false)
                        toast({
                          title: `Viewing as ${entry.role}`,
                          description: entry.description,
                        })
                      }}
                      className={cn(
                        'flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition',
                        entry.role === role ? 'bg-paper-deep/70' : 'hover:bg-paper/70',
                      )}
                    >
                      <Avatar name={entry.name} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11.5px] font-bold text-ink">{entry.name}</p>
                        <p className="text-[9.5px] text-muted">{entry.role} · {entry.unit}</p>
                      </div>
                      {entry.role === role ? <ShieldCheck className="mt-0.5 h-3.5 w-3.5 text-teal" /> : null}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 border-t border-line bg-paper/50 px-4 py-2.5 text-[9.5px] text-muted">
                  <UserRound className="h-3 w-3" />
                  Demo access · no real permissions
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </header>
  )
}
