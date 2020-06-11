'use strict';

const {describe, it, expect} = require(`@jest/globals`);

const request = require(`supertest`);
const {createServer} = require(`../server`);

describe(`Category API end-points`, () => {
  describe(`GET api/categories`, () => {
    it(`should return empty array if no offers`, async () => {
      const server = await createServer({offers: []});

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
      const server = await createServer({offers: mockOffers});

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
      const server = await createServer({offers: mockOffers});

      const res = await request(server).get(`/api/categories`);

      expect(res.body).toEqual([`Животные`]);
    });
  });
});
