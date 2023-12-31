# fromni-test

Сервис для настройки рассылок на языке JavaScript. Написан с использованием фреймворков Vue, Express. В качестве базы данных используется PostgreSQL.

## Установка и запуск

1. Склонируйте репозиторий:

   
   git clone https://github.com/Ivansergee/fromni-test.git
   

2. Установите зависимости при помощи для frontend и server:
    ```
    cd server
    npm install
    ```

    ```
    cd frontend
    npm install
    ```

3. В директории `server` создайте файл `.env` и задайте в нём параметры подключения по примеру `.env.example`:


4. Запустите приложение:
    Для сервера:
   ```
    cd server
   node app.js
   ```

    ```
    cd frontend
    npm run serve
    ```

## Структура БД

```sql
CREATE TABLE public.campaigns (
    id serial PRIMARY KEY,
    name character varying
);

CREATE TABLE messengers
(
    id serial PRIMARY KEY,
    name character varying,
    max_chars integer,
    kb_std_enabled boolean,
    kb_std_max_buttons integer,
    kb_std_max_button_len integer,
    kb_std_links_enabled boolean,
    kb_inline_enabled boolean,
    kb_inline_max_buttons integer,
    kb_inline_max_button_len integer,
    kb_inline_links_enabled boolean,
    kb_inline_max_links integer,
    kb_std_max_links integer
);

CREATE TABLE messages
(
    id serial PRIMARY KEY,
    campaign_id integer REFERENCES campaigns (id),
    messenger_id integer REFERENCES messengers (id),
    text varchar,
    keyboard_type varchar,
    "order" integer
);

CREATE TABLE buttons
(
    id serial PRIMARY KEY,
    message_id integer REFERENCES messages (id),
    text varchar,
    type varchar
);

INSERT INTO messengers(
	name, max_chars, kb_std_enabled, kb_std_max_buttons, kb_std_max_button_len, kb_std_links_enabled, kb_inline_enabled, kb_inline_max_buttons, kb_inline_max_button_len, kb_inline_links_enabled, kb_inline_max_links, kb_std_max_links)
	VALUES ('Telegram', 4096, TRUE, 0, 0, FALSE, TRUE, 0, 64, TRUE, 0, 0),
	('VK', 4096, TRUE, 40, 0, TRUE, TRUE, 10, 0, TRUE, 0, 0),
	('WhatsApp', 1000, TRUE, 10, 20, FALSE, TRUE, 3, 20, TRUE, 1, 0),
	('SMS', 0, FALSE, 0, 0, FALSE, FALSE, 0, 0, FALSE, 0, 0);

```