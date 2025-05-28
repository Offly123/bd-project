'use client'

import React, { useState } from "react";

import { ImageInfo } from "$/ImageCard"
import { findSourceMap } from "module";

import style from '@/filter.module.scss';



export interface FilterRules {
    // Сортировка по дате ОТ и ДО, по убыванию или возрастанию
    timeFrom: number | undefined,
    timeTo: number | undefined,
    timeOrder: 'up' | 'down' | undefined,

    // Какие теги должны быть у картинки
    tags: Array<string>,

    // Сортировка по количеству избранных по убыванию или возрастанию
    favoriteOrder: 'up' | 'down' | undefined,
}

export default function Filter({
    setFilterRuleList
} : {
    setFilterRuleList: React.Dispatch< React.SetStateAction< FilterRules > >
}) {

    const sortByFavorite = (e) => {
        e.preventDefault();

        setFilterRuleList((prevRules: FilterRules) => {
            return {...prevRules, favoriteOrder: 'down'}
        })
    }

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

    const removeSort = (e) => {
        e.preventDefault();

        setFilterRuleList((prevRules: FilterRules) => {
            const newFilterRuleList = { ...prevRules };
            Object.keys(newFilterRuleList).forEach(key => {
                newFilterRuleList[key] = undefined;
            });
            return newFilterRuleList;
        });

    }

    return (
        <div className={style.filter}>
            <button onClick={sortByFavorite}>
                Отсортировать по избранному
            </button>

            <div>
                <label htmlFor="timeFrom">Время от</label>
                <input id='timeFrom' type="datetime-local" onChange={changeTimeFrom}/>

                <label htmlFor="timeTo">Время до</label>
                <input id='timeTo' type="datetime-local" onChange={changeTimeTo}/>
            </div>


            <button onClick={removeSort}>Отменить сортировку</button>
        </div>
    )
}
