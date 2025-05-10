'use client'

import React from 'react';
import localFont from 'next/font/local';

import Header from '$/Header';
import Footer from '$/Footer';

import '@/global.scss';

const manrope = localFont({
    src: '../fonts/Manrope-VariableFont_wght.ttf'
});



export default function Layout({ 
    children 
} : {
    children: React.ReactNode
}) {
    return (
        <html lang='ru' className={manrope.className}>
            <head>
                <title>Название сайта</title>
                <link rel="icon" href="#" />
            </head>
            <body>
                <Header />
                <main>{ children }</main>
                <Footer />
            </body>
        </html>
    )
}
