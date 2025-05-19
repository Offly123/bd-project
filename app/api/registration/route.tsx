'use server'
import { cookies } from 'next/headers';

import { FormData } from '$/Form';

import { getSHA256, connectToDB, showDBError } from '../db';
import { createJWT } from '../jwt';


interface RegistrationData {
    user_login: string,
    user_password: string
}

export async function POST(req: Request): Promise<Response> {
    const registrationData: RegistrationData = await req.json();
    
    
    const errorList = await getErrorList(registrationData);

    if (!isEmpty(errorList)) {
        return new Response(JSON.stringify(errorList));
    }



    let connection = await connectToDB();
    if (connection.type === Response) {
        return connection;
    }
    


    connection.beginTransaction();



    // Вставка данных пользователя в БД
    const sqlInsertRegistration = `
    INSERT INTO users
    (user_login, user_password)
    VALUES (?, ?);
    `;
    const insertRegistration = [
        registrationData.user_login,
        getSHA256(registrationData.user_password),
    ];

    let DBResponse;
    try {
        DBResponse = await connection.execute(sqlInsertRegistration, insertRegistration);
    } catch (err) {
        return await showDBError(connection, err);
    }



    connection.commit();
    connection.end();

    // Получаем куки (или чё-то подобное)
    const cookieStore = await cookies();


    // Получаем вставленный айди клиента и создаём JWT, 
    // вставляем его в куки как session
    const userId = DBResponse[0].insertId;
    const jwtLifeTime = 60 * 60 * 24 * 14; // 2 недели
    const jwtSecret: any = process.env.JWT_KEY;
    const JWT = createJWT({
        userId: userId, 
        role: registrationData.user_login === 'admin' ? 'admin' : 'user'
    }, jwtSecret, jwtLifeTime);
    cookieStore.set('session', JWT, {httpOnly: true, maxAge: jwtLifeTime, path: '/'});

    return new Response(JSON.stringify({}));
}


const getErrorList = async (registrationData: RegistrationData): Promise<FormData> => {

    let errorList: FormData = {};

    if (!(/^[a-zA-Z0-9_]+$/).test(registrationData.user_login)) {
        errorList = {
            ...errorList, user_login: {
                error: true, 
                message: 'Логин должен состоять только из букв латинского алфавита, цифр и нижних подчёркиваний'
            }
        };
    }

    if (registrationData.user_password.length < 1) {
        errorList = {
            ...errorList, user_password: {
                error: true, 
                message: 'Пароль не меньше 8 символов'
            }
        };
    }

    return errorList;
}


const isEmpty = (obj: Object) => {
    return Object.keys(obj).length === 0;
}
