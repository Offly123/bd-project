'use client'

import React, { SetStateAction, useEffect, useState } from 'react'

import ImageCard, { ImageInfo } from '$/ImageCard'
import Filter, { FilterRules } from '$/Filter'


import style from '@/main/main.module.scss'



export default function Main() {
    
    const [ shownImages, setShownImages ] = useState< Array<ImageInfo> >([]);
    const [ imageList, setImageList] = useState<Array<ImageInfo>>([]);
    
    
    // Взятие всех картинок из БД
    useEffect(() => {
        const getImageList = async () => {
            const res = await fetch('/api/main', {
                method: 'POST'
            });
            if (res.ok) {
                let fetchData = await res.json();
                
                // По стандарту сортируем по дате добавления (от новых к старым)
                if (fetchData.length)
                fetchData.sort((a: ImageInfo, b: ImageInfo) => {
                    return b.uploadTime - a.uploadTime;
                });
                
                // console.log(fetchData);
                setImageList(fetchData);
                setShownImages(fetchData);
            } else {
                console.log('Something went wrong');
            }
        }
        getImageList();
    }, []);

    const [ recommendationsList, setRecommendationsList] = useState<Array<ImageInfo>>([]);

    useEffect(() => {
        const getResommendationsList = async () => {
            const res = await fetch('/api/recommendations', {
                method: 'POST'
            });
            if (res.ok) {
                let fetchData = await res.json();
                
                // По стандарту сортируем по дате добавления (от новых к старым)
                if (fetchData.length) {
                    fetchData.sort((a: ImageInfo, b: ImageInfo) => {
                        return b.uploadTime - a.uploadTime;
                    });
                }
                
                setRecommendationsList(fetchData);
            } else {
                console.log('Something went wrong');
            }
        }
        getResommendationsList();
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
        const newShownImages = getNewShownImages(imageList, filterRuleList)

        setShownImages(newShownImages);
    }, [filterRuleList]);

    return (
        <>
            <Filter setFilterRuleList={setFilterRuleList}/>
            {
                recommendationsList && recommendationsList.length
                    ? <>
                    <section className={style.recommendationsList}> 
                        <h2>Список рекомендаций:</h2>
                        <div className={style.imageList}>
                    {
                        recommendationsList.map((image: ImageInfo, index) => (
                            <ImageCard key={image.image_id} imageData={image} setShownImages={setShownImages} />
                        )) 
                    }
                    </div>
                    </section>
                    </>
                    : ''
            }
            <section className={style.imageList}>
                {
                    shownImages && shownImages.length 
                        ? shownImages.map((image: ImageInfo, index) => (
                        <ImageCard key={image.image_id} imageData={image} setShownImages={setShownImages} />
                        )) 
                        : <p>Пусто</p>
                }
            </section>
        </>
    )
}



export const getNewShownImages = (
    imageList: Array<ImageInfo>,
    filterRuleList: FilterRules,
): Array<ImageInfo> => {
    let newShownImages = [...imageList];
        
    // Фильтрация по времени ОТ и ДО
    if (filterRuleList.timeFrom) {
        newShownImages = newShownImages.filter((image: ImageInfo) => {
            return image.uploadTime > filterRuleList.timeFrom
        });
    }
    
    if (filterRuleList.timeTo) {
        newShownImages = newShownImages.filter((image: ImageInfo) => {
            return image.uploadTime < filterRuleList.timeTo
        });
    }

    // Сортировка по времени добавления
    if (filterRuleList.timeOrder) {

        if (filterRuleList.timeOrder === 'up') {
            newShownImages.sort((a, b) => {
                return b.uploadTime - a.uploadTime
            });
        }

        if (filterRuleList.timeOrder === 'down') {
            newShownImages.sort((a, b) => {
                return a.uploadTime - b.uploadTime
            });
        }
    }
    
    // Сортировка по избранным
    if (filterRuleList.favoriteOrder) {
        newShownImages.sort((a, b) => {
            return b.favoriteCount - a.favoriteCount;
        })
    }

    // Фильтрация по тегам (картинка должна содержать все теги из фильтра)
    if (filterRuleList.tags.length) {
        newShownImages = newShownImages.filter(image => {
            let tagsMissing = false;
            filterRuleList.tags.forEach(filterTag => {
                if (!image.tags.includes(filterTag) ) {
                    tagsMissing = true;
                }
            });
            return !tagsMissing;
        });
    }

    return newShownImages;
}