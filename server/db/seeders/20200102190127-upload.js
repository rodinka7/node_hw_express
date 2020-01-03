'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('uploads', [{
        photo: './assets/img/products/Work1.jpg',
        name: 'Вино вдохновение',
        price: 600,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('uploads', null, {});
  }
};
