'use client'

import style from '@/main/imageCard.module.scss'

export interface ImageInfo {
    src: string,
    tags: Array<string>,
    resolution: string,
    favoriteCount: number
}

export default function ImageCard({ 
    imageData 
}: {
    imageData: ImageInfo
}) {
    return (
        <article className={style.imageCard}>
            <img className={style.image} src={imageData.src} alt='image.png' />
            <div className={style.end}>
                <p className={style.imageMeta}>
                    {
                        imageData.tags.map((tag, index) => (
                            tag + ' '
                        ))
                    }
                </p>
                <p className={style.facorites}>
                    &#9733; { imageData.favoriteCount }
                </p>
            </div>
        </article>
    )
}
