'use client'

import Navbar from '$/Navbar';

import style from '@/header/header.module.scss';
import { Router } from 'next/router';



export default function Header() {
    return (
        <header className={style.header}>
            <h1>
                <a href="/">
                    ඞ
                </a>
            </h1>
            <Navbar />
        </header>
    )
}
