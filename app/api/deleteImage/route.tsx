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

    if (!isValideJWT(decodedJwt, jwtSecret) || decodedJwt.payload.role !== 'admin') {
        cookieStore.delete('session');
        return new Response(JSON.stringify({error: true, message: 'Invalid jwt'}));
    }



    const con = await connectToDB();
    con.beginTransaction();
    


    const sqlDeleteImages = `
    DELETE FROM images
    WHERE image_id=?;
`
    const sqlDeleteFavoriteImages = `
    DELETE FROM favorite_images
    WHERE image_id=?;
    `
    const sqlDeleteImageTags = `
    DELETE FROM image_tags
    WHERE image_id=?;
    `;
    try {
        let promises: Array<any> = [];
        promises = [...promises, con.execute(sqlDeleteImages, [favoriteImageId])];
        promises = [...promises, con.execute(sqlDeleteFavoriteImages, [favoriteImageId])];
        promises = [...promises, con.execute(sqlDeleteImageTags, [favoriteImageId])];
        await Promise.all(promises);
    } catch (err) {
        return await showDBError(con, err);
    }



    await disconnectFromDB(con);

    

    return new Response(JSON.stringify({}));
}
