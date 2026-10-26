import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <div className="relative min-h-screen">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 cursor-default bg-navy/45 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation overlay"
        />
      ) : null}

      <div className="relative min-h-screen lg:pl-[268px]">
        <Topbar onMenu={() => setMobileOpen(true)} onOpenSearch={() => setPaletteOpen(true)} />

        <main className="mx-auto w-full max-w-[1540px] px-4 pb-12 pt-5 sm:px-6 sm:pt-6 lg:px-8">
          <div key={location.pathname} className="animate-rise">
            <Outlet />
          </div>
        </main>

        <footer className="mx-auto flex w-full max-w-[1540px] flex-col gap-2 border-t border-line/80 px-4 py-5 text-[10px] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            <span className="font-bold text-ink-soft">AICTE Samanvay</span> · Integrated institution complaint coordination
          </p>
          <p className="text-muted/80">
            Demonstration build · Synthetic complaints · Public AICTE institution master
          </p>
        </footer>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  )
}
