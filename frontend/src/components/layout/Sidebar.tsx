import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react'
import { useRole } from '@/context/RoleContext'
import { navGroups } from '@/lib/nav'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean
  onClose: () => void
}) {
  const { persona } = useRole()

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 w-[268px] overflow-hidden bg-navy text-paper transition-transform duration-300 ease-out lg:translate-x-0',
        mobileOpen ? 'translate-x-0 shadow-lift' : '-translate-x-full',
      )}
      aria-label="Primary navigation"
    >
      <div className="sidebar-grid absolute inset-0" />
      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between px-5 pb-5 pt-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
              <svg viewBox="0 0 40 40" className="h-7 w-7" aria-hidden="true">
                <circle cx="20" cy="20" r="15.5" fill="none" stroke="#e2872f" strokeWidth="1.2" opacity=".9" />
                <circle cx="20" cy="20" r="12" fill="none" stroke="#f4f1e9" strokeWidth=".8" opacity=".28" />
                <path d="M14 26V19M20 26V15.5M26 26V21.5" stroke="#f4f1e9" strokeWidth="3" strokeLinecap="round" />
                <circle cx="26" cy="16" r="2.2" fill="#e2872f" />
              </svg>
            </div>
            <div>
              <p className="font-display text-[21px] leading-none tracking-[-0.03em] text-white">Samanvay</p>
              <p className="mt-1 text-[7.5px] font-bold uppercase tracking-[0.2em] text-white/40">
                AICTE complaint intelligence
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-white/50 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-4 mb-5 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-teal opacity-70 animate-soft-pulse" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal" />
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/55">
              Demonstration build
            </span>
          </div>
          <p className="mt-1 text-[10.5px] leading-relaxed text-white/38">
            Synthetic complaints · public AICTE institution master
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4 scroll-area">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-5">
              <p className="mb-1.5 px-2.5 text-[8.5px] font-bold uppercase tracking-[0.19em] text-white/30">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'group relative flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[12px] font-semibold transition-all',
                        isActive
                          ? 'bg-white/[0.08] text-white shadow-[inset_2px_0_0_0_#e2872f]'
                          : 'text-white/52 hover:bg-white/[0.045] hover:text-white/85',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={cn(
                            'h-4 w-4 shrink-0 transition',
                            isActive ? 'text-saffron' : 'text-white/35 group-hover:text-white/60',
                          )}
                          strokeWidth={1.8}
                        />
                        <span className="truncate">{item.label}</span>
                        {item.badge ? (
                          <span
                            className={cn(
                              'ml-auto inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[9px] font-bold',
                              item.badgeTone === 'danger'
                                ? 'bg-danger/20 text-[#ff9c8f]'
                                : 'bg-saffron/15 text-saffron',
                            )}
                          >
                            {item.badge}
                          </span>
                        ) : null}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          <div className="flex items-center gap-2.5">
            <Avatar name={persona.name} tone={1} className="ring-2 ring-white/10" />
            <div className="min-w-0">
              <p className="truncate text-[11.5px] font-bold text-white/90">{persona.name}</p>
              <p className="truncate text-[9.5px] text-white/40">{persona.unit}</p>
            </div>
          </div>
          <div className="mt-3.5 flex items-center justify-between border-t border-white/8 pt-3">
            <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/25">
              SIH 2026 · PS 26264
            </span>
            <span className="rounded border border-white/10 px-1.5 py-0.5 text-[8px] font-semibold text-white/30">
              v0.1
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
