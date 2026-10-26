import { ArrowLeft, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Panel } from '@/components/ui/Panel'

export function NotFound() {
  return (
    <Panel className="overflow-hidden">
      <div className="relative flex flex-col items-center px-6 py-20 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(226,135,47,.12),transparent_55%)]" />
        <div className="relative">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-line bg-paper text-muted">
            <Compass className="h-6 w-6" />
          </span>
          <p className="kicker mt-4">404 · route not found</p>
          <h1 className="mt-2 text-[30px] tracking-[-0.03em] text-ink">This page is not in the case file.</h1>
          <p className="mx-auto mt-2 max-w-md text-[12px] leading-relaxed text-muted">
            The link may be outdated, or the screen may not be part of this prototype. Use the command centre to get back
            to the demo path.
          </p>
          <Link to="/" className="mt-5 inline-block">
            <Button variant="primary" leadingIcon={<ArrowLeft className="h-3.5 w-3.5" />}>
              Back to command centre
            </Button>
          </Link>
        </div>
      </div>
    </Panel>
  )
}
