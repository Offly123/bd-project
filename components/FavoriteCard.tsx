'use client'

import style from '@/main/imageCard.module.scss'
import { useState } from 'react'

export interface ImageInfo {
    image_id: number,
    src: string,
    tags: Array<string>,
    resolution: string,
    favoriteCount: number
}

export default function FavoriteCard({ 
    imageData 
}: {
    imageData: ImageInfo
}) {
    const [ isVisible, setIsVisible ] = useState(true);

    const deleteFavorite = async () => {
        const res = await fetch('/api/deleteFavorite/', {
            method: 'POST',
            body: JSON.stringify({image_id: imageData.image_id})
        })
        console.log(imageData.image_id);
        if (res.ok) {
            setIsVisible(false);
        }
    }

    const downloadImage = async () => {
        const res = await fetch('/api/downloadImage/', {
            method: 'POST',
            body: JSON.stringify({src: imageData.src})
        });

        if (!res.ok) {
            console.error('Something went wrong');
            return;
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = imageData.src.split('/').pop();
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    

    if (!isVisible) {
        return;
    }
    
    return (
        <article className={style.imageCard}>
            <button onClick={downloadImage} className={style.downloadButton}>
                <img className={style.image} src={imageData.src} alt='image.png' />
            </button>
            <div className={style.end}>
                <p className={style.imageMeta}>
                {
                    imageData.tags.map((tag) => (
                        tag + ' '
                    ))
                }
                </p>
                <button onClick={deleteFavorite} className={style.favorites}>
                    &#10005; { imageData.favoriteCount }
                </button>
            </div>
        </article>
    )
}
