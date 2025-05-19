'use server'

import { cookies } from 'next/headers';

import { getSHA256, connectToDB, showDBError } from '../db';
import { createJWT } from '../jwt';

interface LoginData {
    user_login: string,
    user_password: string
}


export async function POST(req: Request): Promise<Response> {
    const loginData: LoginData = await req.json();

    const connection = await connectToDB();

    if (connection.type === Response) {
        return connection;
    }



    let answerDB;
    const sqldbHash = `
    SELECT user_id, user_password FROM users
    WHERE user_login=?;
    `;
    try {
        answerDB = await connection.execute(sqldbHash, [loginData.user_login]);
        answerDB = answerDB[0][0];
    } catch (err) {
        return await showDBError(connection, err);
    }
    


    connection.end();

    // Если неправильный логин/пароль - возвращаем ошибку
    if (!answerDB || 
        !loginData.user_password || 
        isEmpty(loginData.user_password) || 
        getSHA256(loginData.user_password) !== answerDB.user_password
    ) {
        return new Response(JSON.stringify({user_password: {
            error: true,
            message: 'Неправильный логин или пароль'
        }}))
    }



    // Получаем куки (или чё-то подобное)
    const cookieStore = await cookies();

    // Генерируем JWT и вставляем в куки
    const userId = answerDB.user_id;
    const jwtLifeTime = 60 * 60 * 24 * 14; // 2 недели
    const jwtSecret: any = process.env.JWT_KEY;
    const JWT = createJWT({
        userId: userId, 
        role: loginData.user_login === 'admin' ? 'admin' : 'client'
    }, jwtSecret, jwtLifeTime);
    cookieStore.set('session', JWT, {httpOnly: true, maxAge: jwtLifeTime, path: '/'});

    return new Response(JSON.stringify({}));
}


const isEmpty = (obj: Object) => {
    return Object.keys(obj).length === 0;
}
