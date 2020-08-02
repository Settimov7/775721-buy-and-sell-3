'use strict';

const {describe, it, expect, beforeEach, afterAll} = require(`@jest/globals`);
const request = require(`supertest`);

const {createServer} = require(`../server`);
const testDataBase = require(`../database/testDataBase`);

describe(`Offer API end-points`, () => {
  const server = createServer({dataBase: testDataBase});

  afterAll(() => {
    testDataBase.sequelize.close();
  });

  describe(`GET api/offers`, () => {
    const users = [
      {
        id: 1,
        firstName: `Иван`,
        lastName: `Абрамов`,
        email: `ivan_abramov@mail.local`,
        password: 123456,
        avatar: `avatar01.jpg`,
      },
    ];
    const categories = [
      {
        id: 1,
        title: `Игры`,
        image: `category01.jpg`,
      },
      {
        id: 2,
        title: `Разное`,
        image: `category02.jpg`,
      },
      {
        id: 3,
        title: `Животные`,
        image: `category03.jpg`,
      },
    ];
    const offers = [
      {
        id: 1,
        title: `Куплю новую приставку Xbox`,
        image: `item01.jpg`,
        sum: 67782.42,
        type: `buy`,
        description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
        user_id: 1, /* eslint-disable-line */
      },
      {
        id: 2,
        title: `Продам породистого кота`,
        image: `item02.jpg`,
        sum: 557460.7,
        type: `sell`,
        description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
        user_id: 1, /* eslint-disable-line */
      },
    ];
    const offersCategories = [
      {
        offerId: 1,
        categoriesIds: [1, 2],
      },
      {
        offerId: 2,
        categoriesIds: [3],
      },
    ];

    beforeEach(async () => {
      await testDataBase.resetDataBase({users, categories, offers, offersCategories});
    });

    it(`should return status 200 if request was successful`, async () => {
      const res = await request(server).get(`/api/offers`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return correct offers if request was successful`, async () => {
      const res = await request(server).get(`/api/offers`);
      const expectedOffers = [
        {
          id: 2,
          title: `Продам породистого кота`,
          picture: `item02.jpg`,
          sum: `557460.70`,
          type: `sell`,
          description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
          category: [`Животные`],
        },
        {
          id: 1,
          title: `Куплю новую приставку Xbox`,
          picture: `item01.jpg`,
          sum: `67782.42`,
          type: `buy`,
          description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
          category: [`Игры`, `Разное`],
        },
      ];

      expect(res.body).toEqual(expectedOffers);
    });
  });

  describe(`POST api/offers`, () => {
    const users = [
      {
        id: 1,
        firstName: `Иван`,
        lastName: `Абрамов`,
        email: `ivan_abramov@mail.local`,
        password: 123456,
        avatar: `avatar01.jpg`,
      },
    ];
    const categories = [
      {
        id: 1,
        title: `Игры`,
        image: `category01.jpg`,
      },
    ];

    beforeEach(async () => {
      await testDataBase.resetDataBase({users, categories});
    });

    it(`should return status 400 if didn't send category`, async () => {
      const data = {
        title: `Заголовок`,
        description: `Описание`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 1234,
      };

      const res = await request(server).post(`/api/offers`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 201 if sent valid data`, async () => {
      const data = {
        title: `Заголовок`,
        category: [1],
        description: `Описание`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 1234,
      };

      const res = await request(server).post(`/api/offers`).send(data);

      expect(res.statusCode).toBe(201);
    });

    it(`should return offer with id and sent title if sent valid data`, async () => {
      const data = {
        title: `Заголовок`,
        category: [1],
        description: `Описание`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 1234,
      };
      const expectedOffer = {
        title: `Заголовок`,
        picture: `/picture.jpg`,
        sum: `1234.00`,
        type: `sell`,
        description: `Описание`,
        category: [`Игры`],
      };

      const res = await request(server).post(`/api/offers`).send(data);

      expect(res.body).toHaveProperty(`id`);
      expect(res.body).toMatchObject(expectedOffer);
    });

    it(`should return offer without extra properties if sent data with extra property`, async () => {
      const data = {
        title: `Заголовок`,
        category: [1],
        description: `Описание`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 1234,
        token: `token`,
      };

      const res = await request(server).post(`/api/offers`).send(data);

      expect(res.body).not.toHaveProperty(`token`);
    });

    it(`should return offers with new offer`, async () => {
      const data = {
        title: `Заголовок`,
        category: [1],
        description: `Описание`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 1234,
      };

      const {body: newOffer} = await request(server).post(`/api/offers`).send(data);
      const res = await request(server).get(`/api/offers`);

      expect(res.body).toContainEqual(newOffer);
    });
  });

  describe(`GET api/offers/:offerId`, () => {
    const users = [
      {
        id: 1,
        firstName: `Иван`,
        lastName: `Абрамов`,
        email: `ivan_abramov@mail.local`,
        password: 123456,
        avatar: `avatar01.jpg`,
      },
    ];
    const categories = [
      {
        id: 1,
        title: `Игры`,
        image: `category01.jpg`,
      },
      {
        id: 2,
        title: `Животные`,
        image: `category03.jpg`,
      },
    ];
    const offers = [
      {
        id: 1,
        title: `Куплю новую приставку Xbox`,
        image: `item01.jpg`,
        sum: 67782.42,
        type: `buy`,
        description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
        user_id: 1, /* eslint-disable-line */
      },
      {
        id: 2,
        title: `Продам породистого кота`,
        image: `item02.jpg`,
        sum: 557460.7,
        type: `sell`,
        description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
        user_id: 1, /* eslint-disable-line */
      },
    ];
    const offersCategories = [
      {
        offerId: 1,
        categoriesIds: [1],
      },
      {
        offerId: 2,
        categoriesIds: [2],
      },
    ];

    beforeEach(async () => {
      await testDataBase.resetDataBase({users, categories, offers, offersCategories});
    });

    it(`should return status 404 if offer doesn't exist`, async () => {
      const res = await request(server).get(`/api/offers/1234`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 200 if offer exists`, async () => {
      const res = await request(server).get(`/api/offers/2 }`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return offer if offer exists`, async () => {
      const res = await request(server).get(`/api/offers/2`);
      const expectedOffer = {
        id: 2,
        title: `Продам породистого кота`,
        picture: `item02.jpg`,
        sum: `557460.70`,
        type: `sell`,
        description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
        category: [`Животные`],
      };

      expect(res.body).toEqual(expectedOffer);
    });
  });

  describe(`PUT api/offers/:offerId`, () => {
    const users = [
      {
        id: 1,
        firstName: `Иван`,
        lastName: `Абрамов`,
        email: `ivan_abramov@mail.local`,
        password: 123456,
        avatar: `avatar01.jpg`,
      },
    ];
    const categories = [
      {
        id: 1,
        title: `Игры`,
        image: `category01.jpg`,
      },
      {
        id: 2,
        title: `Разное`,
        image: `category02.jpg`,
      },
    ];
    const offers = [
      {
        id: 1,
        title: `Куплю новую приставку Xbox`,
        image: `item01.jpg`,
        sum: 67782.42,
        type: `buy`,
        description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
        user_id: 1, /* eslint-disable-line */
      },
    ];
    const offersCategories = [
      {
        offerId: 1,
        categoriesIds: [1],
      },
    ];

    beforeEach(async () => {
      await testDataBase.resetDataBase({users, categories, offers, offersCategories});
    });

    it(`should return status 404 if offer doesn't exist`, async () => {
      const data = {
        title: `Заголовок`,
        category: [2],
        description: `Описание`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 12345.67,
      };
      const res = await request(server).put(`/api/offers/1234`).send(data);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 400 if didn't send title`, async () => {
      const data = {
        category: [2],
        description: `Описание`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 12345.67,
      };
      const res = await request(server).put(`/api/offers/1`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 200 if offer was updated`, async () => {
      const data = {
        title: `Заголовок`,
        category: [2],
        description: `Описание`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 12345.67,
      };
      const res = await request(server).put(`/api/offers/1`).send(data);

      expect(res.statusCode).toBe(200);
    });

    it(`should return offer with updated title if offer was updated`, async () => {
      const data = {
        title: `Заголовок`,
        category: [2],
        description: `Описание`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 12345.67,
      };
      const expectedOffer = {
        id: 1,
        title: `Заголовок`,
        picture: `/picture.jpg`,
        sum: `12345.67`,
        type: `sell`,
        description: `Описание`,
        category: [`Разное`],
      };

      const res = await request(server).put(`/api/offers/1`).send(data);

      expect(res.body).toEqual(expectedOffer);
    });
  });

  describe(`DELETE api/offers/:offerId`, () => {
    const users = [
      {
        id: 1,
        firstName: `Иван`,
        lastName: `Абрамов`,
        email: `ivan_abramov@mail.local`,
        password: 123456,
        avatar: `avatar01.jpg`,
      },
    ];
    const categories = [
      {
        id: 1,
        title: `Игры`,
        image: `category01.jpg`,
      },
    ];
    const offers = [
      {
        id: 1,
        title: `Продам новую приставку Sony Playstation 5`,
        image: `item01.jpg`,
        sum: 585318.42,
        type: `sell`,
        description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
        user_id: 1, /* eslint-disable-line */
      },
      {
        id: 2,
        title: `Куплю новую приставку Xbox`,
        image: `item02.jpg`,
        sum: 67782.42,
        type: `buy`,
        description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
        user_id: 1, /* eslint-disable-line */
      },
    ];
    const offersCategories = [
      {
        offerId: 1,
        categoriesIds: [1],
      },
      {
        offerId: 2,
        categoriesIds: [1],
      },
    ];

    beforeEach(async () => {
      await testDataBase.resetDataBase({users, categories, offers, offersCategories});
    });

    it(`should return status 404 if offer doesn't exist`, async () => {
      const res = await request(server).delete(`/api/offers/1234`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 200 if offer was deleted`, async () => {
      const res = await request(server).delete(`/api/offers/2`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return deleted offer if offer was deleted`, async () => {
      const expectedOffer = {
        id: 2,
        title: `Куплю новую приставку Xbox`,
        picture: `item02.jpg`,
        sum: `67782.42`,
        type: `buy`,
        description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
        category: [`Игры`],
      };

      const res = await request(server).delete(`/api/offers/2`);

      expect(res.body).toEqual(expectedOffer);
    });

    it(`should return offers without deleted offer`, async () => {
      const expectedOffer = {
        id: 2,
        title: `Куплю новую приставку Xbox`,
        picture: `item02.jpg`,
        sum: `67782.42`,
        type: `buy`,
        description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
        category: [`Игры`],
      };

      await request(server).delete(`/api/offers/2`);
      const res = await request(server).get(`/api/offers`);

      expect(res.body).not.toContainEqual(expectedOffer);
    });
  });
});
