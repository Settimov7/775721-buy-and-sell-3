'use strict';

const Sequelize = require(`sequelize`);

const {createModels} = require(`./createModels`);
const {pinoLogger} = require(`../logger`);
const {DB_HOST, DB_PORT, DB_USER_NAME, DB_NAME, DB_PASSWORD} = require(`../../config`);

const DB_URI = `postgres://${ DB_USER_NAME }:${ DB_PASSWORD }@${ DB_HOST }:${ DB_PORT }/${ DB_NAME }`;

const sequelize = new Sequelize(DB_URI, {
  logging: (message) => pinoLogger.debug(message),
});

const models = createModels(sequelize);

module.exports = {
  models,
  sequelize,
};
