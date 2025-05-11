CREATE TABLE users (
    user_id         INT AUTO_INCREMENT PRIMARY KEY,
    user_login      VARCHAR(50) NOT NULL UNIQUE,
    user_password   VARCHAR(100) NOT NULL
);

-- У каждой картинки одна категория
CREATE TABLE categories (
    category_id     INT AUTO_INCREMENT PRIMARY KEY,
    category_name   VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE images (
    image_id    INT AUTO_INCREMENT PRIMARY KEY,
    file_name   VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
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
('Cyberpunk');



-- users

-- Вставка нового пользователя
INSERT INTO users
    (user_login, user_password)
VALUES (?, ?);

-- Получение пароля пользователя
SELECT user_id, user_password FROM users
WHERE user_login=?;