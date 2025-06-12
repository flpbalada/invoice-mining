import { ReactNode, ElementType } from 'react'
import clsx from 'clsx'

interface BoxProps {
	children: ReactNode
	className?: string
	as?: ElementType
}

export function Box({ children, className, as: Component = 'div' }: BoxProps) {
	return (
		<Component className={clsx('bg-whiteshadow-lg max-w-xl space-y-6 rounded-lg', className)}>{children}</Component>
	)
}
