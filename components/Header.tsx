'use client'

import Navbar from '$/Navbar';

import style from '@/header/header.module.scss';



export default function Header() {
    return (
        <header className={style.header}>
            <h1>
                <a href="">
                    Название сайта
                </a>
            </h1>
            <Navbar />
        </header>
    )
}
