import { Box } from '@/components/box'
import { ReactNode } from 'react'

export function AuthContainer({ children }: { children: ReactNode }) {
	return <Box className='mx-auto bg-white p-4 shadow-md md:p-8'>{children}</Box>
}
