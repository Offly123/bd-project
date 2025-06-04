'use client'

import { useEffect, useState } from 'react';

import Navbar from '$/Navbar';

import style from '@/header/header.module.scss';



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
