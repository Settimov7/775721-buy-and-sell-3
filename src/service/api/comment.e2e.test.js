'use strict';

const {describe, it, expect, beforeEach} = require(`@jest/globals`);

const request = require(`supertest`);
const {createServer} = require(`../server`);

describe(`Comment API end-points`, () => {
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
      server = await createServer({offers: mockOffers});
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
      server = await createServer({offers: mockOffers});
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
      server = await createServer({offers: mockOffers});
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
});
