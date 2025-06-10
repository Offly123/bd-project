'use server'

import fs from 'fs';
import { headers } from 'next/headers';
import path from 'path';

export async function POST(req: Request): Promise<Response> {
    const filename: string = (await req.json()).src;

    const filePath = path.join(process.cwd(), 'public/', filename);

    console.log(filePath);

    if (!fs.existsSync(filePath)) {
        return new Response(JSON.stringify({message: 'File not found'}))
    }


    
    const fileStream = fs.createReadStream(filePath);
    fileStream.on('error', (err) => {
        console.error('Ошибка при чтении файла: ', err);
        return new Response(JSON.stringify({message: 'Error'}), {status: 500});
    })

    return new Response(fileStream, {
        headers: {
            'Content-Disposition': `attachment; filename=${filePath.split('/').pop()}`,
            'Content-Type': 'application/octet-stream'
        }
    });
}