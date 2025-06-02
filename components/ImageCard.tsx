'use client'

import style from '@/main/imageCard.module.scss'
import React, { useState } from 'react'

export interface ImageInfo {
    image_id: number,
    src: string,
    tags: Array<string>,
    resolution: string,
    favoriteCount: number,
    uploadTime: number
}

export default function ImageCard({ 
    imageData,
    setShownImages
}: {
    imageData: ImageInfo
    setShownImages: React.Dispatch< React.SetStateAction< Array<ImageInfo> > >
}) {

    const [ favoriteCount, setFavoriteCount ] = useState(imageData.favoriteCount);

    const addFavorite = async () => {
        const res = await fetch('/api/addFavorite/', {
            method: 'POST',
            body: JSON.stringify({image_id: imageData.image_id})
        });

        if (!res.ok) { 
            console.log('Something went wrong');
        }

        const fetchData = await res.json();
        if (!fetchData.error) {
            setFavoriteCount(favoriteCount + 1);
        }

        setShownImages(prevList => {
            return prevList.map((imageFromList: ImageInfo) => {
                return imageFromList.image_id === imageData.image_id
                    ? {...imageFromList, favoriteCount: imageFromList.favoriteCount + 1}
                    : imageFromList
            });
        });
    }

    return (
        <article className={style.imageCard}>
            <img className={style.image} src={imageData.src} alt='image.png' />
            <div className={style.end}>
                <p className={style.imageMeta}>
                    {
                        imageData.tags.map((tag, index) => {
                            return tag + ' ';
                        })
                    }
                </p>
                <button onClick={addFavorite} className={style.facorites}>
                    &#9733; { favoriteCount }
                </button>
            </div>
        </article>
    )
}
