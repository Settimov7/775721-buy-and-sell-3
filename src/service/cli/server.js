'use strict';

const {createServer} = require(`../server`);
const {pinoLogger} = require(`../logger`);

const DEFAULT_PORT = 3000;

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    try {
      const server = await createServer();

      server.listen(port, () => pinoLogger.info(`Server start on port: ${ port }`))
      .on(`error`, (error) => pinoLogger.error(`Server can't start. Error: ${ error }`));
    } catch (error) {
      pinoLogger.error(`Can't create server. Error: ${ error }`);
    }
  },
};
