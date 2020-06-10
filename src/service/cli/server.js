'use strict';

const chalk = require(`chalk`);

const {createServer} = require(`../server`);

const DEFAULT_PORT = 3000;

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    const server = await createServer();

    server.listen(port, () => console.info(chalk.green(`Принимаю подключения на ${ port }`)));
  },
};
