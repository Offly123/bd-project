'use client'

import { useState, useEffect } from 'react'

import { ImageInfo } from '$/ImageCard'
import ImageCard from '$/ImageCard'

import style from '@/main/main.module.scss'
import FavoriteCard from '$/FavoriteCard'



export default function Favorites() {

    const [ imageList, setImageList ] = useState< Array<ImageInfo> >([]);
    
    // Взятие картинок из БД
    useEffect(() => {
        const foo = async () => {
            const res = await fetch('/api/favorites', {
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
                imageList && imageList.length ?
                    imageList.map((image: ImageInfo, index) => (
                        <FavoriteCard key={index} imageData={image}/>
                    )) :
                <p>Список пуст</p>
            }
        </div>
    )
}
