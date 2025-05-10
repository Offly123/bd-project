'use client'

import React from "react"

import ImageCard, { ImageInfo } from "$/ImageCard"

import style from '@/main/main.module.scss'



export default function Main() {
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
    {src: 'a', tags: ['cool', 'picture', 'cinema', 'absolute'], resolution: '1920x1080', favoriteCount: 1337},
    {src: 'a', tags: ['cool', 'picture', 'cinema', 'absolute'], resolution: '1920x1080', favoriteCount: 1337},
    {src: 'a', tags: ['cool', 'picture', 'cinema', 'absolute'], resolution: '1920x1080', favoriteCount: 1337},
    {src: 'a', tags: ['cool', 'picture', 'cinema', 'absolute'], resolution: '1920x1080', favoriteCount: 1337},
    {src: 'a', tags: ['cool', 'picture', 'cinema', 'absolute'], resolution: '1920x1080', favoriteCount: 1337},
    {src: 'a', tags: ['cool', 'picture', 'cinema', 'absolute'], resolution: '1920x1080', favoriteCount: 1337},
    {src: 'a', tags: ['cool', 'picture', 'cinema', 'absolute'], resolution: '1920x1080', favoriteCount: 1337}
]
