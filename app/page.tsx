'use client'

import React, { useEffect, useState } from 'react'

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

        // Фильтрация по тегам (хотя бы один тег картинки содержит подтрокой теги фильтра)
        if (filterRuleList.tags.length) {
            newShownImages = newShownImages.filter(image => {
                return image.tags.some(imageTag => {
                    return filterRuleList.tags.some(filterTag => {
                        return imageTag.includes(filterTag);
                    });
                });
            })
        }

        
        setShownImages(newShownImages);
    }, [filterRuleList]);

    return (
        <>
            <Filter setFilterRuleList={setFilterRuleList}/>
            {
                recommendationsList && recommendationsList.length
                    ? <>
                    <h2>Список рекомендаций:</h2>
                    <div className={style.recommendationsList + ' ' + style.imageList}> 
                    {
                        recommendationsList.map((image: ImageInfo, index) => (
                            <ImageCard key={image.image_id} imageData={image} setShownImages={setShownImages} />
                        )) }
                        </div>
                    </>
                    : ''
            }
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
