'use client'

import React, { useEffect, useState } from 'react'

import ImageCard, { ImageInfo } from '$/ImageCard'
import Filter, { FilterRules } from '$/Filter'


import style from '@/main/main.module.scss'



export default function Main() {
    
    const [ shownImages, setShownImages ] = useState< Array<ImageInfo> >([]);
    const [ imageList, setImageList] = useState<Array<ImageInfo>>([]);
    
    // Взятие картинок из БД
    useEffect(() => {
        const foo = async () => {
            const res = await fetch('/api/main', {
                method: 'POST'
            });
            if (res.ok) {
                let fetchData = await res.json();
                
                // По стандарту сортируем по дате добавления (от новых к старым)
                fetchData.sort((a, b) => {
                    return b.uploadTime - a.uploadTime;
                });
                
                console.log(fetchData);
                setImageList(fetchData);
                setShownImages(fetchData);
            } else {
                console.log('Something went wrong');
            }
        }
        foo();
    }, []);
    
    
    
    const [ filterRuleList, setFilterRuleList ] = useState<FilterRules>({
        timeFrom: undefined,
        timeTo: undefined,
        timeOrder: undefined,
        tags: [],
        favoriteOrder: undefined
    });
    

    // Фильтрация картинок
    useEffect(() => {
        let newShownImages = [...imageList];
        // console.log(filterRuleList);
        
        // Фильтрация по времени ОТ и ДО
        if (filterRuleList.timeFrom) {
            newShownImages = newShownImages.filter((image: ImageInfo) => {
                return image.uploadTime > filterRuleList.timeFrom
            });
        }
        
        if (filterRuleList.timeTo) {
            newShownImages = newShownImages.filter((image: ImageInfo) => {
                console.log(image.uploadTime);
                return image.uploadTime < filterRuleList.timeTo
            });
        }
        
        // Сортировка по избранным
        if (filterRuleList.favoriteOrder) {
            newShownImages.sort((a, b) => {
                return b.favoriteCount - a.favoriteCount;
            })
        }
        
        setShownImages(newShownImages);
    }, [filterRuleList]);

    return (
        <>
            <Filter setFilterRuleList={setFilterRuleList}/>
            <div className={style.imageList}>
                {
                    shownImages && shownImages.length 
                        ? shownImages.map((image: ImageInfo, index) => (
                        <ImageCard key={image.image_id} imageData={image} setShownImages={setShownImages} />
                        )) 
                        : <p>Пусто</p>
                }
            </div>
        </>
    )
}
