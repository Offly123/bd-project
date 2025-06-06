'use client'

import style from '@/main/imageCard.module.scss'
import React, { useState } from 'react'

export interface ImageInfo {
    image_id: number,
    src: string,
    tags: Array<string>,
    categoryId: number,
    resolution: string,
    favoriteCount: number,
    uploadTime: number
}

export default function ImageCard({ 
    imageData,
    favoritesList,
    setFavoritesList,
    setShownImages
}: {
    imageData: ImageInfo
    favoritesList: Array<number>,
    setFavoritesList: React.Dispatch< React.SetStateAction< Array<number> > >
    setShownImages: React.Dispatch< React.SetStateAction< Array<ImageInfo> > >
}) {

    const [ favoriteCount, setFavoriteCount ] = useState(imageData.favoriteCount);

    const addFavorite = async () => {
        const res = await fetch('/api/addFavorite/', {
            method: 'POST',
            body: JSON.stringify({image_id: imageData.image_id})
        });

        if (!res.ok) { 
            console.error('Something went wrong');
        }

        const fetchData = await res.json();
        if (fetchData.error) {
            console.error('Something went wrong');
            return;
        }


        
        setFavoriteCount(favoriteCount + 1);

        setShownImages(prevList => {
            return prevList.map((imageFromList: ImageInfo) => {
                return imageFromList.image_id === imageData.image_id
                ? {...imageFromList, favoriteCount: imageFromList.favoriteCount + 1}
                : imageFromList
            });
        });
        
        setFavoritesList((prevValue: Array<number>) => {
            return [...prevValue, imageData.image_id];
        })
    }

    const deleteFavorite = async () => {
        const res = await fetch('/api/deleteFavorite/', {
            method: 'POST',
            body: JSON.stringify({image_id: imageData.image_id})
        })
        if (!res.ok) {
            console.error('Something went wrong');
            return;
        }

        setFavoritesList((prevValue: Array<number>) => {
            return prevValue.filter((image_id: number) => {
                return image_id !== imageData.image_id;
            });
        })

        setShownImages(prevList => {
            return prevList.map((imageFromList: ImageInfo) => {
                return imageFromList.image_id === imageData.image_id
                    ? {...imageFromList, favoriteCount: imageFromList.favoriteCount - 1}
                    : imageFromList
            });
        });

        setFavoriteCount(favoriteCount - 1);
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

    // console.log(favoritesList);
    // console.log(imageData);



    return (
        <article className={style.imageCard}>
            <button onClick={downloadImage} className={style.downloadButton}>
                <img className={style.image} src={imageData.src} alt='image.png' />
            </button>

            <div className={style.end}>
                <p className={style.imageMeta}>
                {
                    imageData.tags.map((tag) => {
                        return tag + ' ';
                    })
                }
                </p>
                <button 
                    onClick={
                        favoritesList.includes(imageData.image_id) 
                        ? deleteFavorite 
                        : addFavorite
                        } 
                    className={style.favorites}>
                {
                    favoritesList.includes(imageData.image_id) ? <>&#9733;</> : <>&#9734;</>
                }
                { favoriteCount }
                {
                    //&#9734;  - пустая
                    //&#9733;  - заполненная
                    //&#10005; - крест
                }
                </button>
            </div>
        </article>
    )
}
