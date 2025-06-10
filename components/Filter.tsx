'use client'

import React, { useState, useEffect } from "react";

import { ImageInfo } from "$/ImageCard"
import { findSourceMap } from "module";

import style from '@/filter.module.scss';
import { preconnect } from "next/dist/server/app-render/entry-base";



export interface FilterRules {
    // Сортировка по дате ОТ и ДО, по убыванию или возрастанию
    timeFrom: number | undefined,
    timeTo: number | undefined,
    timeOrder: 'up' | 'down' | undefined,

    // Какой категории должна быть картинка
    category: number | undefined,

    // Какие теги должны быть у картинки
    tags: Array<string>,

    // Сортировка по количеству избранных по убыванию или возрастанию
    favoriteOrder: 'up' | 'down' | undefined,
}

export default function Filter({
    setFilterRuleList,
} : {
    setFilterRuleList: React.Dispatch< React.SetStateAction<FilterRules> >
}) {
    
    const changeTimeFrom = () => {
        const time = document.querySelector('#timeFrom')['valueAsNumber'];
        setFilterRuleList((prevRules: FilterRules) => {
            const newRules: FilterRules = { ...prevRules, timeFrom: time };
            return newRules;
        });
    }
    
    const changeTimeTo = () => {
        const time = document.querySelector('#timeTo')['valueAsNumber'];
        setFilterRuleList((prevRules: FilterRules) => {
            const newRules: FilterRules = { ...prevRules, timeTo: time };
            return newRules;
        });
    }
    
    const changeTimeOrderUp = (e) => {
        e.preventDefault();

        setFilterRuleList((prevRules: FilterRules) => {
            return {...prevRules, timeOrder: 'up'}
        })
    }

    const changeTimeOrderDown = (e) => {
        e.preventDefault();

        setFilterRuleList((prevRules: FilterRules) => {
            return {...prevRules, timeOrder: 'down'}
        })
    }

    const changeCategory = (e) => {

        setFilterRuleList((prevRules: FilterRules) => {
            return {...prevRules, category: e.target.value};
        })
    }
    
    const sortByFavorite = (e) => {
        e.preventDefault();

        setFilterRuleList((prevRules: FilterRules) => {
            return {...prevRules, favoriteOrder: 'down'}
        })
    }

    const changeTags = (e) => {
        e.preventDefault();

        // Регуляркой убираем все лишние пробелы
        const tagsListString: string = document.querySelector('#tagList')['value'].trim().replace(/\s+/g, ' ');
        const tagList = tagsListString.split(' ');
        setFilterRuleList((prevRules: FilterRules) => {
            if (tagList[0] !== "" && tagList.length) {
                return {...prevRules, tags: tagList};
            }
            return {...prevRules, tags: []};
        });
    }



    const [ categoryList, setCategoryList ] = useState([]);

    // Взятие списка категорий из БД
    useEffect(() => {
        const foo = async() => {
            const res = await fetch('api/categories', {
                method: 'POST'
            });
            if (res.ok) {
                const fetchData = await res.json();
                setCategoryList(fetchData);
            } else {
                console.log('Something went wrong');
            }
        }

        foo();
    }, []);
    


    const removeSort = (e) => {
        e.preventDefault();
        
        setFilterRuleList({
            timeFrom: undefined,
            timeTo: undefined,
            timeOrder: undefined,
            category: undefined,
            tags: [],
            favoriteOrder: undefined
        });

    }

    

    return (
        <section className={style.filter}>

            <div className={style.timeInterval}>
                <div>
                    <label htmlFor="timeFrom">Время от</label>
                    <input id='timeFrom' type="datetime-local" onChange={changeTimeFrom}/>
                </div>
                <div>
                    <label htmlFor="timeTo">Время до</label>
                    <input id='timeTo' type="datetime-local" onChange={changeTimeTo}/>
                </div>
            </div>

            <div className={style.timeOrder}>
                <button onClick={changeTimeOrderUp}>
                    Сначала новые
                </button>
                <button onClick={changeTimeOrderDown}>
                    Сначала старые
                </button>
            </div>

            <p>
                Категория:
            </p>
            <div className={style.categories}>
                {
                    categoryList.map((category, index) => {
                        return (
                            <div key={index}>
                                <input 
                                    id={category.category_name} 
                                    value={category.category_id} 
                                    type="radio" name="category" 
                                    onClick={changeCategory}
                                />
                                <label htmlFor={category.category_name}>{category.category_name}</label>
                            </div>
                        )
                    })
                }
            </div>

            <div>
                <button onClick={sortByFavorite}>
                    Отсортировать по избранному
                </button>
            </div>

            <div>
                <label htmlFor="tagList">Список тегов:</label>
                <input id="tagList" type="text" name='tagList' onChange={changeTags}/>
            </div>

            <button onClick={removeSort}>Отменить сортировку</button>
        </section>
    )
}
