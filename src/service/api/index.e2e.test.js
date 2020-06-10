'use strict';

const {describe, it, expect, beforeEach} = require(`@jest/globals`);

const request = require(`supertest`);
const {createServer} = require(`../server`);

describe(`Offers API end-points`, () => {
  it(`should return status 404 if end-point doesn't exist`, async () => {
    const server = await createServer([]);

    const res = await request(server).get(`/api/random-route`);

    expect(res.statusCode).toBe(404);
  });

  describe(`GET api/offers`, () => {
    const mockOffers = [
      {
        id: `k2MJRx`,
        category: [
          `Животные`,
          `Журналы`,
          `Книги`,
          `Посуда`,
          `Разное`,
        ],
        description: `Если найдёте дешевле — сброшу цену. Бонусом отдам все аксессуары. Даю недельную гарантию. Продаю с болью в сердце...`,
        picture: `item12.jpg`,
        title: `Продам отличную подборку фильмов на VHS`,
        type: `sale`,
        sum: 25913,
        comments: [
          {
            id: `wjK6J3`,
            text: `С чем связана продажа? Почему так дешёво? Почему в таком ужасном состоянии?`,
          },
          {
            id: `Ajo4g-`,
            text: `Неплохо, но дорого. С чем связана продажа? Почему так дешёво?`,
          },
        ],
      },
      {
        id: `bDBSaq`,
        category: [
          `Журналы`,
          `Игры`,
          `Посуда`,
        ],
        description: `Две страницы заляпаны свежим кофе. Даю недельную гарантию. Если найдёте дешевле — сброшу цену.`,
        picture: `item13.jpg`,
        title: `Продам отличную подборку фильмов на VHS`,
        type: `offer`,
        sum: 31230,
        comments: [
          {
            id: `3jYaB2`,
            text: `Оплата наличными или перевод на карту? Неплохо, но дорого.`,
          },
          {
            id: `63myTU`,
            text: `Неплохо, но дорого. Почему в таком ужасном состоянии?`,
          },
        ],
      },
    ];
    let server;

    beforeEach(async () => {
      server = await createServer(mockOffers);
    });

    it(`should return status 200 if request was successful`, async () => {
      const res = await request(server).get(`/api/offers`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return correct offers if request was successful`, async () => {
      const res = await request(server).get(`/api/offers`);

      expect(res.body).toEqual(mockOffers);
    });
  });

  describe(`POST api/offers`, () => {
    let server;

    beforeEach(async () => {
      server = await createServer([]);
    });

    it(`should return status 400 if didn't send category`, async () => {
      const data = {
        title: `Заголовок`,
        description: `Описание`,
        picture: `/picture.jpg`,
        type: `Тип`,
        sum: 1234,
      };

      const res = await request(server).post(`/api/offers`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 201 if sent valid data`, async () => {
      const data = {
        title: `Заголовок`,
        category: [`Категория`],
        description: `Описание`,
        picture: `/picture.jpg`,
        type: `Тип`,
        sum: 1234,
      };

      const res = await request(server).post(`/api/offers`).send(data);

      expect(res.statusCode).toBe(201);
    });

    it(`should return offer with id and sent title if sent valid data`, async () => {
      const data = {
        title: `Заголовок`,
        category: [`Категория`],
        description: `Описание`,
        picture: `/picture.jpg`,
        type: `Тип`,
        sum: 1234,
      };

      const res = await request(server).post(`/api/offers`).send(data);

      expect(res.body).toHaveProperty(`id`);
      expect(res.body.title).toBe(data.title);
    });

    it(`should return offer without extra properties if sent data with extra property`, async () => {
      const data = {
        title: `Заголовок`,
        category: [`Категория`],
        description: `Описание`,
        picture: `/picture.jpg`,
        type: `Тип`,
        sum: 1234,
        token: `token`,
      };

      const res = await request(server).post(`/api/offers`).send(data);

      expect(res.body).not.toHaveProperty(`token`);
    });

    it(`should return offers with new offer`, async () => {
      const data = {
        title: `Заголовок`,
        category: [`Категория`],
        description: `Описание`,
        picture: `/picture.jpg`,
        type: `Тип`,
        sum: 1234,
        token: `token`,
      };

      const {body: newOffer} = await request(server).post(`/api/offers`).send(data);
      const res = await request(server).get(`/api/offers`);

      expect(res.body).toContainEqual(newOffer);
    });
  });

  describe(`GET api/offers/:offerId`, () => {
    const mockOffer = {
      id: `k2MJRx`,
      category: [
        `Животные`,
        `Журналы`,
        `Книги`,
        `Посуда`,
        `Разное`,
      ],
      description: `Если найдёте дешевле — сброшу цену. Бонусом отдам все аксессуары. Даю недельную гарантию. Продаю с болью в сердце...`,
      picture: `item12.jpg`,
      title: `Продам отличную подборку фильмов на VHS`,
      type: `sale`,
      sum: 25913,
      comments: [
        {
          id: `wjK6J3`,
          text: `С чем связана продажа? Почему так дешёво? Почему в таком ужасном состоянии?`,
        },
        {
          id: `Ajo4g-`,
          text: `Неплохо, но дорого. С чем связана продажа? Почему так дешёво?`,
        },
      ],
    };
    const mockOffers = [mockOffer];
    let server;

    beforeEach(async () => {
      server = await createServer(mockOffers);
    });

    it(`should return status 404 if offer doesn't exist`, async () => {
      const res = await request(server).get(`/api/offers/1234`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 200 if offer exists`, async () => {
      const res = await request(server).get(`/api/offers/${ mockOffer.id }`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return offer if offer exists`, async () => {
      const res = await request(server).get(`/api/offers/${ mockOffer.id }`);

      expect(res.body).toEqual(mockOffer);
    });
  });

  describe(`PUT api/offers/:offerId`, () => {
    const mockOffer = {
      id: `k2MJRx`,
      category: [
        `Животные`,
        `Журналы`,
        `Книги`,
        `Посуда`,
        `Разное`,
      ],
      description: `Если найдёте дешевле — сброшу цену. Бонусом отдам все аксессуары. Даю недельную гарантию. Продаю с болью в сердце...`,
      picture: `item12.jpg`,
      title: `Продам отличную подборку фильмов на VHS`,
      type: `sale`,
      sum: 25913,
      comments: [
        {
          id: `wjK6J3`,
          text: `С чем связана продажа? Почему так дешёво? Почему в таком ужасном состоянии?`,
        },
        {
          id: `Ajo4g-`,
          text: `Неплохо, но дорого. С чем связана продажа? Почему так дешёво?`,
        },
      ],
    };
    const mockOffers = [mockOffer];
    let server;

    beforeEach(async () => {
      server = await createServer(mockOffers);
    });

    it(`should return status 404 if offer doesn't exist`, async () => {
      const data = {
        title: `Заголовок`,
        category: [`Категория`],
        description: `Описание`,
        picture: `/picture`,
        type: `Тип`,
        sum: 32801,
      };
      const res = await request(server).put(`/api/offers/1234`).send(data);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 400 if didn't send title`, async () => {
      const data = {
        category: [`Категория`],
        description: `Описание`,
        picture: `/picture`,
        type: `Тип`,
        sum: 32801,
      };
      const res = await request(server).put(`/api/offers/${ mockOffer.id }`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 200 if offer was updated`, async () => {
      const data = {
        title: `Заголовок`,
        category: [`Категория`],
        description: `Описание`,
        picture: `/picture`,
        type: `Тип`,
        sum: 32801,
      };
      const res = await request(server).put(`/api/offers/${ mockOffer.id }`).send(data);

      expect(res.statusCode).toBe(200);
    });

    it(`should return offer with updated title if offer was updated`, async () => {
      const data = {
        title: `Заголовок`,
        category: [`Категория`],
        description: `Описание`,
        picture: `/picture`,
        type: `Тип`,
        sum: 32801,
      };
      const res = await request(server).put(`/api/offers/${ mockOffer.id }`).send(data);

      expect(res.body.title).toBe(data.title);
    });
  });

  describe(`DELETE api/offers/:offerId`, () => {
    const mockOffer1 = {
      id: `k2MJRx`,
      category: [
        `Животные`,
        `Журналы`,
        `Книги`,
        `Посуда`,
        `Разное`,
      ],
      description: `Если найдёте дешевле — сброшу цену. Бонусом отдам все аксессуары. Даю недельную гарантию. Продаю с болью в сердце...`,
      picture: `item12.jpg`,
      title: `Продам отличную подборку фильмов на VHS`,
      type: `sale`,
      sum: 25913,
      comments: [
        {
          id: `wjK6J3`,
          text: `С чем связана продажа? Почему так дешёво? Почему в таком ужасном состоянии?`,
        },
        {
          id: `Ajo4g-`,
          text: `Неплохо, но дорого. С чем связана продажа? Почему так дешёво?`,
        },
      ],
    };
    const mockOffer2 = {
      id: `bDBSaq`,
      category: [
        `Журналы`,
        `Игры`,
        `Посуда`,
      ],
      description: `Две страницы заляпаны свежим кофе. Даю недельную гарантию. Если найдёте дешевле — сброшу цену.`,
      picture: `item13.jpg`,
      title: `Продам отличную подборку фильмов на VHS`,
      type: `offer`,
      sum: 31230,
      comments: [
        {
          id: `3jYaB2`,
          text: `Оплата наличными или перевод на карту? Неплохо, но дорого.`,
        },
        {
          id: `63myTU`,
          text: `Неплохо, но дорого. Почему в таком ужасном состоянии?`,
        },
      ],
    };
    const mockOffers = [mockOffer1, mockOffer2];
    let server;

    beforeEach(async () => {
      server = await createServer(mockOffers);
    });

    it(`should return status 404 if offer doesn't exist`, async () => {
      const res = await request(server).delete(`/api/offers/1234`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 200 if offer was deleted`, async () => {
      const res = await request(server).delete(`/api/offers/${ mockOffer2.id }`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return deleted offer if offer was deleted`, async () => {
      const res = await request(server).delete(`/api/offers/${ mockOffer2.id }`);

      expect(res.body).toEqual(mockOffer2);
    });

    it(`should return offer if offer was deleted`, async () => {
      const res = await request(server).delete(`/api/offers/${ mockOffer2.id }`);

      expect(res.body).toEqual(mockOffer2);
    });

    it(`should return offers without deleted offer`, async () => {
      await request(server).delete(`/api/offers/${ mockOffer2.id }`);
      const res = await request(server).get(`/api/offers`);

      expect(res.body).not.toContainEqual(mockOffer2);
    });
  });

  describe(`GET api/offers/:offerId/comments`, () => {
    const mockComment = {
      id: `wjK6J3`,
      text: `С чем связана продажа? Почему так дешёво? Почему в таком ужасном состоянии?`,
    };
    const mockOffer = {
      id: `k2MJRx`,
      category: [
        `Животные`,
        `Журналы`,
        `Книги`,
        `Посуда`,
        `Разное`,
      ],
      description: `Если найдёте дешевле — сброшу цену. Бонусом отдам все аксессуары. Даю недельную гарантию. Продаю с болью в сердце...`,
      picture: `item12.jpg`,
      title: `Продам отличную подборку фильмов на VHS`,
      type: `sale`,
      sum: 25913,
      comments: [mockComment],
    };
    const mockOffers = [mockOffer];
    let server;

    beforeEach(async () => {
      server = await createServer(mockOffers);
    });

    it(`should return status 404 if offer doesn't exist`, async () => {
      const res = await request(server).get(`/api/offers/1234/comments`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 200 if offer exist`, async () => {
      const res = await request(server).get(`/api/offers/${ mockOffer.id }/comments`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return comments`, async () => {
      const res = await request(server).get(`/api/offers/${ mockOffer.id }/comments`);

      expect(res.body).toEqual(mockOffer.comments);
    });
  });

  describe(`POST api/offers/:offerId/comments`, () => {
    const mockOffer = {
      id: `k2MJRx`,
      category: [
        `Животные`,
        `Журналы`,
        `Книги`,
        `Посуда`,
        `Разное`,
      ],
      description: `Если найдёте дешевле — сброшу цену. Бонусом отдам все аксессуары. Даю недельную гарантию. Продаю с болью в сердце...`,
      picture: `item12.jpg`,
      title: `Продам отличную подборку фильмов на VHS`,
      type: `sale`,
      sum: 25913,
      comments: [
        {
          id: `3jYaB2`,
          text: `Оплата наличными или перевод на карту? Неплохо, но дорого.`,
        },
        {
          id: `63myTU`,
          text: `Неплохо, но дорого. Почему в таком ужасном состоянии?`,
        },
      ],
    };
    const mockOffers = [mockOffer];
    let server;

    beforeEach(async () => {
      server = await createServer(mockOffers);
    });

    it(`should return status 404 if offer doesn't exist`, async () => {
      const data = {
        text: `New comment`,
      };
      const res = await request(server).post(`/api/offers/1234/comments`).send(data);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 400 if didnt send text`, async () => {
      const data = {
        message: `New comment`,
      };
      const res = await request(server).post(`/api/offers/${ mockOffer.id }/comments`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 201 if new comment was created`, async () => {
      const data = {
        text: `New comment`,
      };
      const res = await request(server).post(`/api/offers/${ mockOffer.id }/comments`).send(data);

      expect(res.statusCode).toBe(201);
    });

    it(`should return new comment if new comment was created`, async () => {
      const data = {
        text: `New comment`,
      };
      const res = await request(server).post(`/api/offers/${ mockOffer.id }/comments`).send(data);

      expect(res.body).toHaveProperty(`id`);
      expect(res.body.text).toBe(data.text);
    });

    it(`should return comments with new comment if new comment was created`, async () => {
      const data = {
        text: `New comment`,
      };
      const {body} = await request(server).post(`/api/offers/${ mockOffer.id }/comments`).send(data);
      const res = await request(server).get(`/api/offers/${ mockOffer.id }/comments`);

      expect(res.body).toContainEqual(body);
    });
  });

  describe(`DELETE api/offers/:offerId/comments/:commentId`, () => {
    const mockComment1 = {
      id: `wjK6J3`,
      text: `С чем связана продажа? Почему так дешёво? Почему в таком ужасном состоянии?`,
    };
    const mockComment2 = {
      id: `63myTU`,
      text: `Неплохо, но дорого. Почему в таком ужасном состоянии?`,
    };
    const mockOffer = {
      id: `k2MJRx`,
      category: [
        `Животные`,
        `Журналы`,
        `Книги`,
        `Посуда`,
        `Разное`,
      ],
      description: `Если найдёте дешевле — сброшу цену. Бонусом отдам все аксессуары. Даю недельную гарантию. Продаю с болью в сердце...`,
      picture: `item12.jpg`,
      title: `Продам отличную подборку фильмов на VHS`,
      type: `sale`,
      sum: 25913,
      comments: [mockComment1, mockComment2],
    };
    const mockOffers = [mockOffer];
    let server;

    beforeEach(async () => {
      server = await createServer(mockOffers);
    });

    it(`should return status 404 if offer doesn't exist`, async () => {
      const res = await request(server).delete(`/api/offers/1234/comments/${ mockComment1.id }`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 404 if comment doesn't exist`, async () => {
      const res = await request(server).delete(`/api/offers/${ mockOffer.id }/comments/1234`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 200 if comment was deleted`, async () => {
      const res = await request(server).delete(`/api/offers/${ mockOffer.id }/comments/${ mockComment2.id }`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return deleted comment if comment was deleted`, async () => {
      const res = await request(server).delete(`/api/offers/${ mockOffer.id }/comments/${ mockComment1.id }`);

      expect(res.body).toEqual(mockComment1);
    });

    it(`should return comment without deleted comment if comment was deleted`, async () => {
      await request(server).delete(`/api/offers/${ mockOffer.id }/comments/${ mockComment2.id }`);
      const res = await request(server).get(`/api/offers/${ mockOffer.id }/comments`);

      expect(res.body).not.toContainEqual(mockComment2);
    });
  });

  describe(`GET api/categories`, () => {
    it(`should return empty array if no offers`, async () => {
      const server = await createServer([]);

      const res = await request(server).get(`/api/categories`);

      expect(res.body).toEqual([]);
    });

    it(`should return ["Животные", "Посуда"]`, async () => {
      const mockOffer1 = {
        id: `k2MJRx`,
        category: [`Животные`],
        description: `Если найдёте дешевле — сброшу цену. Бонусом отдам все аксессуары. Даю недельную гарантию. Продаю с болью в сердце...`,
        picture: `item12.jpg`,
        title: `Продам отличную подборку фильмов на VHS`,
        type: `sale`,
        sum: 25913,
        comments: [],
      };
      const mockOffer2 = {
        id: `bDBSaq`,
        category: [`Посуда`],
        description: `Две страницы заляпаны свежим кофе. Даю недельную гарантию. Если найдёте дешевле — сброшу цену.`,
        picture: `item13.jpg`,
        title: `Подам отличную подборку фильмов на VHS`,
        type: `offer`,
        sum: 31230,
        comments: [],
      };
      const mockOffers = [mockOffer1, mockOffer2];
      const server = await createServer(mockOffers);

      const res = await request(server).get(`/api/categories`);

      expect(res.body).toEqual([`Животные`, `Посуда`]);
    });

    it(`should return ["Животные"] if offers have same category`, async () => {
      const mockOffer1 = {
        id: `k2MJRx`,
        category: [`Животные`],
        description: `Если найдёте дешевле — сброшу цену. Бонусом отдам все аксессуары. Даю недельную гарантию. Продаю с болью в сердце...`,
        picture: `item12.jpg`,
        title: `Продам отличную подборку фильмов на VHS`,
        type: `sale`,
        sum: 25913,
        comments: [],
      };
      const mockOffer2 = {
        id: `bDBSaq`,
        category: [`Животные`],
        description: `Две страницы заляпаны свежим кофе. Даю недельную гарантию. Если найдёте дешевле — сброшу цену.`,
        picture: `item13.jpg`,
        title: `Подам отличную подборку фильмов на VHS`,
        type: `offer`,
        sum: 31230,
        comments: [],
      };
      const mockOffers = [mockOffer1, mockOffer2];
      const server = await createServer(mockOffers);

      const res = await request(server).get(`/api/categories`);

      expect(res.body).toEqual([`Животные`]);
    });
  });

  describe(`GET apo/search`, () => {
    const mockOffer1 = {
      id: `k2MJRx`,
      category: [`Животные`],
      description: `Если найдёте дешевле — сброшу цену. Бонусом отдам все аксессуары. Даю недельную гарантию. Продаю с болью в сердце...`,
      picture: `item12.jpg`,
      title: `Продам отличную подборку фильмов на VHS`,
      type: `sale`,
      sum: 25913,
      comments: [],
    };
    const mockOffer2 = {
      id: `bDBSaq`,
      category: [`Посуда`],
      description: `Две страницы заляпаны свежим кофе. Даю недельную гарантию. Если найдёте дешевле — сброшу цену.`,
      picture: `item13.jpg`,
      title: `Подам отличную подборку фильмов`,
      type: `offer`,
      sum: 31230,
      comments: [],
    };
    const mockOffers = [mockOffer1, mockOffer2];
    let server;

    beforeEach(async () => {
      server = await createServer(mockOffers);
    });

    it(`should return status 404 if no offers with passed query`, async () => {
      const res = await request(server).get(`/api/search?query=query`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 200 if offers contains query in title`, async () => {
      const res = await request(server).get(`/api/search?query=VHS`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return array with offers which contain query in title`, async () => {
      const res = await request(server).get(`/api/search?query=VHS`);

      expect(res.body).toContainEqual(mockOffer1);
    });
  });
});


