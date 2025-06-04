'use server'

import { writeFile } from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';

import { connectToDB, disconnectFromDB, showDBError } from '../db';
import { decodeJWT, isValideJWT, JWT } from '../jwt';



export async function POST(req: Request): Promise<Response> {
    const cookieStore = await cookies();

    // Получаем JWT из куков
    const adminJwt: string | undefined = cookieStore.get('session')?.value;
    if (!adminJwt) {
        return new Response(JSON.stringify({error: true, message: 'No jwt'}));
    }

    // Декодируем JWT и проверяем его валидность
    const decodedJwt: JWT = decodeJWT(adminJwt);
    const jwtSecret: string | undefined = process.env.JWT_KEY;

    if (!isValideJWT(decodedJwt, jwtSecret) || decodedJwt.payload.role !== 'admin') {
        cookieStore.delete('session');
        return new Response(JSON.stringify([]));
    }


    const formData = await req.formData();

    
    const file = formData.get('file');

    if (!file || file === 'undefined') {
        return new Response(JSON.stringify({sssdfg: 'error'}));
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name;
    const fileExtension = '.' + filename.split('.')[filename.split('.').length - 1];
    
    
    
    const con = await connectToDB();
    
    
    
    // Получаем текущий автоинкремент (АБСОЛЮТНО ненормальный способ)
    let currentIncrement;
    // currentIncrement = (await con.execute('SHOW CREATE TABLE images;'))[0][0]['Create Table']?.split('AUTO_INCREMENT=')[1];
    currentIncrement = (await con.execute('SHOW CREATE TABLE images;'))[0][0]['Create Table'].split('AUTO_INCREMENT=')[1];
    // currentIncrement = (await con.execute('SHOW CREATE TABLE images;'))[0][0]['Create Table'];
    // console.log(currentIncrement);
    currentIncrement = currentIncrement ? currentIncrement.split(' ')[0] : 1;
    // console.log("\n\nINECREMENT:" + currentIncrement);

    
    // Нормальный способ, но он не работает
    // let currentIncrement;
    // try {
    //     currentIncrement = await con.execute(sqlGetIncrement);
    //     currentIncrement = currentIncrement[0][0].AUTO_INCREMENT;
    // } catch (err) {
    //     return await showDBError(con, err);
    // }



    // Загружаем картинку на сервер
    try {
        await writeFile(path.join('/home/public/images/', currentIncrement + fileExtension), buffer);
    } catch (err) {
        console.log(err);
        return new Response(JSON.stringify({}));
    }


    // Вставляем картинку в БД
    // console.log(formData);
    const sqlInsertImages = `
    INSERT IGNORE INTO images
    (file_name, category_id, upload_time)
    VALUES (?, ?, ?);
    `;
    const category_id = formData.get('category_id');
    const tags = formData.get('tags').split(' ');
    const sqlInsertImageTags = `
    INSERT IGNORE INTO image_tags
    (image_id, tag)
    VALUES (?, ?);
    `;
    try {
        let promises: Array<any> = [];

        promises = [...promises, con.execute(sqlInsertImages, [
            path.join('/images/', currentIncrement + fileExtension), 
            category_id,
            new Date()
        ])];

        promises = [...promises, tags.map((tag) => {
            return con.execute(sqlInsertImageTags, [currentIncrement, tag]);
        })];

        await Promise.all(promises);
    } catch (err) {
        return await showDBError(con, err);
    }



    await disconnectFromDB(con);
    


    return new Response(JSON.stringify({}));
}
