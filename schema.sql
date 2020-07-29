DROP DATABASE IF EXISTS academy_buy_sell;
DROP ROLE IF EXISTS academy_buy_sell;

CREATE ROLE academy_buy_sell WITH
	LOGIN
	NOSUPERUSER
	NOCREATEDB
	NOCREATEROLE
	INHERIT
	NOREPLICATION
	CONNECTION LIMIT -1
	PASSWORD '';

CREATE DATABASE academy_buy_sell
    WITH
    OWNER = academy_buy_sell
    TEMPLATE = template0
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS offers_categories;
DROP TABLE IF EXISTS offers;
DROP TYPE IF EXISTS offer_type;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE TABLE users
(
	id BIGSERIAL PRIMARY KEY,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	email VARCHAR(320) UNIQUE NOT NULL,
	password VARCHAR(100) NOT NULL,
	avatar TEXT
);

CREATE UNIQUE INDEX email_idx ON users ((lower(email)));

CREATE TYPE offer_type AS ENUM ('buy', 'sell');

CREATE TABLE offers
(
	id BIGSERIAL PRIMARY KEY,
	title VARCHAR(100) NOT NULL,
	image TEXT,
	sum DECIMAL(10, 2) NOT NULL,
	type offer_type NOT NULL,
	description VARCHAR(1000) NOT NULL,
	created_date DATE NOT NULL,
	user_id BIGINT NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE INDEX title_idx ON offers ((lower(title)));
CREATE INDEX offers_created_date_idx ON offers (created_date);

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

CREATE TABLE comments
(
  id BIGSERIAL PRIMARY KEY,
  message VARCHAR(300) NOT NULL,
  created_date DATE NOT NULL,
  user_id BIGINT NOT NULL,
  offer_id BIGINT NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY(offer_id) REFERENCES offers
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE INDEX offer_id_idx ON comments (user_id);
CREATE INDEX comments_created_date_idx ON comments (created_date);







