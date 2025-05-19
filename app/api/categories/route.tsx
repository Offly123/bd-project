'use server'

import { cookies } from "next/headers";

import { isValideJWT, decodeJWT, JWT } from "../jwt";
import { connectToDB, disconnectFromDB, showDBError } from "../db";



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

    if (!isValideJWT(decodedJwt, jwtSecret) || decodedJwt.payload.role !== 'admin') {
        cookieStore.delete('session');
        return new Response(JSON.stringify({error: true, message: 'Invalid jwt'}));
    }



    const con = await connectToDB();



    const sqlGetCategories = `
    SELECT * FROM categories;
    `;
    let categoriesJsons: Array<Object>;
    try {
        const DBresponse = await con.execute(sqlGetCategories);
        categoriesJsons = DBresponse[0];
    } catch (err) {
        return await showDBError(con, err);
    }
    
    console.log(categoriesJsons);



    await disconnectFromDB(con);



    return new Response(JSON.stringify(categoriesJsons));
}