import type { TextareaHTMLAttributes } from 'react'

import { cn } from '@/shared/lib/cn'

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-[160px] w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text-h)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-border)]',
        className,
      )}
      {...props}
    />
  )
}
