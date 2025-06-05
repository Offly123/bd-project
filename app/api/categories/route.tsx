'use server'

import { cookies } from "next/headers";

import { isValideJWT, decodeJWT, JWT } from "../jwt";
import { connectToDB, disconnectFromDB, showDBError } from "../db";



export async function POST(req: Request): Promise<Response> {


    
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



    await disconnectFromDB(con);



    return new Response(JSON.stringify(categoriesJsons));
}