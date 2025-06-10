import { ReactNode } from 'react'
import clsx from 'clsx'

export function Box({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<div className={clsx('max-w-xl space-y-6 rounded-lg bg-white p-4 shadow-lg md:p-8', className)}>{children}</div>
	)
}
