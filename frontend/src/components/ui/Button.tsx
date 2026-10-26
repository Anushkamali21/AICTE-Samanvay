import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-ink text-paper shadow-[0_10px_24px_-14px_rgba(19,27,38,.65)] hover:bg-navy active:translate-y-px',
  accent:
    'bg-saffron text-ink shadow-[0_10px_24px_-14px_rgba(226,135,47,.8)] hover:bg-[#d97c25] active:translate-y-px',
  secondary:
    'border border-line-strong bg-surface text-ink hover:bg-paper-deep/70 active:translate-y-px',
  ghost: 'text-ink-soft hover:bg-paper-deep/70 hover:text-ink',
  danger: 'bg-danger text-white hover:bg-[#991b13] active:translate-y-px',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 gap-1.5 rounded-lg px-3 text-[12px]',
  md: 'h-10 gap-2 rounded-xl px-4 text-[13px]',
  lg: 'h-11 gap-2 rounded-xl px-5 text-sm',
  icon: 'h-9 w-9 rounded-lg',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  leadingIcon,
  trailingIcon,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex select-none items-center justify-center font-semibold tracking-[-0.01em] transition-all duration-150 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  )
}
