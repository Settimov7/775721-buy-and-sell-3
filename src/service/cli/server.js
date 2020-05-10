`use strict`;

const http = require(`http`);
const fs = require(`fs`).promises;

const chalk = require(`chalk`);

const {ExitCode, HttpStatusCode} = require(`../../constants`);

const DEFAULT_PORT = 3000;
const FILE_MOCKS_PATH = `./mocks.json`;
const Message = {
  NOT_FOUND: `Not found`,
};

const sendHtml = (response, statusCode, body) => {
  const html = `
    <!doctype html>
      <html lang="ru">
      <head>
        <title>With love from Node</title>
      </head>
      <body>${ body }</body>
    </html>`.trim();

  response.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  response.end(html);
};

const onClientConnect = async (request, response) => {
  switch (request.url) {
    case `/`: {
      try {
        const content = await fs.readFile(FILE_MOCKS_PATH);
        const offers = JSON.parse(content);
        const headers = offers.map(({title}) => `<li>${ title }</li>`).join(``);
        const headersList = `<ul>${ headers }</ul>`;

        sendHtml(response, HttpStatusCode.OK, headersList);
      } catch (error) {
        sendHtml(response, HttpStatusCode.NOT_FOUND, Message.NOT_FOUND);
      }

      break;
    }

    default: {
      sendHtml(response, HttpStatusCode.NOT_FOUND, Message.NOT_FOUND);

      break;
    }
  }
};

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    const httpServer = http.createServer(onClientConnect);

    httpServer.listen(port, (error) => {
      if (error) {
        console.error(chalk.red(`Ошибка при создании http-сервера.`, error));

        return process.exit(ExitCode.ERROR);
      }

      return console.info(chalk.green(`Принимаю подключения на ${ port }`));
    });
  },
};
