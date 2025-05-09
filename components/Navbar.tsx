'use client'

import style from '@/header/navbar.module.scss'

export default function Navbar() {
    return (
        <nav className={style.nav}>
            <a href="">
                <p>
                    На главную
                </p>
            </a>
            <a href="">
                <p>
                    Избранное
                </p>
            </a>
            <a href="">
                <p>
                    Войти
                </p>
            </a>
            {/* <a href="">
                <p>
                    Админка
                </p>
            </a> */}
        </nav>
    )
}
