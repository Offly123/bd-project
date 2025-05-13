import { createHash } from "crypto";
import mysql from 'mysql2/promise';



export function getSHA256(str: string): string {
    return createHash('sha256').update(str).digest('base64url');
}

export async function connectToDB(): Promise<any> {
    let connection: any;
    try {
        connection = await mysql.createConnection({
            host:       process.env.DBHOST,
            user:       process.env.DBUSER,
            password:   process.env.DBPSWD,
            database:   process.env.DBNAME
        });
    } catch (err) {
        console.log(err);
        return new Response(JSON.stringify({ssdfg: {
            error: true,
            message: 'Что-то пошло не так'
        }}));
    }
    
    return connection;
}

export async function disconnectFromDB(connection: any) {
    connection.commit();
    connection.end();
}

export async function showDBError(connection: any, err: any): Promise<Response> {
    await connection.rollback();
    await connection.end();
    console.log(err);
    return new Response(JSON.stringify({sssdfg: {
        error: true,
        message: 'Что-то пошло не так'
    }}));
}
