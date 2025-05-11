'use client'

import style from '@/form/textInput.module.scss'
import { ChangeEvent, ChangeEventHandler } from 'react'

interface TextInputProps {
    label: string,
    defaultValue?: string,
    type: string,
    name: string,
    onChange?: ChangeEventHandler<HTMLInputElement>,
    error?: boolean
}

export default function TextInput({label, defaultValue, type, name, onChange, error = false}: TextInputProps) {

    return (
        <div className={`${style.field} ${error ? style.errored : ''}`}>
            <label htmlFor={name}>{label}:</label>
            <input name={name} type={type} defaultValue={defaultValue} placeholder={label} onChange={onChange}/>
        </div>
    )
}
