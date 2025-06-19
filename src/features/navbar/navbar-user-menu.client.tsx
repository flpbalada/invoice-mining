'use client'

import { Button, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { Fragment } from 'react'
import { FaCircleUser } from 'react-icons/fa6'
import { navbarSignOut } from './sign-out.action'

type NavbarUserMenuItem = {
	id: string
	children: (focus: boolean) => React.ReactNode
}

type NavbarUserMenuProps = {
	isUserSignedIn: boolean
	userInitial?: string
}

export function NavbarUserMenu({ isUserSignedIn, userInitial }: NavbarUserMenuProps) {
	const links = useGetNavbarUserMenuLinks(isUserSignedIn)

	return (
		<Menu as={Fragment}>
			<MenuButton as={Fragment}>
				<Button className={clsx('btn btn-circle', userInitial && 'btn-primary')}>
					{userInitial ? <span>{userInitial}</span> : <FaCircleUser />}
				</Button>
			</MenuButton>
			<MenuItems
				anchor='bottom end'
				as='ul'
				className='menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm'
			>
				{links.map(item => (
					<MenuItem
						key={item.id}
						as='li'
					>
						{({ focus }) => <>{item.children(focus)}</>}
					</MenuItem>
				))}
			</MenuItems>
		</Menu>
	)
}

function useGetNavbarUserMenuLinks(isUser: boolean): NavbarUserMenuItem[] {
	const t = useTranslations('useGetNavbarUserMenuLinks')

	if (isUser) {
		return [
			{
				id: 'sign-out',
				children: () => {
					return <button onClick={navbarSignOut}>{t('signOut')}</button>
				},
			},
		]
	}

	return [
		{
			id: 'sign-in',
			children: () => <a href='/auth/sign-in'>{t('signIn')}</a>,
		},
	]
}
