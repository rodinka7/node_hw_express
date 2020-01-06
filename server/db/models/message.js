'use strict';
module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    message: DataTypes.TEXT
  }, {});
  message.associate = function(models) {};
  return message;
};