import { Search, X } from 'lucide-react'
import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  shortcut?: string
  className?: string
  inputClassName?: string
}

export function SearchInput({
  value,
  onChange,
  onClear,
  shortcut,
  className,
  inputClassName,
  placeholder = 'Search…',
  ...props
}: SearchInputProps) {
  return (
    <div
      className={cn(
        'flex h-10 items-center gap-2 rounded-xl border border-line-strong/80 bg-surface px-3 text-ink transition focus-within:border-saffron/60 focus-within:ring-2 focus-within:ring-saffron/15',
        className,
      )}
    >
      <Search className="h-3.5 w-3.5 shrink-0 text-muted" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          'min-w-0 flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted/80',
          inputClassName,
        )}
        {...props}
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            onChange('')
            onClear?.()
          }}
          className="grid h-5 w-5 place-items-center rounded text-muted transition hover:bg-paper-deep hover:text-ink"
          aria-label="Clear search"
        >
          <X className="h-3 w-3" />
        </button>
      ) : shortcut ? (
        <kbd className="hidden rounded border border-line bg-paper px-1.5 py-0.5 font-mono text-[9px] font-semibold text-muted sm:inline-block">
          {shortcut}
        </kbd>
      ) : null}
    </div>
  )
}
