import { Fragment, ReactNode } from 'react'

export function List<T>({
	Item,
	Container = Fragment,
	items,
}: {
	Item: (props: { item: T }) => ReactNode
	Container?: React.ComponentType<{ children: ReactNode }>
	items: { id: string | number; item: T }[]
}) {
	return (
		<Container>
			{items.map(item => (
				<Item
					key={item.id}
					item={item.item}
				/>
			))}
		</Container>
	)
}
