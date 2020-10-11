'use strict';

const {describe, it, expect, beforeEach, afterAll} = require(`@jest/globals`);
const request = require(`supertest`);

const {createServer} = require(`../server`);
const testDataBase = require(`../database/testDataBase`);

describe(`Comment API end-points`, () => {
  const server = createServer({dataBase: testDataBase});

  const users = [
    {
      id: 1,
      firstName: `Сергей`,
      lastName: `Иванович`,
      email: `sergei_ivanovich@mail.local`,
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

  afterAll(() => {
    testDataBase.sequelize.close();
  });

  describe(`GET api/offers/:offerId/comments`, () => {
    const comments = [
      {
        id: 1,
        message: `С чем связана продажа? Почему так дешёво? Почему в таком ужасном состоянии?`,
        user_id: 1, /* eslint-disable-line */
        offer_id: 1, /* eslint-disable-line */
      },
      {
        id: 2,
        message: `Неплохо, но дорого. Почему в таком ужасном состоянии?`,
        user_id: 1, /* eslint-disable-line */
        offer_id: 1, /* eslint-disable-line */
      },
    ];

    beforeEach(async () => {
      await testDataBase.resetDataBase({users, categories, offers, offersCategories, comments});
    });

    it(`should return status 404 if offer doesn't exist`, async () => {
      const res = await request(server).get(`/api/offers/1234/comments`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 200 if offer exist`, async () => {
      const res = await request(server).get(`/api/offers/1/comments`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return comments`, async () => {
      const expectedFirstComment = {
        id: 1,
        message: `С чем связана продажа? Почему так дешёво? Почему в таком ужасном состоянии?`,
      };
      const expectedSecondComment = {
        id: 2,
        message: `Неплохо, но дорого. Почему в таком ужасном состоянии?`,
      };

      const res = await request(server).get(`/api/offers/1/comments`);
      const [firstComment, secondComment] = res.body;

      expect(firstComment).toMatchObject(expectedFirstComment);
      expect(secondComment).toMatchObject(expectedSecondComment);
    });
  });

  describe(`POST api/offers/:offerId/comments`, () => {
    const comments = [
      {
        message: `С чем связана продажа? Почему так дешёво? Почему в таком ужасном состоянии?`,
        user_id: 1, /* eslint-disable-line */
        offer_id: 1, /* eslint-disable-line */
      },
    ];

    beforeEach(async () => {
      await testDataBase.resetDataBase({users, categories, offers, offersCategories, comments});
    });

    it(`should return status 404 if offer doesn't exist`, async () => {
      const data = {
        text: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.`,
      };
      const res = await request(server).post(`/api/offers/1234/comments`).send(data);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 400 if have sent text shorter than 20 letters`, async () => {
      const data = {
        text: `Lorem`,
      };
      const res = await request(server).post(`/api/offers/1/comments`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if didnt send text`, async () => {
      const data = {
        message: `New comment`,
      };
      const res = await request(server).post(`/api/offers/1/comments`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 201 if new comment was created`, async () => {
      const data = {
        text: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.`,
      };
      const res = await request(server).post(`/api/offers/1/comments`).send(data);

      expect(res.statusCode).toBe(201);
    });

    it(`should return new comment if new comment was created`, async () => {
      const data = {
        text: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.`,
      };
      const expectedComment = {
        message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.`,
      };

      const res = await request(server).post(`/api/offers/1/comments`).send(data);

      expect(res.body).toHaveProperty(`id`);
      expect(res.body).toMatchObject(expectedComment);
    });

    it(`should return comments with new comment if new comment was created`, async () => {
      const data = {
        text: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.`,
      };
      const {body: newComment} = await request(server).post(`/api/offers/1/comments`).send(data);
      const res = await request(server).get(`/api/offers/1/comments`);

      expect(res.body).toContainEqual(newComment);
    });
  });

  describe(`DELETE api/offers/:offerId/comments/:commentId`, () => {
    const comments = [
      {
        id: 1,
        message: `С чем связана продажа? Почему так дешёво? Почему в таком ужасном состоянии?`,
        user_id: 1, /* eslint-disable-line */
        offer_id: 1, /* eslint-disable-line */
      },
      {
        id: 2,
        message: `Неплохо, но дорого. Почему в таком ужасном состоянии?`,
        user_id: 1, /* eslint-disable-line */
        offer_id: 1, /* eslint-disable-line */
      },
    ];

    beforeEach(async () => {
      await testDataBase.resetDataBase({users, categories, offers, offersCategories, comments});
    });

    it(`should return status 404 if offer doesn't exist`, async () => {
      const res = await request(server).delete(`/api/offers/1234/comments/2`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 404 if comment doesn't exist`, async () => {
      const res = await request(server).delete(`/api/offers/1/comments/1234`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 200 if comment was deleted`, async () => {
      const res = await request(server).delete(`/api/offers/1/comments/2`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return deleted comment if comment was deleted`, async () => {
      const expectedComment = {
        id: 2,
        message: `Неплохо, но дорого. Почему в таком ужасном состоянии?`,
      };

      const res = await request(server).delete(`/api/offers/1/comments/2`);

      expect(res.body).toMatchObject(expectedComment);
    });

    it(`should return comments without deleted comment if comment was deleted`, async () => {
      const {body: deletedComment} = await request(server).delete(`/api/offers/1/comments/2`);
      const res = await request(server).get(`/api/offers/1/comments`);

      expect(res.body).not.toContainEqual(deletedComment);
    });
  });
});
