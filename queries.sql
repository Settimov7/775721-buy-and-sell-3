--Получить список всех категорий (идентификатор, наименование категории);
SELECT
  id AS "Идентификатор",
  title AS "Наименование категории"
FROM categories;

--Получить список категорий для которых создано минимум одно объявление (идентификатор, наименование категории);
SELECT
	categories.id AS "Идентификатор",
	categories.title AS "Наименование"
FROM categories
INNER JOIN offers_categories
	ON offers_categories.category_id = categories.id
GROUP BY categories.id, categories.title;

--Получить список категорий с количеством объявлений
--  (идентификатор, наименование категории, количество объявлений в категории);
SELECT
	categories.id AS "Идентификатор",
	categories.title AS "Наименование",
	count(offers_categories.offer_id) AS "Количество объявлений в категории"
FROM categories
INNER JOIN offers_categories
	ON offers_categories.category_id = categories.id
GROUP BY categories.id, categories.title;

--Получить список объявлений (идентификатор объявления, заголовок объявления, стоимость, тип объявления,
--текст объявления, дата публикации, имя и фамилия автора, контактный email, количество комментариев, наименование категорий).
--Сначала свежие объявления;
SELECT
  offers.id AS "Идентификатор",
  offers.title AS "Заголовок",
  offers.sum AS "Стоимость",
  offers.type AS "Тип объявления",
  offers.description AS "Текст объявления",
  offers.created_date AS "Дата публикации",
  concat(users.first_name, ' ', users.last_name) AS "Имя и фамилия автора",
  users.email AS "Контактный email",
  count(distinct comments.id) AS "Количество комментариев",
  string_agg(distinct categories.title, ', ') AS "Наименование категорий"
FROM offers
  INNER JOIN users
    ON users.id = offers.user_id
  INNER JOIN offers_categories
    ON offers_categories.offer_id = offers.id
  INNER JOIN categories
    ON categories.id = offers_categories.category_id
  INNER JOIN comments
    ON comments.offer_id = offers.id
GROUP BY
  offers.id,
  offers.title,
  offers.sum,
  offers.type,
  offers.description,
  offers.created_date,
  concat(users.first_name, ' ', users.last_name),
  users.email
ORDER BY
  offers.created_date DESC;

--Получить полную информацию определённого объявления (идентификатор объявления,
--заголовок объявления, стоимость, тип объявления, текст объявления, дата публикации, имя и фамилия автора,
--контактный email, количество комментариев, наименование категорий);
SELECT
  offers.id AS "Идентификатор",
  offers.title AS "Заголовок",
  offers.sum AS "Стоимость",
  offers.type AS "Тип объявления",
  offers.description AS "Текст объявления",
  offers.created_date AS "Дата публикации",
  concat(users.first_name, ' ', users.last_name) AS "Имя и фамилия автора",
  users.email AS "Контактный email",
  count(distinct comments.id) AS "Количество комментариев",
  string_agg(distinct categories.title, ', ') AS "Наименование категорий"
FROM offers
  INNER JOIN users
    ON users.id = offers.user_id
  INNER JOIN offers_categories
    ON offers_categories.offer_id = offers.id
  INNER JOIN categories
    ON categories.id = offers_categories.category_id
  INNER JOIN comments
    ON comments.offer_id = offers.id
WHERE offers.id = 1
GROUP BY
  offers.id,
  offers.title,
  offers.sum,
  offers.type,
  offers.description,
  offers.created_date,
  concat(users.first_name, ' ', users.last_name),
  users.email

--Получить список из 5 свежих комментариев (идентификатор комментария, идентификатор объявления, имя и фамилия автора, текст комментария);
SELECT
  comments.id AS "Идентификатор комментария",
  comments.offer_id AS "Идентификатор объявления",
  concat(users.first_name, ' ', users.last_name) AS "Имя и фамилия автора",
  comments.message AS "Текст комментария"
FROM comments
  INNER JOIN users
    ON users.id = comments.user_id
ORDER BY
  comments.created_date DESC
LIMIT 5;

--Получить список комментариев для определённого объявления (идентификатор комментария, идентификатор объявления, имя и фамилия автора, текст комментария). Сначала новые комментарии;
SELECT
  comments.id AS "Идентификатор комментария",
  comments.offer_id AS "Идентификатор объявления",
  concat(users.first_name, ' ', users.last_name) AS "Имя и фамилия автора",
  comments.message AS "Текст комментария"
FROM comments
  INNER JOIN users
    ON users.id = comments.user_id
WHERE comments.offer_id = 1
ORDER BY
  comments.created_date DESC;

--Выбрать 2 объявления, соответствующих типу «куплю»;
SELECT * FROM offers
WHERE offers.type = 'buy'
LIMIT 2;

--Обновить заголовок определённого объявления на «Уникальное предложение!»;
UPDATE offers
  set title = 'Уникальное предложение!'
WHERE offers.id = 1;

