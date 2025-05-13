'use client'

import React, { useEffect, useState } from 'react'

import ImageCard, { ImageInfo } from '$/ImageCard'

import style from '@/main/main.module.scss'



export default function Main() {

    const [ imageList, setImageList ] = useState< Array<ImageInfo> >([]);

    // Взятие картинок из БД
    useEffect(() => {
        const foo = async () => {
            const res = await fetch('/api/main', {
                method: 'POST'
            });
            if (res.ok) {
                const fetchData = await res.json();
                setImageList(fetchData);
            } else {
                console.log('Something went wrong');
            }
        }

        foo();
    }, []);

    return (
        <div className={style.imageList}>
            {
                imageList.map((image: ImageInfo, index) => (
                    <ImageCard key={index} imageData={image}/>
                ))
            }
        </div>
    )
}
