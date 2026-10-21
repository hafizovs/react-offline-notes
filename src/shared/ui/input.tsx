import type { InputHTMLAttributes } from 'react'

import { cn } from '@/shared/lib/cn'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'flex h-9 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 text-sm text-[var(--text-h)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-border)]',
        className,
      )}
      {...props}
    />
  )
}
