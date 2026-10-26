import { CheckCircle2, Info, TriangleAlert, XCircle, X } from 'lucide-react'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'

export type ToastTone = 'success' | 'info' | 'warning' | 'danger'

interface ToastItem {
  id: number
  title: string
  description?: string
  tone: ToastTone
}

interface ToastInput {
  title: string
  description?: string
  tone?: ToastTone
}

const ToastContext = createContext<{
  toast: (input: ToastInput | string) => void
} | null>(null)

const icons = {
  success: CheckCircle2,
  info: Info,
  warning: TriangleAlert,
  danger: XCircle,
}

const toneClasses: Record<ToastTone, string> = {
  success: 'border-teal/20 bg-teal-soft text-teal',
  info: 'border-blue/20 bg-blue-soft text-blue',
  warning: 'border-saffron/25 bg-saffron-soft text-saffron',
  danger: 'border-danger/20 bg-danger-soft text-danger',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const counter = useRef(0)

  const dismiss = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const toast = useCallback((input: ToastInput | string) => {
    const id = ++counter.current
    const item: ToastItem =
      typeof input === 'string'
        ? { id, title: input, tone: 'info' }
        : { id, tone: 'info', ...input }
    setItems((current) => [...current.slice(-3), item])
    window.setTimeout(() => {
      setItems((current) => current.filter((entry) => entry.id !== id))
    }, 4200)
  }, [])

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-4 z-[90] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-2">
        {items.map((item) => {
          const Icon = icons[item.tone]
          return (
            <div
              key={item.id}
              className="pointer-events-auto flex items-start gap-3 rounded-xl border border-line bg-surface p-3.5 shadow-lift animate-rise"
            >
              <span
                className={cn(
                  'mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border',
                  toneClasses[item.tone],
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-bold leading-snug text-ink">{item.title}</p>
                {item.description ? (
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">
                    {item.description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-muted transition hover:bg-paper-deep hover:text-ink"
                aria-label="Dismiss notification"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside ToastProvider')
  return context
}
