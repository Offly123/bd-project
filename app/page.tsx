'use client'

import React, { useEffect } from 'react'

import ImageCard, { ImageInfo } from '$/ImageCard'

import style from '@/main/main.module.scss'



export default function Main() {

    useEffect(() => {
        const foo = async () => {
            const res = await fetch('/api/temp', {
                method: 'POST'
            });
            if (res.ok) {
                const fetchData = await res.json();
                console.log(fetchData);
            } else {
                console.log('Something went wrong');
            }
        }

        foo();
    }, [])

    return (
        <div className={style.imageList}>
            {
                images.map((image: ImageInfo, index) => (
                    <ImageCard key={index} imageData={image}/>
                ))
            }
        </div>
    )
}

// Заполнитель, в идеале брать из БД
const images: Array<ImageInfo> = [
    {src: '/images/mem17.jpg', tags: ['cool', 'picture', 'cinema', 'absolute'], resolution: '1920x1080', favoriteCount: 1337},
    {src: '/images/mem17.jpg', tags: ['cool', 'picture', 'cinema', 'absolute'], resolution: '1920x1080', favoriteCount: 1337},
    {src: '/images/mem17.jpg', tags: ['cool', 'picture', 'cinema', 'absolute'], resolution: '1920x1080', favoriteCount: 1337},
    {src: '/images/mem17.jpg', tags: ['cool', 'picture', 'cinema', 'absolute'], resolution: '1920x1080', favoriteCount: 1337},
    {src: '/images/mem17.jpg', tags: ['cool', 'picture', 'cinema', 'absolute'], resolution: '1920x1080', favoriteCount: 1337},
    {src: '/images/mem17.jpg', tags: ['cool', 'picture', 'cinema', 'absolute'], resolution: '1920x1080', favoriteCount: 1337},
    {src: '/images/mem17.jpg', tags: ['cool', 'picture', 'cinema', 'absolute'], resolution: '1920x1080', favoriteCount: 1337}
]
