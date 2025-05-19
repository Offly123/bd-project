'use server'

import { writeFile } from 'fs/promises';
import path from 'path';

import { connectToDB, disconnectFromDB, showDBError } from '../db';



export async function POST(req: Request): Promise<Response> {
    const formData = await req.formData();

    
    const file = formData.get('file');

    if (!file || file === 'undefined') {
        return new Response(JSON.stringify({sssdfg: 'error'}));
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name;
    
    
    
    const con = await connectToDB();
    
    
    
    // Получаем текущий автоинкремент (АБСОЛЮТНО ненормальный способ)
    let currentIncrement;
    currentIncrement = (await con.execute('SHOW CREATE TABLE images;'))[0][0]['Create Table'].split('AUTO_INCREMENT=')[1];
    currentIncrement = currentIncrement ? currentIncrement[0][0]['Create Table'].split('AUTO_INCREMENT=')[1].split(' ')[0] : 1;

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
        await writeFile(path.join('/home/public/images/', currentIncrement + filename), buffer);
    } catch (err) {
        console.log(err);
        return new Response(JSON.stringify({}));
    }


    console.log(formData);
    // Вставляем картинку в БД
    const sqlInsertImages = `
    INSERT IGNORE INTO images
    (file_name, category_id)
    VALUES (?, ?);
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
        promises = [...promises, con.execute(sqlInsertImages, [path.join('/images/', currentIncrement + filename), category_id])];
        promises = [...promises, tags.map((tag) => {
            return con.execute(sqlInsertImageTags, [currentIncrement, tag]);
        })];
        Promise.all(promises);
    } catch (err) {
        return await showDBError(con, err);
    }



    await disconnectFromDB(con);
    


    return new Response(JSON.stringify({}));
}
