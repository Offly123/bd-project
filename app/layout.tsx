import React from 'react';

export default function Layout({ 
    children 
} : {
    children: React.ReactNode
}) {
    return (
        <html>
            <head></head>
            <body>
                <div>Взорванный хэдер</div>
                <main>{ children }</main>
            </body>
        </html>
    )
}