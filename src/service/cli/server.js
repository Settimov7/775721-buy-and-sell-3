'use strict';

const {createServer} = require(`../server`);
const {sequelize} = require(`../database`);
const {pinoLogger} = require(`../logger`);
const {API_SERVER_PORT} = require(`../../config`);

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || API_SERVER_PORT;

    try {
      pinoLogger.info(`Trying to connect to the database`);

      const result = await sequelize.sync();

      pinoLogger.info(`Successfully connected to ${result.config.database} database`);
    } catch (error) {
      pinoLogger.error(`Can't connect to database. Error: ${ error }`);
    }

    try {
      const server = await createServer();

      server.listen(port, () => pinoLogger.info(`Server start on port: ${ port }`))
      .on(`error`, (error) => pinoLogger.error(`Server can't start. Error: ${ error }`));
    } catch (error) {
      pinoLogger.error(`Can't create server. Error: ${ error }`);
    }
  },
};
