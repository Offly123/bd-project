'use client'

export function getCookies(): {[key: string]: any} {
    const cookieArray: Array<string> = document.cookie.split('; ');
    let cookieObject: Object = {};
    cookieArray.forEach((cook) => {
        cookieObject[cook.split('=')[0]] = cook.split('=')[1];
    })

    return cookieObject;
}