'use server'

import { cookies } from 'next/headers';

import { getSHA256, connectToDB, showDBError, disconnectFromDB } from '../db';
import { decodeJWT, isValideJWT, JWT } from '../jwt';

export async function POST(req: Request): Promise<Response> {
    const favoriteImageId = (await req.json()).image_id;

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
    


    const sqlInsertFavorite = `
    INSERT IGNORE INTO favorite_images
    (user_id, image_id)
    VALUES (?, ?);
    `;
    let affectedRows;
    try {
        affectedRows = await con.execute(sqlInsertFavorite, [userId, favoriteImageId]);
        affectedRows = affectedRows[0].affectedRows;
    } catch (err) {
        return await showDBError(con, err);
    }



    await disconnectFromDB(con);

    if (affectedRows !== 0) {
        return new Response(JSON.stringify({error: false}));
    }
    return new Response(JSON.stringify({error: true}));
}
