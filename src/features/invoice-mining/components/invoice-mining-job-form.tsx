'use client'

import { Input } from '@headlessui/react'
import { isDate } from '../../../utils/is-date'
import { isNumber } from '../../../utils/is-number'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import toast from 'react-hot-toast'

type InvoiceMiningJobFormFieldKey = string

type InvoiceMiningJobFormFieldValue = string | number | Date | undefined

type InvoiceMiningJobFormField = {
	key: InvoiceMiningJobFormFieldKey
	value: InvoiceMiningJobFormFieldValue
}

type InvoiceMiningJobFormProps = {
	fields: InvoiceMiningJobFormField[]
}

export function InvoiceMiningJobForm({ fields }: InvoiceMiningJobFormProps) {
	const t = useTranslations('InvoiceMiningJobForm')

	const getInputType = (value: InvoiceMiningJobFormFieldValue): string => {
		if (isNumber(value)) return 'number'
		if (isDate(value)) return 'date'
		return 'text'
	}

	const translateKey = useCallback(
		(key: InvoiceMiningJobFormFieldKey): string => {
			return t(toCamelCase(key))
		},
		[t],
	)

	const onInputClick = useCallback(() => toast(t('notImplemented')), [t])

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
						onClick={onInputClick}
					/>
				</fieldset>
			))}
		</form>
	)
}

function toCamelCase(str: string) {
	return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_: unknown, chr: string) => chr.toUpperCase())
}
