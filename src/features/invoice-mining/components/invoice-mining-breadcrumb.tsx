import Link from 'next/link'

type BreadcrumbItem = {
	label: string
}

type BreadcrumbItemBasic = BreadcrumbItem & { type: 'basic' }

type BreadcrumbItemLink = BreadcrumbItem & {
	type: 'link'
	href: string
}

type InvoiceMiningBreadcrumbProps = {
	items: (BreadcrumbItemBasic | BreadcrumbItemLink)[]
}

export function InvoiceMiningBreadcrumb({ items }: InvoiceMiningBreadcrumbProps) {
	return (
		<div className='breadcrumbs my-4 text-sm'>
			<ul className='m-0 p-0'>
				{items.map(item => {
					if (item.type === 'basic') return <li key={item.label}>{item.label}</li>

					return (
						<li key={item.label}>
							<Link href={item.href}>{item.label}</Link>
						</li>
					)
				})}
			</ul>
		</div>
	)
}
