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
        createdAt: `2020-02-15`,/* eslint-disable-line */
      },
      {
        id: 2,
        title: `Продам породистого кота`,
        image: `item02.jpg`,
        sum: 557460.7,
        type: `sell`,
        description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
        user_id: 1, /* eslint-disable-line */
        createdAt: `2020-02-25`, /* eslint-disable-line */
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

    it(`should return correct quantity of offers`, async () => {
      const res = await request(server).get(`/api/offers`);

      expect(res.body.quantity).toEqual(offers.length);
    });

    it(`should return correct offers if request was successful`, async () => {
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

      const res = await request(server).get(`/api/offers`);

      expect(res.body.offers).toEqual(expectedOffers);
    });

    it(`with offset = 1 should return offers without first offer`, async () => {
      const offset = 1;
      const offersForTestOffset = [
        {
          id: 1,
          title: `Куплю новую приставку Xbox`,
          image: `item01.jpg`,
          sum: 67782.42,
          type: `buy`,
          description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
          user_id: 1, /* eslint-disable-line */
          createdAt: `2020-02-15`, /* eslint-disable-line */
        },
        {
          id: 2,
          title: `Продам породистого кота`,
          image: `item02.jpg`,
          sum: 557460.7,
          type: `sell`,
          description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
          user_id: 1, /* eslint-disable-line */
          createdAt: `2020-02-10`, /* eslint-disable-line */
        },
        {
          id: 3,
          title: `Отдам в хорошие руки подшивку «Мурзилка»`,
          image: `item03.jpg`,
          sum: 12331.2,
          type: `buy`,
          description: `Бонусом отдам все аксессуары. Это настоящая находка для коллекционера!`,
          user_id: 1, /* eslint-disable-line */
          createdAt: `2020-02-05`, /* eslint-disable-line */
        },
      ];
      const offersCategoriesForTestOffset = [
        {
          offerId: 1,
          categoriesIds: [1],
        },
        {
          offerId: 2,
          categoriesIds: [2],
        },
        {
          offerId: 3,
          categoriesIds: [3],
        },
      ];
      const expectedOffers = [
        {
          id: 2,
          title: `Продам породистого кота`,
          picture: `item02.jpg`,
          sum: `557460.70`,
          type: `sell`,
          description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
          category: [`Разное`],
        },
        {
          id: 3,
          title: `Отдам в хорошие руки подшивку «Мурзилка»`,
          picture: `item03.jpg`,
          sum: `12331.20`,
          type: `buy`,
          description: `Бонусом отдам все аксессуары. Это настоящая находка для коллекционера!`,
          category: [`Животные`],
        },
      ];

      await testDataBase.resetDataBase({
        users,
        categories,
        offers: offersForTestOffset,
        offersCategories: offersCategoriesForTestOffset,
      });

      const res = await request(server).get(`/api/offers?offset=${ offset }`);

      expect(res.body.offers).toEqual(expectedOffers);
    });

    it(`with limit = 1 should return first offer`, async () => {
      const limit = 1;
      const offersForTestLimit = [
        {
          id: 1,
          title: `Куплю новую приставку Xbox`,
          image: `item01.jpg`,
          sum: 67782.42,
          type: `buy`,
          description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
          user_id: 1, /* eslint-disable-line */
          createdAt: `2020-02-15`, /* eslint-disable-line */
        },
        {
          id: 2,
          title: `Отдам в хорошие руки подшивку «Мурзилка»`,
          image: `item03.jpg`,
          sum: 12331.2,
          type: `buy`,
          description: `Бонусом отдам все аксессуары. Это настоящая находка для коллекционера!`,
          user_id: 1, /* eslint-disable-line */
          createdAt: `2020-02-05`, /* eslint-disable-line */
        },
      ];
      const offersCategoriesForTestLimit = [
        {
          offerId: 1,
          categoriesIds: [1],
        },
        {
          offerId: 2,
          categoriesIds: [2],
        },
      ];
      const expectedOffers = [
        {
          id: 1,
          title: `Куплю новую приставку Xbox`,
          picture: `item01.jpg`,
          sum: `67782.42`,
          type: `buy`,
          description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
          category: [`Игры`],
        },
      ];

      await testDataBase.resetDataBase({
        users,
        categories,
        offers: offersForTestLimit,
        offersCategories: offersCategoriesForTestLimit,
      });

      const res = await request(server).get(`/api/offers?limit=${ limit }`);

      expect(res.body.offers).toEqual(expectedOffers);
    });

    it(`with offset = 1 and limit = 1 should return offer with id = 2`, async () => {
      const offset = 1;
      const limit = 1;
      const offersForTestOffsetAndLimit = [
        {
          id: 1,
          title: `Куплю новую приставку Xbox`,
          image: `item01.jpg`,
          sum: 67782.42,
          type: `buy`,
          description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
          user_id: 1, /* eslint-disable-line */
          createdAt: `2020-02-15`, /* eslint-disable-line */
        },
        {
          id: 2,
          title: `Отдам в хорошие руки подшивку «Мурзилка»`,
          image: `item02.jpg`,
          sum: 12331.2,
          type: `buy`,
          description: `Бонусом отдам все аксессуары. Это настоящая находка для коллекционера!`,
          user_id: 1, /* eslint-disable-line */
          createdAt: `2020-02-10`, /* eslint-disable-line */
        },
        {
          id: 3,
          title: `Продам породистого кота`,
          image: `item03.jpg`,
          sum: 557460.7,
          type: `sell`,
          description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
          user_id: 1, /* eslint-disable-line */
          createdAt: `2020-02-05`, /* eslint-disable-line */
        },
      ];
      const offersCategoriesForTestOffsetAndLimit = [
        {
          offerId: 1,
          categoriesIds: [1],
        },
        {
          offerId: 2,
          categoriesIds: [2],
        },
        {
          offerId: 3,
          categoriesIds: [3],
        },
      ];
      const expectedOffers = [
        {
          id: 2,
          title: `Отдам в хорошие руки подшивку «Мурзилка»`,
          picture: `item02.jpg`,
          sum: `12331.20`,
          type: `buy`,
          description: `Бонусом отдам все аксессуары. Это настоящая находка для коллекционера!`,
          category: [`Разное`],
        },
      ];

      await testDataBase.resetDataBase({
        users,
        categories,
        offers: offersForTestOffsetAndLimit,
        offersCategories: offersCategoriesForTestOffsetAndLimit,
      });

      const res = await request(server).get(`/api/offers?offset=${ offset }&limit=${ limit }`);

      expect(res.body.offers).toEqual(expectedOffers);
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

    it(`should return status 400 if have sent title shorter than 10 letters`, async () => {
      const data = {
        title: `Title`,
        category: [1],
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 1234,
      };

      const res = await request(server).post(`/api/offers`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent title longer than 100 letters`, async () => {
      const data = {
        title: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        category: [1],
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 1234,
      };

      const res = await request(server).post(`/api/offers`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have not sent title`, async () => {
      const data = {
        category: [1],
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 1234,
      };

      const res = await request(server).post(`/api/offers`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if category items not string or number`, async () => {
      const data = {
        title: `Заголовок предложения`,
        category: [{}],
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 1234,
      };

      const res = await request(server).post(`/api/offers`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent empty categories`, async () => {
      const data = {
        title: `Заголовок предложения`,
        category: [],
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 1234,
      };

      const res = await request(server).post(`/api/offers`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have not sent categories`, async () => {
      const data = {
        title: `Заголовок предложения`,
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 1234,
      };

      const res = await request(server).post(`/api/offers`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent description shorter than 50 letters`, async () => {
      const data = {
        title: `Заголовок предложения`,
        category: [1],
        description: `Описание`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 1234,
      };

      const res = await request(server).post(`/api/offers`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent description longer than 1000 letters`, async () => {
      const data = {
        title: `Заголовок предложения`,
        category: [1],
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio,
            dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui,
            quia quo sint ullam ut. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus
            nemo non quae qui, quia quo sint ullam ut. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias
            consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo
            non quae qui, quia quo sint ullam ut. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus
            necessitatibus nemo non quae qui, quia quo sint ullam ut. Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam
            magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias
            consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo
            non quae qui, quia quo sint ullam ut.`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 1234,
      };

      const res = await request(server).post(`/api/offers`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have not sent description`, async () => {
      const data = {
        title: `Заголовок предложения`,
        category: [1],
        picture: `/picture.png`,
        type: `sell`,
        sum: 1234,
      };

      const res = await request(server).post(`/api/offers`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent not jpg or png picture`, async () => {
      const data = {
        title: `Заголовок предложения`,
        category: [1],
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        picture: `/picture.gif`,
        type: `sell`,
        sum: 1234,
      };

      const res = await request(server).post(`/api/offers`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent not "sell" or "buy" type`, async () => {
      const data = {
        title: `Заголовок предложения`,
        category: [1],
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        picture: `/picture.jpg`,
        type: `abc`,
        sum: 1234,
      };

      const res = await request(server).post(`/api/offers`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have not sent type`, async () => {
      const data = {
        title: `Заголовок предложения`,
        category: [1],
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        picture: `/picture.jpg`,
        sum: 1234,
      };

      const res = await request(server).post(`/api/offers`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent sum smaller than 100`, async () => {
      const data = {
        title: `Заголовок предложения`,
        category: [1],
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 99,
      };

      const res = await request(server).post(`/api/offers`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have not sent sum`, async () => {
      const data = {
        title: `Заголовок предложения`,
        category: [1],
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        picture: `/picture.jpg`,
        type: `sell`,
      };

      const res = await request(server).post(`/api/offers`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent data with extra property`, async () => {
      const data = {
        title: `Заголовок предложения`,
        category: [1],
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 1234,
        token: `token`,
      };

      const res = await request(server).post(`/api/offers`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 201 if have sent valid data`, async () => {
      const data = {
        title: `Заголовок предложения`,
        category: [1],
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: `1234`,
      };

      const res = await request(server).post(`/api/offers`).send(data);

      expect(res.statusCode).toBe(201);
    });

    it(`should return offer with id and sent title if have sent valid data`, async () => {
      const data = {
        title: `Заголовок предложения`,
        category: [1],
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 1234,
      };
      const expectedOffer = {
        title: `Заголовок предложения`,
        picture: `/picture.jpg`,
        sum: `1234.00`,
        type: `sell`,
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        category: [`Игры`],
      };

      const res = await request(server).post(`/api/offers`).send(data);

      expect(res.body).toHaveProperty(`id`);
      expect(res.body).toMatchObject(expectedOffer);
    });

    it(`should return offers with new offer`, async () => {
      const data = {
        title: `Заголовок предложения`,
        category: [1],
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 1234,
      };

      const {body: newOffer} = await request(server).post(`/api/offers`).send(data);
      const res = await request(server).get(`/api/offers`);

      expect(res.body.offers).toContainEqual(newOffer);
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

    it(`should return status 400 if have sent invalid offerId`, async () => {
      const res = await request(server).get(`/api/offers/abc`);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 200 if offer exists`, async () => {
      const res = await request(server).get(`/api/offers/2`);

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
        title: `Заголовок предложения`,
        category: [2],
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 12345.67,
      };
      const res = await request(server).put(`/api/offers/1234`).send(data);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 400 if have sent invalid offerId`, async () => {
      const data = {
        title: `Заголовок предложения`,
        category: [2],
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 12345.67,
      };
      const res = await request(server).put(`/api/offers/abc`).send(data);

      expect(res.statusCode).toBe(400);
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
        title: `Заголовок предложения`,
        category: [2],
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 12345.67,
      };
      const res = await request(server).put(`/api/offers/1`).send(data);

      expect(res.statusCode).toBe(200);
    });

    it(`should return offer with updated title if offer was updated`, async () => {
      const data = {
        title: `Заголовок предложения`,
        category: [2],
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 12345.67,
      };
      const expectedOffer = {
        id: 1,
        title: `Заголовок предложения`,
        picture: `/picture.jpg`,
        sum: `12345.67`,
        type: `sell`,
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
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
