CREATE TABLE users (
    user_id         INT AUTO_INCREMENT PRIMARY KEY,
    user_login      VARCHAR(50) NOT NULL UNIQUE,
    user_password   VARCHAR(100) NOT NULL
);

-- У каждой картинки тоьлько одна категория
CREATE TABLE categories (
    category_id     INT AUTO_INCREMENT PRIMARY KEY,
    category_name   VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE images (
    image_id    INT AUTO_INCREMENT PRIMARY KEY,
    file_name   VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    upload_time DATETIME,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT
);

CREATE TABLE image_tags (
    image_id    INT NOT NULL,
    tag         VARCHAR(50) NOT NULL,
    FOREIGN KEY (image_id) REFERENCES images(image_id) ON DELETE CASCADE
);

CREATE TABLE favorite_images (
    user_id     INT NOT NULL,
    image_id    INT NOT NULL,
    PRIMARY KEY (user_id, image_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES images(image_id) ON DELETE CASCADE
);

-- Очищение таблиц
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE users;
TRUNCATE images;
TRUNCATE image_tags;
TRUNCATE favorite_images;
TRUNCATE categories;

SET FOREIGN_KEY_CHECKS = 1;

-- Вставка категорий
INSERT INTO categories 
    (category_name) 
VALUES
('Movies'),
('TV Shows'),
('Games'),
('Nature'),
('Celebrities'),
('Characters'),
('Space'),
('Cyberpunk'),
('City'),
('Illustration'),
('Mystic');



-- USERS

-- Вставка нового пользователя
INSERT INTO users
    (user_login, user_password)
VALUES (?, ?);

-- Получение пароля пользователя
SELECT user_id, user_password FROM users
WHERE user_login=?;



-- CATEGORIES

-- Получить все категории
SELECT category_name FROM categories;



-- IMAGES

-- Получить все картинки
SELECT i.image_id, file_name as src, category_name, COUNT(DISTINCT fi.user_id) as favoriteCount, GROUP_CONCAT(DISTINCT tag) as tags from images i 
LEFT JOIN favorite_images fi ON i.image_id=fi.image_id 
JOIN categories c ON c.category_id=i.category_id 
JOIN image_tags it ON i.image_id=it.image_id 
GROUP BY i.image_id, file_name, category_name;

-- Добавить картинку
INSERT IGNORE INTO images
    (file_name, category_id)
VALUES (?, ?);

INSERT IGNORE INTO favorite_images
    (image_id, user_id)
VALUES (?, ?);

INSERT IGNORE INTO image_tags
    (image_id, tag)
VALUES (?, ?);

-- Получить автоинкремент (почему-то не работает) (уже работает)
SELECT AUTO_INCREMENT 
FROM  INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'project' 
AND   TABLE_NAME   = 'images';

-- Удалить картинку (из картинок, избранных и тегов)
DELETE FROM images
WHERE image_id=?;

DELETE FROM favorite_images
WHERE image_id=?;

DELETE FROM image_tags
WHERE image_id=?;

-- Получить список картинок не старше недели, у которых есть теги, 
-- которые есть у картинок, добавленных пользователем, 
-- и отсортировать по количеству избранных
SELECT
    i.image_id,
    i.file_name as src,
    category_name,
    COUNT(DISTINCT fi.user_id) as favoriteCount,
    GROUP_CONCAT(DISTINCT it4.tag) as tags
FROM
    images i
LEFT JOIN 
    favorite_images fi ON i.image_id = fi.image_id
LEFT JOIN 
    image_tags it4 ON i.image_id = it4.image_id
LEFT JOIN 
    categories c ON i.category_id = c.category_id
WHERE
    i.upload_time >= NOW() - INTERVAL 7 DAY
    AND i.image_id IN (
    SELECT 
        i2.image_id
    FROM 
        images i2
    LEFT JOIN 
        favorite_images f ON i2.image_id = f.image_id
    LEFT JOIN 
        image_tags it ON i2.image_id = it.image_id
    WHERE 
        i2.image_id IN (
            SELECT DISTINCT it2.image_id
            FROM image_tags it2
            WHERE it2.tag IN (
                SELECT DISTINCT it3.tag
                FROM images img
                JOIN image_tags it3 ON img.image_id = it3.image_id
                WHERE img.image_id IN (
                    SELECT image_id 
                    FROM favorite_images 
                    WHERE user_id = 2
                )
            )
        )
    ) 
    AND i.image_id NOT IN (
        SELECT
            fi2.image_id
        FROM 
            favorite_images fi2
        WHERE
            fi2.user_id = 2
    )
GROUP BY
    i.image_id, file_name, category_name
ORDER BY
    favoriteCount DESC
LIMIT 50;



-- IMAGE_TAGS

-- Добавить тег картинки
INSERT IGNORE INTO image_tags
    (image_id, tag)
VALUES (?, ?);



-- FAVORITE_IMAGES

-- Добавить картинку в избранное
INSERT IGNORE INTO favorite_images
    (user_id, image_id)
VALUES (?, ?);

-- Удалить картинку из избранного
DELETE FROM favorite_images
WHERE user_id=? AND image_id=?;

-- Получить список избранных картинок пользователя
SELECT i.image_id, file_name as src, category_name, COUNT(DISTINCT fi.user_id) as favoriteCount, GROUP_CONCAT(DISTINCT tag) as tags from images i
JOIN 
    favorite_images fi ON i.image_id=fi.image_id AND i.image_id IN (
        SELECT fi2.image_id FROM favorite_images fi2 
        WHERE fi2.user_id = ?
    )
JOIN categories c ON c.category_id=i.category_id 
JOIN image_tags it ON i.image_id=it.image_id 
GROUP BY i.image_id, file_name, category_name;
