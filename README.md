Сам репозиторий только для js, надо рядом создать папку с именем sql. В неё докерфайл

```Dockerfile
FROM mysql:latest
```

Потом создать compose.yaml снаружи этих папок
```compose
services:
    nextjs:
        image: "project:js"
        ports:
            - "80:3000"
        container_name: project-js
        volumes:
            - /home/offly/Desktop/project/js:/home/
    mysql:
        image: "project:sql"
        ports: 
            - "3306"
        environment:
            MYSQL_ROOT_PASSWORD: root
            MYSQL_ROOT_USER: root
        container_name: project-sql
```

volumes перед : поменять на папку в которую скачал js

Потом прописать в консоль в папке js:
sudo apt install npm

npm install next@latest react@latest react-dom@latest

// Это не факт что правильно
npm install

// Потом зайти в консоль mysql под рутом (mysql -uroot -p) (пароль root)
CREATE DATABASE project;
CREATE USER 'project'@'%' IDNTIDIED WITH caching_sha2_password BY 'password';
GRANT ALL PRIVELEGES ON 'project'.* TO 'project'@'%';

Ещё из файла sql.sql вставить все таблицы

Ещё создать Makefile 

```Makefile
all:
	docker compose up

build:
	docker build -t project:sql ./sql/.
	docker build -t project:js ./js/.

nextjs:
	docker exec -it project-js bash

mysql:
	docker exec -it project-sql bash
```

Потом make build чтобы создать образы

Потом просто make и оно запуститься должно
