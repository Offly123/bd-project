'use client'

import style from '@/header/navbar.module.scss'

export default function Navbar() {
    return (
        <nav className={style.nav}>
            <a href="/favorites/">
                <p>
                    Избранное
                </p>
            </a>
            <a href="/login/">
                <p>
                    Вход
                </p>
            </a>
            <a href="/registration">
                <p>
                    Регистрация
                </p>
            </a>
            <a href="/admin">
                <p>
                    Админ
                </p>
            </a>
        </nav>
    )
}
