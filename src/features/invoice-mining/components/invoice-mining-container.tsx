import { ReactNode } from 'react'

export function InvoiceMiningContainer({ children }: { children: ReactNode }) {
	return <div className='container mx-auto my-4 flex flex-col items-center'>{children}</div>
}
