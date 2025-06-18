'use client'

import { Input } from '@headlessui/react'
import { isDate } from '../../../utils/is-date'
import { isNumber } from '../../../utils/is-number'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

type InvoiceMiningResultFormFieldKey = string

type InvoiceMiningResultFormFieldValue = string | number | Date | undefined

type InvoiceMiningResultFormField = {
	key: InvoiceMiningResultFormFieldKey
	value: InvoiceMiningResultFormFieldValue
}

type InvoiceMiningResultFormProps = {
	fields: InvoiceMiningResultFormField[]
}

export function InvoiceMiningResultForm({ fields }: InvoiceMiningResultFormProps) {
	const t = useTranslations('InvoiceMiningResultForm')
	const getInputType = (value: InvoiceMiningResultFormFieldValue): string => {
		if (isNumber(value)) return 'number'
		if (isDate(value)) return 'date'
		return 'text'
	}

	const translateKey = useCallback(
		(key: InvoiceMiningResultFormFieldKey): string => {
			return t(toCamelCase(key))
		},
		[t],
	)

	return (
		<form>
			{fields.map(field => (
				<fieldset
					key={field.key}
					className='fieldset'
				>
					<legend className='fieldset-legend pb-0.5'>{translateKey(field.key)}</legend>
					<Input
						type={getInputType(field.value)}
						defaultValue={String(field.value)}
						className='input w-full'
						disabled
					/>
				</fieldset>
			))}
		</form>
	)
}

function toCamelCase(str: string) {
	return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_: unknown, chr: string) => chr.toUpperCase())
}
