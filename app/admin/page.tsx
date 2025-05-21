'use client'

import React, { useEffect, useState } from 'react'

import { ImageInfo } from '$/ImageCard'
import AdminImageCard from '$/AdminImageCard';

import style from '@/admin/admin.module.scss'
import Form from '$/Form';
import TextInput from '$/TextInput';



export default function Main() {

    const [ imageList, setImageList ] = useState< Array<ImageInfo> >([]);

    // Взятие картинок из БД
    useEffect(() => {
        const foo = async () => {
            const res = await fetch('/api/admin', {
                method: 'POST'
            });
            if (res.ok) {
                const fetchData = await res.json();
                setImageList(fetchData);
            } else {
                console.log('Something went wrong');
            }
        }

        foo();
    }, []);

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

    const sendImage = async (e) => {
        e.preventDefault();
        const inputImage: HTMLInputElement = document.querySelector('#imageInput');
        const inputCategory: HTMLInputElement = document.querySelector('[name=category]:checked')
        const inputTags: HTMLInputElement = document.querySelector('[name=tags]')
        const fd = new FormData();
        fd.append('file', inputImage.files[0]);
        fd.append('category_id', inputCategory?.value);
        fd.append('tags', inputTags?.value);
        const res = await fetch('api/addImage', {
            method: 'POST',
            body: fd
        });
    }

    return (
        <>
            {
                categoryList && categoryList.length ?
                <form className={style.form} action='/api/addImage' method='POST'>
                <div className={style.head}>
                    <h2>
                        Загрузить картинку
                    </h2>
                </div>
                <div className={style.main}>
                    <div className={style.input}>
                        <label htmlFor="category">Категория</label>
                        {
                            // До ста категорий, в идеале убрать костыль с умножением
                            categoryList && categoryList.length ?
                            categoryList.map((category, index) => (
                                <div key={index} className={style.radioInput}>
                                    <input type="radio" name="category" id={category.category_id} value={category.category_id} />
                                    <label htmlFor={`${category.category_id}`}>{category.category_name}</label>
                                </div>
                            )) :
                            <p>Yo</p>
                        }
                    </div>
                    <div className={style.input}>
                        <label htmlFor="tags">Теги</label>
                        <input name="tags" type="text" />
                    </div>
                    <div className={style.input}>
                        <label htmlFor="imageInput">
                            Выбрать файл
                        </label>
                        <input id="imageInput" name="imageInput" type="file" />
                    </div>
                </div>
                <div className={style.end}>
                    <button onClick={sendImage} type='submit'>
                        Отправить
                    </button>
                </div>
            </form> :
            <p>Ошибка при получении категорий</p>
            }
            <div className={style.imageList}>
                {
                    imageList && imageList.length ? 
                    imageList.map((image: ImageInfo, index) => (
                        // Тот самый костыль
                        <AdminImageCard key={index * 100 + 1} imageData={image}/>
                    )) :
                    <p>Ошибка при получении картинок</p>
                }
            </div>
        </>
    )
}
