'use strict';

const {describe, it, expect, beforeEach, afterAll} = require(`@jest/globals`);
const request = require(`supertest`);

const {createServer} = require(`../server`);
const testDataBase = require(`../database/testDataBase`);

describe(`Search API end-points`, () => {
  const server = createServer({dataBase: testDataBase});

  describe(`GET apo/search`, () => {
    const users = [
      {
        id: 1,
        name: `Иван Абрамов`,
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
        categoriesIds: [1, 2],
      },
      {
        offerId: 2,
        categoriesIds: [1],
      },
    ];

    beforeEach(async () => {
      await testDataBase.resetDataBase({users, categories, offers, offersCategories});
    });

    afterAll(() => {
      testDataBase.sequelize.close();
    });

    it(`should return status 404 if no offers with passed query`, async () => {
      const res = await request(server).get(`/api/search?query=query`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 200 if offers contains query in title`, async () => {
      const res = await request(server).get(`/api/search?query=sony`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return array with offers which contain query in title`, async () => {
      const res = await request(server).get(`/api/search?query=Sony`);
      const expectedOffers = [
        {
          id: 1,
          title: `Продам новую приставку Sony Playstation 5`,
          picture: `item01.jpg`,
          sum: `585318.42`,
          type: `sell`,
          description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
          category: [`Игры`, `Разное`],
        },
      ];

      expect(res.body).toEqual(expectedOffers);
    });
  });
});
