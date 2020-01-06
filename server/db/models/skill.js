'use strict';
module.exports = (sequelize, DataTypes) => {
  const skill = sequelize.define('skill', {
    age: DataTypes.INTEGER,
    concerts: DataTypes.INTEGER,
    cities: DataTypes.INTEGER,
    years: DataTypes.INTEGER
  }, {});
  skill.associate = function(models) {};
  return skill;
};