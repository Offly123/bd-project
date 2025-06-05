'use client'

import React, { SetStateAction, useEffect, useState } from 'react'

import ImageCard, { ImageInfo } from '$/ImageCard'
import Filter, { FilterRules } from '$/Filter'


import style from '@/main/main.module.scss'



export default function Main() {
    
    const [ shownImages, setShownImages ] = useState< Array<ImageInfo> >([]);
    const [ imageList, setImageList] = useState<Array<ImageInfo>>([]);
    const [ recommendationsList, setRecommendationsList] = useState<Array<ImageInfo>>([]);
    const [ favoritesList, setFavoritesList] = useState<Array<number>>([]);
    
    
    // Взятие всех картинок из БД
    useEffect(() => {
        const foo = async () => {
            await getImageList(setImageList, setShownImages);
            await getRecommendationsList(setRecommendationsList);
            await getFavoritesList(setFavoritesList);
        }

        foo();
    }, []);
    
    
    
    const [ filterRuleList, setFilterRuleList ] = useState<FilterRules>({
        timeFrom: undefined,
        timeTo: undefined,
        timeOrder: undefined,
        category: undefined,
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
                            <ImageCard 
                                key={image.image_id} 
                                imageData={image} 
                                setShownImages={setShownImages} 
                                setFavoritesList={setFavoritesList}
                                favoritesList={favoritesList}
                            />
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
                        <ImageCard 
                            key={image.image_id} 
                            imageData={image} 
                            favoritesList={favoritesList}
                            setFavoritesList={setFavoritesList}
                            setShownImages={setShownImages} 
                        />
                        )) 
                        : <p>Пусто</p>
                }
            </section>
        </>
    )
}



const getImageList = async (
    setImageList  : React.Dispatch< React.SetStateAction< Array<ImageInfo> > >,
    setShownImages: React.Dispatch< React.SetStateAction< Array<ImageInfo> > >
) => {
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


const getRecommendationsList = async (
    setRecommendationsList : React.Dispatch< React.SetStateAction< Array<ImageInfo> > >
) => {
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



const getFavoritesList = async (
    setFavoriteList : React.Dispatch< React.SetStateAction< Array<number> > >
) => {
    const response = await fetch('/api/favorites', {
        method: 'POST'
    });

    if (!response.ok) {
        console.log('Ошибка при получении списка избраныных');
    }

    const fetchData = await response.json();

    
    if (fetchData.error !== 'true') {
        const favoritesList = fetchData.map((image: ImageInfo) => {
            return image.image_id;
        })
        setFavoriteList(favoritesList);
    }
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

    // Фильтрация по категориям
    if (filterRuleList.category) {
        newShownImages = newShownImages.filter((image: ImageInfo) => {
            return image.categoryId == filterRuleList.category;
        });
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