'use server'

import { cookies } from "next/headers";

import { connectToDB, disconnectFromDB, showDBError } from "../db";
import { isValideJWT, decodeJWT, JWT } from "../jwt";



export async function POST(req: Request): Promise<Response> {
    const cookieStore = (await cookies());

    // Получаем JWT из куков
    const clientJwt: string | undefined = cookieStore.get('session')?.value;
    if (!clientJwt) {
        return new Response(JSON.stringify({error: true, message: 'No jwt'}));
    }

    // Декодируем JWT и проверяем его валидность
    const decodedJwt: JWT = decodeJWT(clientJwt);
    const jwtSecret: string | undefined = process.env.JWT_KEY;

    if (!isValideJWT(decodedJwt, jwtSecret)) {
        cookieStore.delete('session');
        return new Response(JSON.stringify({error: true, message: 'Invalid jwt'}));
    }

    const userId = decodedJwt.payload.userId;



    const con = await connectToDB();



    const sqlImageList = `
    SELECT i.image_id, file_name as src, category_name, COUNT(DISTINCT fi.user_id) as favoriteCount, GROUP_CONCAT(DISTINCT tag) as tags from images i
    JOIN favorite_images fi ON i.image_id=fi.image_id AND fi.user_id=?
    JOIN categories c ON c.category_id=i.category_id 
    JOIN image_tags it ON i.image_id=it.image_id
    GROUP BY i.image_id, file_name, category_name
    `;
    let imageList;
    try {
        imageList = await con.execute(sqlImageList, [userId]);
        imageList = imageList[0];
    } catch (err) {
        return await showDBError(con, err);
    }

    console.log('\n\n\n');
    console.log(userId);

    await disconnectFromDB(con);



    imageList.forEach((image) => {
        image.tags = image.tags.split(', ');
    });

    return new Response(JSON.stringify(imageList));
}