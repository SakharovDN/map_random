import type { InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

export function Input({ label, className = '', id, ...rest }: Props) {
  const inputId = id ?? rest.name
  return (
    <label className="flex flex-col gap-1 text-left">
      {label ? (
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
      ) : null}
      <input
        id={inputId}
        className={`rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 ${className}`}
        {...rest}
      />
    </label>
  )
}
