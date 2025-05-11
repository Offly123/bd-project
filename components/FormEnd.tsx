'use client'

import style from '@/form/formEnd.module.scss';

export default function FormEnd({ 
    sendButtonText, 
    children 
}: { 
    sendButtonText: string, 
    children?: React.ReactNode 
}) {
    return (
        <div className={style.end}>
            <button type='submit'>
                <p>{ sendButtonText }</p>
            </button>
            { children }
        </div>
    )
}
