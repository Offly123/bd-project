'use server'

import { ImageInfo } from "$/ImageCard";
import { connectToDB, disconnectFromDB, showDBError } from "../db";



export async function POST(req: Request): Promise<Response> {
    const con = await connectToDB();



    const sqlImageList = `
    SELECT i.image_id, file_name as src, upload_time as uploadTime, category_name, COUNT(DISTINCT fi.user_id) as favoriteCount, GROUP_CONCAT(DISTINCT tag) as tags from images i 
    LEFT JOIN favorite_images fi ON i.image_id=fi.image_id 
    JOIN categories c ON c.category_id=i.category_id 
    JOIN image_tags it ON i.image_id=it.image_id 
    GROUP BY i.image_id, file_name, category_name;
    `;
    let imageList;
    try {
        imageList= await con.execute(sqlImageList);
        imageList = imageList[0];
    } catch (err) {
        return await showDBError(con, err);
    }



    await disconnectFromDB(con);



    imageList.forEach((image) => {
        image.uploadTime = new Date(image.uploadTime).getTime();
        image.tags = image.tags.split(', ');
    });


    return new Response(JSON.stringify(imageList));
}