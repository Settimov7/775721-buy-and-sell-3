`use strict`;

const express = require(`express`);
const chalk = require(`chalk`);

const {HttpStatusCode} = require(`../../constants`);
const {router} = require(`../api`);

const DEFAULT_PORT = 3000;
const Route = {
  API: `/api`,
};

const app = express();

app.use(express.json());

app.use(Route.API, router);

app.use((req, res) => res.status(HttpStatusCode.NOT_FOUND).send(`Not found`));

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, () => console.info(chalk.green(`Принимаю подключения на ${ port }`)));
  },
};
