'use client'

import { useEffect, useState } from 'react';

import style from '@/header/navbar.module.scss'

export default function Navbar() {

    const [ userRole, setUserRole ] = useState<string>('user');

    useEffect(() => {
        const getRole = async () => {
            const response = await fetch('/api/getUserRole/');
            if (response.ok) {
                const fetchData = await response.json();
                setUserRole(fetchData.role);
            }
        }

        getRole();
    }, []);

    return (
        <nav className={style.nav}>
        {
            userRole === 'admin' ?
            <a href="/admin">
                <p>
                    Админ
                </p>
            </a> : ''
        }
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
