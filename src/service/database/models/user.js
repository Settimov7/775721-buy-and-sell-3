'use strict';

exports.createUserModel = (sequelize, DataTypes) => {
  class User extends sequelize.Sequelize.Model {
  }

  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(50), /* eslint-disable-line */
      field: `first_name`,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(50), /* eslint-disable-line */
      field: `last_name`,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(320), /* eslint-disable-line */
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100), /* eslint-disable-line */
      allowNull: false,
    },
    avatar: {
      type: DataTypes.TEXT,
    },
  }, {
    sequelize,
    timestamps: false,
    paranoid: false,
    modelName: `user`,
  });

  return User;
};
