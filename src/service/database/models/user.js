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
    name: {
      type: DataTypes.STRING(50), /* eslint-disable-line */
      field: `first_name`,
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

exports.createUserAssociations = ({User, Offer, Comment}) => {
  User.hasMany(Offer, {
    as: `offers`,
    foreignKey: `user_id`,
  });

  User.hasMany(Comment, {
    as: `comments`,
    foreignKey: `user_id`,
  });
};
