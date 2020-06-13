'use strict';

const {describe, it, expect, beforeEach} = require(`@jest/globals`);

const request = require(`supertest`);
const {createServer} = require(`../server`);

describe(`Search API end-points`, () => {
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
      server = await createServer({offers: mockOffers});
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
