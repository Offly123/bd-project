'use server'

import { cookies } from "next/headers";

import { JWT, decodeJWT, isValideJWT } from "../jwt";



export async function GET(req: Request): Promise<Response> {
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
        return new Response(JSON.stringify({role: 'user'}));
    }

    return new Response(JSON.stringify( {role: decodedJwt.payload.role} ) );
}