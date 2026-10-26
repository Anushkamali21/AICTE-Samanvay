import { ChevronDown } from 'lucide-react'
import type { SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface FilterSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
  className?: string
}

export function FilterSelect({ label, options, className, ...props }: FilterSelectProps) {
  return (
    <label className={cn('relative inline-flex items-center', className)}>
      {label ? <span className="sr-only">{label}</span> : null}
      <select
        {...props}
        className="h-9 appearance-none rounded-lg border border-line-strong/80 bg-surface pl-3 pr-8 text-[11.5px] font-semibold text-ink-soft outline-none transition hover:border-line-strong focus:border-saffron/60"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 h-3 w-3 text-muted" />
    </label>
  )
}
