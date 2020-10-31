'use strict';

const {describe, it, expect, beforeEach, afterAll} = require(`@jest/globals`);
const request = require(`supertest`);

const {createServer} = require(`../server`);
const testDataBase = require(`../database/testDataBase`);

describe(`User API end-points`, () => {
  const server = createServer({dataBase: testDataBase});

  afterAll(() => {
    testDataBase.sequelize.close();
  });

  describe(`POST api/user`, () => {
    const users = [
      {
        id: 1,
        firstName: `Иван`,
        lastName: `Иванович`,
        email: `ivan@mail.com`,
        password: 123456,
        avatar: `avatar01.jpg`,
      },
    ];

    beforeEach(async () => {
      await testDataBase.resetDataBase({users});
    });

    it(`should return status 400 if firstName contain numbers`, async () => {
      const data = {
        firstName: `James1`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if firstName contain special symbols`, async () => {
      const data = {
        firstName: `James@#!`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if firstName longer than 50 letters`, async () => {
      const data = {
        firstName: `JamesJamesJamesJamesJamesJamesJamesJamesJamesJamesJamesJames`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if haven't sent firstName`, async () => {
      const data = {
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if lastName contain numbers`, async () => {
      const data = {
        firstName: `James`,
        lastName: `Bond1`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if lastName contain special symbols`, async () => {
      const data = {
        firstName: `James`,
        lastName: `Bond@#!`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if lastName longer than 50 letters`, async () => {
      const data = {
        firstName: `James`,
        lastName: `BondBondBondBondBondBondBondBondBondBondBondBondBondBond`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if haven't sent lastName`, async () => {
      const data = {
        firstName: `James`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent invalid email`, async () => {
      const data = {
        firstName: `James`,
        lastName: `Bond`,
        email: `jamesBond@mail`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have password shorter than 6 symbols`, async () => {
      const data = {
        firstName: `James`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        password: `123`,
        passwordRepeat: `123`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if haven't sent password`, async () => {
      const data = {
        firstName: `James`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        passwordRepeat: `123456`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if haven't sent passwordRepeat`, async () => {
      const data = {
        firstName: `James`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if password and passwordRepeat are not equal`, async () => {
      const data = {
        firstName: `James`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        password: `123457`,
        passwordRepeat: `123456`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent not jpg or png avatar`, async () => {
      const data = {
        firstName: `James`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.gif`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if exist user with the same email`, async () => {
      const data = {
        firstName: `James`,
        lastName: `Bond`,
        email: `ivan@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 201 if have sent valid data`, async () => {
      const data = {
        firstName: `James`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.png`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(201);
    });

    it(`should return user data with id and password if have sent valid data`, async () => {
      const data = {
        firstName: `James`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.png`,
      };

      const expectedUserData = {
        firstName: `James`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        avatar: `avatar.png`,
      };

      const {body} = await request(server).post(`/api/user`).send(data);

      expect(body).toHaveProperty(`id`);
      expect(body).toHaveProperty(`password`);
      expect(body).toMatchObject(expectedUserData);
    });

    it(`should return the hash sum of the password`, async () => {
      const data = {
        firstName: `James`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.png`,
      };

      const {body} = await request(server).post(`/api/user`).send(data);

      expect(body.password).not.toEqual(data.password);
    });
  });
});
