'use client'

import clsx from 'clsx'
import { useFormatter } from 'next-intl'
import { ReactNode, createContext, useContext } from 'react'

type TableGridContextType = {
	columns: number
}

const TableGridContext = createContext<TableGridContextType | undefined>(undefined)

export function TableGrid({ children, columns = 3 }: { children: ReactNode; columns?: number }) {
	return (
		<TableGridContext.Provider value={{ columns }}>
			<div className='w-full overflow-x-auto rounded-lg bg-white p-4 shadow-md'>
				<div className={clsx('grid w-full gap-2 text-sm', `grid-cols-${columns}`)}>{children}</div>
			</div>
		</TableGridContext.Provider>
	)
}

function useColumns() {
	const context = useContext(TableGridContext)
	if (!context) throw new Error('TableGrid.* must be used within TableGrid')
	return context.columns
}

function Head({ children }: { children: ReactNode }) {
	const columns = useColumns()

	const colSpansMap: Record<number, string> = {
		1: 'col-span-1',
		2: 'col-span-2',
		3: 'col-span-3',
		4: 'col-span-4',
		5: 'col-span-5',
		6: 'col-span-6',
	}

	return (
		<>
			{children}
			<div className={clsx(colSpansMap[columns], 'border-b border-b-gray-200')} />
		</>
	)
}

function Body({ children }: { children: ReactNode }) {
	return <>{children}</>
}

function Row({ children }: { children: ReactNode }) {
	return <>{children}</>
}

function Cell({ children, justify }: { children: ReactNode; justify?: 'start' | 'end' }) {
	const justifyMap: Record<string, string> = {
		start: 'justify-start',
		end: 'justify-end',
	}
	return <div className={clsx('flex min-w-32 items-center', justify && justifyMap[justify])}>{children}</div>
}

function DateTime({ date }: { date: Date }) {
	const format = useFormatter()
	const dateFormatted = format.dateTime(date, {
		dateStyle: 'long',
		timeStyle: 'short',
	})
	return <span>{dateFormatted}</span>
}

TableGrid.Head = Head
TableGrid.Body = Body
TableGrid.Row = Row
TableGrid.Cell = Cell
TableGrid.DateTime = DateTime
