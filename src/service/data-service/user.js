'use strict';

const bcrypt = require(`bcrypt`);

const {PASSWORD_SALT_ROUNDS} = require(`../../config`);

class UserService {
  constructor(dataBase, logger) {
    this._dataBase = dataBase;
    this._models = dataBase.models;
    this._logger = logger;
    this._selectOptions = {
      raw: true,
      attributes: [
        `id`,
        `name`,
        `email`,
        `password`,
        `avatar`,
      ],
    };
  }

  async create({name, email, password, avatar}) {
    const {User} = this._models;

    const saltRounds = parseInt(PASSWORD_SALT_ROUNDS, 10);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    try {
      return User.create({
        name,
        email,
        password: passwordHash,
        avatar,
      });
    } catch (error) {
      this._logger.error(`Can't create user. Error: ${ error }`);

      return null;
    }
  }

  async findByEmail(email) {
    const {User} = this._models;

    try {
      return User.findOne({
        ...this._selectOptions,
        where: {
          email,
        },
      });
    } catch (error) {
      this._logger.error(`Can't find user with email: ${ email }. Error: ${ error }`);

      return null;
    }
  }

  async isExist(email) {
    return !!await this.findByEmail(email);
  }

  async isUserPasswordCorrect(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
  }
}

exports.UserService = UserService;
