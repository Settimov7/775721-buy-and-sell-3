`use strict`;

const fs = require(`fs`).promises;

const express = require(`express`);
const chalk = require(`chalk`);

const {HttpStatusCode} = require(`../../constants`);

const DEFAULT_PORT = 3000;
const FILE_MOCKS_PATH = `./mocks.json`;

const app = express();

const router = new express.Router();

router.get(`/offers`, async (req, res) => {
  try {
    const content = await fs.readFile(FILE_MOCKS_PATH);
    const offers = JSON.parse(content);

    res.json(offers);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json([]);
  }
});

app.use(express.json());

app.use(router);

app.use((req, res) => res.status(HttpStatusCode.NOT_FOUND).send(`Not found`));

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, () => console.info(chalk.green(`Принимаю подключения на ${ port }`)));
  },
};
