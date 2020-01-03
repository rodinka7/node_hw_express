'use strict';
module.exports = (sequelize, DataTypes) => {
  const upload = sequelize.define('upload', {
    photo: DataTypes.STRING,
    name: DataTypes.STRING,
    price: DataTypes.INTEGER
  }, {});
  upload.associate = function(models) {};
  return upload;
};