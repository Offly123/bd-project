'use server'

import { cookies } from "next/headers";

import { ImageInfo } from "$/ImageCard";
import { connectToDB, disconnectFromDB, showDBError } from "../db";
import { decodeJWT, isValideJWT, JWT } from "../jwt";



export async function POST(req: Request): Promise<Response> {
    const cookieStore = (await cookies());

    // Получаем JWT из куков
    const userJwt: string | undefined = cookieStore.get('session')?.value;
    if (!userJwt) {
        return new Response(JSON.stringify({error: true, message: 'No jwt'}));
    }

    // Декодируем JWT и проверяем его валидность
    const decodedJwt: JWT = decodeJWT(userJwt);
    const jwtSecret: string | undefined = process.env.JWT_KEY;

    if (!isValideJWT(decodedJwt, jwtSecret)) {
        cookieStore.delete('session');
        return new Response(JSON.stringify({error: true, message: 'Invalid jwt'}));
    }

    const userId = decodedJwt.payload.userId;



    const con = await connectToDB();



    const sqlImageList = `
    SELECT
    i.image_id,
    i.file_name as src,
    category_name,
    COUNT(DISTINCT fi.user_id) as favoriteCount,
    GROUP_CONCAT(DISTINCT it4.tag) as tags
FROM
    images i
LEFT JOIN 
    favorite_images fi ON i.image_id = fi.image_id
LEFT JOIN 
    image_tags it4 ON i.image_id = it4.image_id
LEFT JOIN 
    categories c ON i.category_id = c.category_id
WHERE
    i.upload_time >= NOW() - INTERVAL 7 DAY
    AND i.image_id IN (
    SELECT 
        i2.image_id
    FROM 
        images i2
    LEFT JOIN 
        favorite_images f ON i2.image_id = f.image_id
    LEFT JOIN 
        image_tags it ON i2.image_id = it.image_id
    WHERE 
        i2.image_id IN (
            SELECT DISTINCT it2.image_id
            FROM image_tags it2
            WHERE it2.tag IN (
                SELECT DISTINCT it3.tag
                FROM images img
                JOIN image_tags it3 ON img.image_id = it3.image_id
                WHERE img.image_id IN (
                    SELECT image_id 
                    FROM favorite_images 
                    WHERE user_id = ?
                )
            )
        )
    ) 
    AND i.image_id NOT IN (
        SELECT
            fi2.image_id
        FROM 
            favorite_images fi2
        WHERE
            fi2.user_id = ?
    )
GROUP BY
    i.image_id, file_name, category_name
ORDER BY
    favoriteCount DESC
LIMIT 9;
    `;
    let imageList;
    try {
        imageList= await con.execute(sqlImageList, [userId, userId]);
        imageList = imageList[0];
    } catch (err) {
        return await showDBError(con, err);
    }


    
    await disconnectFromDB(con);



    imageList.forEach((image) => {
        image.uploadTime = new Date(image.uploadTime).getTime();
        image.tags = image.tags.split(',');
    });


    return new Response(JSON.stringify(imageList));
}