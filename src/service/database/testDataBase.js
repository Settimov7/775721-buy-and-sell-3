'use strict';

const Sequelize = require(`sequelize`);

const {createModels} = require(`./createModels`);
const {fillDataBase} = require(`./fill-data-base`);
const {TEST_DB_HOST, TEST_DB_PORT, TEST_DB_USER_NAME, TEST_DB_NAME, TEST_DB_PASSWORD} = require(`../../config`);

const DB_URI = `postgres://${ TEST_DB_USER_NAME }:${ TEST_DB_PASSWORD }@${ TEST_DB_HOST }:${ TEST_DB_PORT }/${ TEST_DB_NAME }`;

const sequelize = new Sequelize(DB_URI, {
  logging: false,
});

const models = createModels(sequelize);

const resetDataBase = async (mocks) => {
  try {
    await fillDataBase({
      dataBase: {sequelize, models},
      mocks,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  models,
  sequelize,
  resetDataBase,
};
