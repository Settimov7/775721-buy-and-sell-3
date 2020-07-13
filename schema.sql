DROP DATABASE IF EXISTS academy_buy_sell;

CREATE DATABASE academy_buy_sell
    WITH
    OWNER = academy_buy_sell
    TEMPLATE = template0
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

DROP TABLE IF EXISTS offers_categories;
DROP TABLE IF EXISTS offers_comments;
DROP TABLE IF EXISTS offers;
DROP TABLE IF EXISTS types;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS users;

CREATE TABLE types
(
	id BIGSERIAL PRIMARY KEY,
	title VARCHAR(25) NOT NULL
);

CREATE TABLE offers
(
	id BIGSERIAL PRIMARY KEY,
	title VARCHAR(100) NOT NULL,
	image TEXT,
	sum NUMERIC(2) NOT NULL,
	type_id BIGINT NOT NULL,
	description VARCHAR(1000) NOT NULL,
	created_date DATE NOT NULL,
	FOREIGN KEY(type_id) REFERENCES types
		ON UPDATE CASCADE
		ON DELETE CASCADE
);

CREATE TABLE categories
(
	id BIGSERIAL PRIMARY KEY,
	title VARCHAR(50) NOT NULL,
	image TEXT
);

CREATE TABLE offers_categories
(
  offer_id BIGINT,
  category_id BIGINT,
  CONSTRAINT offers_categories_pk PRIMARY KEY(offer_id, category_id),
  FOREIGN KEY(offer_id) REFERENCES offers
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY(category_id) REFERENCES categories
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE users
(
	id BIGSERIAL PRIMARY KEY,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	email VARCHAR(320) NOT NULL,
	password VARCHAR(100) NOT NULL,
	avatar TEXT
);

CREATE TABLE comments
(
  id BIGSERIAL PRIMARY KEY,
  message VARCHAR(300) NOT NULL,
  created_date DATE NOT NULL,
  user_id BIGINT NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE offers_comments
(
  offer_id BIGINT,
  comment_id BIGINT,
  CONSTRAINT offers_comments_pk PRIMARY KEY(offer_id, comment_id),
  FOREIGN KEY(offer_id) REFERENCES offers
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY(comment_id) REFERENCES comments
    ON UPDATE CASCADE
    ON DELETE CASCADE
);







