'use client'

import style from '@/header/navbar.module.scss'

export default function Navbar() {
    return (
        <nav className={style.nav}>
            {/* <a href="">
                <p>
                    На главную
                </p>
            </a> */}
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
        </nav>
    )
}
