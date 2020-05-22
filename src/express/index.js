`use strict`;

const path = require(`path`);

const express = require(`express`);
const chalk = require(`chalk`);

const mainRouter = require(`./routes/main-routes`);
const myRouter = require(`./routes/my-routes`);
const offersRouter = require(`./routes/offers-routes`);
const { HttpStatusCode } = require(`../constants`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const TEMPLATES_DIR = `templates`;

const app = express();

app.set(`view engine`, `pug`);
app.set(`views`, path.resolve(__dirname, TEMPLATES_DIR));

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.use(`/`, mainRouter);
app.use(`/my`, myRouter);
app.use(`/offers`, offersRouter);
app.use((req, res) => res.status(HttpStatusCode.NOT_FOUND).render(`errors/404`));
app.use((error, req, res, next) => res.status(HttpStatusCode.ERROR).render(`errors/500`));

app.listen(DEFAULT_PORT, () =>  console.info(chalk.green(`Принимаю подключения на ${ DEFAULT_PORT }`)));
