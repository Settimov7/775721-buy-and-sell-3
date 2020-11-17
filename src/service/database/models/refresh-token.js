'use strict';

exports.createRefreshTokenModel = (sequelize, DataTypes) => {
  class RefreshToken extends sequelize.Sequelize.Model {
  }

  RefreshToken.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING, /* eslint-disable-line */
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: false,
    paranoid: false,
    modelName: `refresh_token`,
  });

  return RefreshToken;
};
