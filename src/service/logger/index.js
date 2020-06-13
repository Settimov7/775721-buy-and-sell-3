'use strict';

const createLogger = require(`pino`);

const pinoLogger = createLogger({
  name: `pino-logger`,
  level: process.env.LOG_LEVEL || `info`
});

exports.pinoLogger = pinoLogger;
