'use strict';

const {describe, it, expect, beforeEach} = require(`@jest/globals`);

const request = require(`supertest`);
const {createServer} = require(`../server`);

describe(`Offer API end-points`, () => {
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
        type: `sell`,
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
        type: `buy`,
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
      server = await createServer({offers: mockOffers});
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
      server = await createServer({offers: []});
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
      type: `sell`,
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
      server = await createServer({offers: mockOffers});
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
      type: `sell`,
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
      server = await createServer({offers: mockOffers});
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
      type: `sell`,
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
      type: `buy`,
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
      server = await createServer({offers: mockOffers});
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
});
