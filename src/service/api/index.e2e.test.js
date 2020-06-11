'use strict';

const {it, expect} = require(`@jest/globals`);

const request = require(`supertest`);
const {createServer} = require(`../server`);

it(`should return status 404 if end-point doesn't exist`, async () => {
  const server = await createServer({offers: []});

  const res = await request(server).get(`/api/random-route`);

  expect(res.statusCode).toBe(404);
});


