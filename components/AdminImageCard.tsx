'use client'

import style from '@/main/imageCard.module.scss'
import { useState } from 'react'

export interface ImageInfo {
    image_id: number,
    src: string,
    tags: Array<string>,
    categoryId: number,
    resolution: string,
    favoriteCount: number,
    uploadTime: number
}

export default function AdminImageCard({ 
    imageData 
}: {
    imageData: ImageInfo
}) {
    const [ isVisible, setIsVisible ] = useState(true);

    const deleteImage = async () => {
        const res = await fetch('/api/deleteImage/', {
            method: 'POST',
            body: JSON.stringify({image_id: imageData.image_id})
        })
        if (res.ok) {
            setIsVisible(false);
        }
    }

    if (!isVisible) {
        return;
    }
    
    return (
        <article className={style.imageCard}>
            <button className={style.downloadButton}>
                <img className={style.image} src={imageData.src} alt='image.png' />
            </button>
            <div className={style.end}>
                <p className={style.imageMeta}>
                {
                    imageData.tags.map((tag, index) => (
                        tag + ' '
                    ))
                }
                </p>
                <button onClick={deleteImage} className={style.favorites}>
                    Удалить
                </button>
            </div>
        </article>
    )
}
