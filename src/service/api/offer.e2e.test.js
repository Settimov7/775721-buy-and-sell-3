'use strict';

const {describe, it, expect, beforeEach, afterAll} = require(`@jest/globals`);
const request = require(`supertest`);

const {createServer} = require(`../server`);
const testDataBase = require(`../database/testDataBase`);

describe(`Offer API end-points`, () => {
  const server = createServer({dataBase: testDataBase});

  const userData = {
    name: `James Bond`,
    email: `jamesBond@mail.com`,
    password: `123456`,
    passwordRepeat: `123456`,
    avatar: `avatar.png`,
  };
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
  const firstOfferData = {
    title: `Куплю новую приставку Xbox`,
    picture: `item01.jpg`,
    sum: 67782.42,
    type: `buy`,
    description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
    category: [1, 2]
  };
  const secondOfferData = {
    title: `Продам породистого кота`,
    picture: `item02.jpg`,
    sum: 557460.7,
    type: `sell`,
    description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
    category: [3]
  };

  const headers = {};

  beforeEach(async () => {
    await testDataBase.resetDataBase({categories});

    await request(server).post(`/api/user`).send(userData);

    const {body: loginBody} = await request(server).post(`/api/user/login`).send({email: userData.email, password: userData.password});
    headers.authorization = `Bearer ${loginBody.accessToken} ${loginBody.refreshToken}`;

    await request(server).post(`/api/offers`).send(firstOfferData).set(headers);
    await request(server).post(`/api/offers`).send(secondOfferData).set(headers);
  });

  afterAll(() => {
    testDataBase.sequelize.close();
  });

  describe(`GET api/offers`, () => {
    it(`should return status 200 if request was successful`, async () => {
      const res = await request(server).get(`/api/offers`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return correct quantity of offers`, async () => {
      const res = await request(server).get(`/api/offers`);

      console.log(res.body);

      expect(res.body.quantity).toEqual(2);
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

    it(`with offset = 1 should return first offer`, async () => {
      const offset = 1;
      const expectedOffers = [{
        title: `Куплю новую приставку Xbox`,
        picture: `item01.jpg`,
        sum: `67782.42`,
        type: `buy`,
        description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
        category: [`Игры`, `Разное`]
      }];

      const res = await request(server).get(`/api/offers?offset=${ offset }`);

      expect(res.body.offers).toMatchObject(expectedOffers);
    });

    it(`with limit = 1 should return second offer`, async () => {
      const limit = 1;
      const expectedOffers = [
        {
          title: `Продам породистого кота`,
          picture: `item02.jpg`,
          sum: `557460.70`,
          type: `sell`,
          description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
          category: [`Животные`],
        },
      ];

      const res = await request(server).get(`/api/offers?limit=${ limit }`);

      expect(res.body.offers).toMatchObject(expectedOffers);
    });

    it(`with offset = 1 and limit = 1 should return offer with id = 1`, async () => {
      const offset = 1;
      const limit = 1;
      const expectedOffers = [{
        title: `Куплю новую приставку Xbox`,
        picture: `item01.jpg`,
        sum: `67782.42`,
        type: `buy`,
        description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
        category: [`Игры`, `Разное`]
      }];

      const res = await request(server).get(`/api/offers?offset=${ offset }&limit=${ limit }`);

      expect(res.body.offers).toMatchObject(expectedOffers);
    });
  });

  describe(`POST api/offers`, () => {
    it(`should return status 400 if have sent title shorter than 10 letters`, async () => {
      const data = {
        title: `Title`,
        category: [1],
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 1234,
      };

      const res = await request(server).post(`/api/offers`).send(data).set(headers);

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

      const res = await request(server).post(`/api/offers`).send(data).set(headers);

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

      const res = await request(server).post(`/api/offers`).send(data).set(headers);

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

      const res = await request(server).post(`/api/offers`).send(data).set(headers);

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

      const res = await request(server).post(`/api/offers`).send(data).set(headers);

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

      const res = await request(server).post(`/api/offers`).send(data).set(headers);

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

      const res = await request(server).post(`/api/offers`).send(data).set(headers);

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

      const res = await request(server).post(`/api/offers`).send(data).set(headers);

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

      const res = await request(server).post(`/api/offers`).send(data).set(headers);

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

      const res = await request(server).post(`/api/offers`).send(data).set(headers);

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

      const res = await request(server).post(`/api/offers`).send(data).set(headers);

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

      const res = await request(server).post(`/api/offers`).send(data).set(headers);

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

      const res = await request(server).post(`/api/offers`).send(data).set(headers);

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

      const res = await request(server).post(`/api/offers`).send(data).set(headers);

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

      const res = await request(server).post(`/api/offers`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 401 if have sent authorization headers`, async () => {
      const data = {
        title: `Заголовок предложения`,
        category: [1],
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: `1234`,
      };

      const res = await request(server).post(`/api/offers`).send(data);

      expect(res.statusCode).toBe(401);
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

      const res = await request(server).post(`/api/offers`).send(data).set(headers);

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

      const res = await request(server).post(`/api/offers`).send(data).set(headers);

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

      const {body: newOffer} = await request(server).post(`/api/offers`).send(data).set(headers);
      const res = await request(server).get(`/api/offers`);

      expect(res.body.offers).toContainEqual(newOffer);
    });
  });

  describe(`GET api/offers/:offerId`, () => {
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
        title: `Продам породистого кота`,
        picture: `item02.jpg`,
        sum: `557460.70`,
        type: `sell`,
        description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
        category: [`Животные`],
      };

      expect(res.body).toMatchObject(expectedOffer);
    });
  });

  describe(`PUT api/offers/:offerId`, () => {
    it(`should return status 404 if offer doesn't exist`, async () => {
      const data = {
        title: `Заголовок предложения`,
        category: [2],
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 12345.67,
      };
      const res = await request(server).put(`/api/offers/1234`).send(data).set(headers);

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
      const res = await request(server).put(`/api/offers/abc`).send(data).set(headers);

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
      const res = await request(server).put(`/api/offers/1`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 401 if haven't sent authorization headers`, async () => {
      const data = {
        title: `Заголовок предложения`,
        category: [2],
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 12345.67,
      };
      const res = await request(server).put(`/api/offers/1`).send(data);

      expect(res.statusCode).toBe(401);
    });

    it(`should return status 401 if haven't sent authorization headers`, async () => {
      const data = {
        title: `Заголовок предложения`,
        category: [2],
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 12345.67,
      };
      const res = await request(server).put(`/api/offers/1`).send(data);

      expect(res.statusCode).toBe(401);
    });

    it(`should return status 403 if tried to update someone else's offer`, async () => {
      const secondUserData = {
        name: `Ivan Ivanov`,
        email: `ivanIvamon@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.png`,
      };
      await request(server).post(`/api/user`).send(secondUserData);

      const {body: loginBody} = await request(server).post(`/api/user/login`).send({email: secondUserData.email, password: secondUserData.password});
      const authorizationHeader = `Bearer ${loginBody.accessToken} ${loginBody.refreshToken}`;

      const data = {
        title: `Заголовок предложения`,
        category: [2],
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur culpa distinctio, dolore excepturi ipsa iusto laboriosam magni minus natus necessitatibus nemo non quae qui, quia quo sint ullam ut.`,
        picture: `/picture.jpg`,
        type: `sell`,
        sum: 12345.67,
      };

      const res = await request(server).put(`/api/offers/1`).send(data).set({authorization: authorizationHeader});

      expect(res.statusCode).toBe(403);
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

      const res = await request(server).put(`/api/offers/1`).send(data).set(headers);

      expect(res.body).toEqual(expectedOffer);
    });
  });

  describe(`DELETE api/offers/:offerId`, () => {
    it(`should return status 404 if offer doesn't exist`, async () => {
      const res = await request(server).delete(`/api/offers/1234`).set(headers);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 401 if haven't sent authorization headers`, async () => {
      const res = await request(server).delete(`/api/offers/2`);

      expect(res.statusCode).toBe(401);
    });

    it(`should return status 403 if tried to delete someone else's offer`, async () => {
      const secondUserData = {
        name: `Ivan Ivanov`,
        email: `ivanIvamon@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.png`,
      };
      await request(server).post(`/api/user`).send(secondUserData);

      const {body: loginBody} = await request(server).post(`/api/user/login`).send({email: secondUserData.email, password: secondUserData.password});
      const authorizationHeader = `Bearer ${loginBody.accessToken} ${loginBody.refreshToken}`;

      const res = await request(server).delete(`/api/offers/2`).set({authorization: authorizationHeader});

      expect(res.statusCode).toBe(403);
    });

    it(`should return status 200 if offer was deleted`, async () => {
      const res = await request(server).delete(`/api/offers/2`).set(headers);

      expect(res.statusCode).toBe(200);
    });

    it(`should return deleted offer if offer was deleted`, async () => {
      const expectedOffer = {
        title: `Продам породистого кота`,
        picture: `item02.jpg`,
        sum: `557460.70`,
        type: `sell`,
        description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
        category: [`Животные`],
      };

      const res = await request(server).delete(`/api/offers/2`).set(headers);

      expect(res.body).toMatchObject(expectedOffer);
    });
  });
});
