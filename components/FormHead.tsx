import style from '@/form/formHead.module.scss'

export default function FormHead({ children }: {children: React.ReactNode}) {
    return (
        <h2>
            { children }
        </h2>
    )
}