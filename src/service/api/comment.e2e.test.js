'use strict';

const {describe, it, expect, beforeEach, afterAll} = require(`@jest/globals`);
const request = require(`supertest`);

const {createServer} = require(`../server`);
const testDataBase = require(`../database/testDataBase`);

describe(`Comment API end-points`, () => {
  const server = createServer({dataBase: testDataBase});
  const categories = [
    {
      id: 1,
      title: `Игры`,
      image: `category01.jpg`,
    },
  ];
  const userData = {
    name: `James Bond`,
    email: `jamesBond@mail.com`,
    password: `123456`,
    passwordRepeat: `123456`,
    avatar: `avatar.png`,
  };
  const offerData = {
    title: `Куплю новую приставку Xbox`,
    picture: `item01.jpg`,
    sum: 67782.42,
    type: `buy`,
    description: `Кому нужен этот новый телефон, если тут такое... Даю недельную гарантию.`,
    category: [1]
  };
  const firstCommentData = {
    text: `С чем связана продажа? Почему так дешёво? Почему в таком ужасном состоянии?`,
  };
  const secondCommentData = {
    text: `Неплохо, но дорого. Почему в таком ужасном состоянии?`,
  };

  const headers = {};
  let offers = [];
  let offerId;

  beforeEach(async () => {
    await testDataBase.resetDataBase({categories});
    await request(server).post(`/api/user`).send(userData);

    const {body: loginBody} = await request(server).post(`/api/user/login`).send({email: userData.email, password: userData.password});

    headers.authorization = `Bearer ${loginBody.accessToken} ${loginBody.refreshToken}`;

    await request(server).post(`/api/offers`).send(offerData).set(headers);

    const {body: offersBody} = await request(server).get(`/api/offers`).send(offerData);

    offers = offersBody.offers;
    offerId = offers[0].id;
  });

  afterAll(() => {
    testDataBase.sequelize.close();
  });

  describe(`GET api/offers/:offerId/comments`, () => {
    beforeEach(async () => {
      await request(server).post(`/api/offers/${offerId}/comments`).send(firstCommentData).set(headers);
      await request(server).post(`/api/offers/${offerId}/comments`).send(secondCommentData).set(headers);
    });

    it(`should return status 404 if offer doesn't exist`, async () => {
      const res = await request(server).get(`/api/offers/1234/comments`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 200 if offer exist`, async () => {
      const res = await request(server).get(`/api/offers/1/comments`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return comments`, async () => {
      const expectedFirstComment = {
        id: 1,
        message: `С чем связана продажа? Почему так дешёво? Почему в таком ужасном состоянии?`,
      };
      const expectedSecondComment = {
        id: 2,
        message: `Неплохо, но дорого. Почему в таком ужасном состоянии?`,
      };

      const res = await request(server).get(`/api/offers/1/comments`);
      const [firstComment, secondComment] = res.body;

      expect(firstComment).toMatchObject(expectedFirstComment);
      expect(secondComment).toMatchObject(expectedSecondComment);
    });
  });

  describe(`POST api/offers/:offerId/comments`, () => {
    let path;

    beforeEach(() => {
      path = `/api/offers/${offerId}/comments`;
    });

    it(`should return status 404 if offer doesn't exist`, async () => {
      const data = {
        text: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.`,
      };
      const res = await request(server).post(`/api/offers/1234/comments`).send(data).set(headers);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 400 if have sent text shorter than 20 letters`, async () => {
      const data = {
        text: `Lorem`,
      };
      const res = await request(server).post(path).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if didnt send text`, async () => {
      const data = {
        message: `New comment`,
      };
      const res = await request(server).post(path).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 401 if didnt send authorization headers`, async () => {
      const data = {
        text: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.`,
      };
      const res = await request(server).post(path).send(data);

      expect(res.statusCode).toBe(401);
    });

    it(`should return status 201 if new comment was created`, async () => {
      const data = {
        text: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.`,
      };
      const res = await request(server).post(path).send(data).set(headers);

      expect(res.statusCode).toBe(201);
    });

    it(`should return new comment if new comment was created`, async () => {
      const data = {
        text: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.`,
      };
      const expectedComment = {
        message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.`,
      };

      const res = await request(server).post(path).send(data).set(headers);

      expect(res.body).toHaveProperty(`id`);
      expect(res.body).toMatchObject(expectedComment);
    });

    it(`should return comments with new comment if new comment was created`, async () => {
      const data = {
        text: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.`,
      };
      const {body: newComment} = await request(server).post(path).send(data).set(headers);
      const res = await request(server).get(path).set(headers);

      expect(res.body).toContainEqual(newComment);
    });
  });

  describe(`DELETE api/offers/:offerId/comments/:commentId`, () => {
    let comments = [];
    let commentId;

    beforeEach(async () => {
      await request(server).post(`/api/offers/${offerId}/comments`).send(firstCommentData).set(headers);
      await request(server).post(`/api/offers/${offerId}/comments`).send(secondCommentData).set(headers);

      const {body: commentsBody} = await request(server).get(`/api/offers/${offerId}/comments`);

      comments = commentsBody;
      commentId = commentsBody[1].id;
    });

    it(`should return status 404 if offer doesn't exist`, async () => {
      const res = await request(server).delete(`/api/offers/1234/comments/${comments[0].id}`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 404 if comment doesn't exist`, async () => {
      const res = await request(server).delete(`/api/offers/${offerId}/comments/1234`).set(headers);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 400 if have sent invalid commentId`, async () => {
      const res = await request(server).delete(`/api/offers/${offerId}/comments/abc`).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 401 if haven't sent headers`, async () => {
      const res = await request(server).delete(`/api/offers/${offerId}/comments/${commentId}`);

      expect(res.statusCode).toBe(401);
    });

    it(`should return status 403 if tried to delete someone else's comment`, async () => {
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

      const res = await request(server).delete(`/api/offers/${offerId}/comments/${commentId}`).set({authorization: authorizationHeader});

      expect(res.statusCode).toBe(403);
    });

    it(`should return status 200 if comment was deleted`, async () => {
      const res = await request(server).delete(`/api/offers/${offerId}/comments/${commentId}`).set(headers);

      expect(res.statusCode).toBe(200);
    });

    it(`should return deleted comment if comment was deleted`, async () => {
      const expectedComment = {
        message: secondCommentData.text,
      };

      const res = await request(server).delete(`/api/offers/${offerId}/comments/${commentId}`).set(headers);

      expect(res.body).toMatchObject(expectedComment);
    });

    it(`should return comments without deleted comment if comment was deleted`, async () => {
      const {body: deletedComment} = await request(server).delete(`/api/offers/${offerId}/comments/${commentId}`).set(headers);
      const res = await request(server).get(`/api/offers/${offerId}/comments`).set(headers);

      expect(res.body).not.toContainEqual(deletedComment);
    });
  });
});
