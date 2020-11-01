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
      await this._resetIds();

      return await User.create({
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
      return await User.findOne({
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

  async _resetIds() {
    const {sequelize} = this._dataBase;

    try {
      await sequelize.query(`ALTER SEQUENCE users_id_seq RESTART`);
      await sequelize.query(`UPDATE users SET id = DEFAULT`);
    } catch (error) {
      this._logger.error(`Can't reset user ids. Error: ${ error }`);
    }
  }
}

exports.UserService = UserService;
