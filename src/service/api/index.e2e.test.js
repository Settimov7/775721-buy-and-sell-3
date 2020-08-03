'use strict';

const {it, expect} = require(`@jest/globals`);
const request = require(`supertest`);

const {createServer} = require(`../server`);
const testDataBase = require(`../database/testDataBase`);

it(`should return status 404 if end-point doesn't exist`, async () => {
  const server = createServer({dataBase: testDataBase});

  const res = await request(server).get(`/api/random-route`);

  testDataBase.sequelize.close();

  expect(res.statusCode).toBe(404);
});


