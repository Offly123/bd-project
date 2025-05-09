'use client'

import style from '@/footer/footer.module.scss';

export default function Footer() {
    return (
        <footer className={style.footer}>
            <p className={style.p}>
                &copy; {new Date().getFullYear()} Название сайта. Все права атакованы.
            </p>
        </footer>
    )
}
