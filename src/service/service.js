'use strict';

const {Cli} = require(`./cli`);
const {DEFAULT_COMMAND, USER_ARGV_START_INDEX, ExitCode} = require(`../constants`);

const userArguments = process.argv.slice(USER_ARGV_START_INDEX);
const [userCommand, ...userCommandArguments] = userArguments;

if (!userArguments.length || !Cli[userCommand]) {
  Cli[DEFAULT_COMMAND].run();

  process.exit(ExitCode.SUCCESS);
}

Cli[userCommand].run(userCommandArguments);
