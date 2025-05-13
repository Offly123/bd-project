'use server'

import { cookies } from 'next/headers';

import { getSHA256, connectToDB, showDBError, disconnectFromDB } from '../db';
import { decodeJWT, isValideJWT, JWT } from '../jwt';

export async function POST(req: Request): Promise<Response> {
    const favoriteImageId = (await req.json()).image_id;

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

    const userId = decodedJwt.payload.clientId;



    const con = await connectToDB();
    


    const sqlInsertFavorite = `
    DELETE FROM favorite_images
    WHERE user_id=? AND image_id=?;
    `;
    try {
        await con.execute(sqlInsertFavorite, [userId, favoriteImageId]);
    } catch (err) {
        return await showDBError(con, err);
    }



    await disconnectFromDB(con);

    
    return new Response(JSON.stringify({id: userId, img: favoriteImageId}));
}
