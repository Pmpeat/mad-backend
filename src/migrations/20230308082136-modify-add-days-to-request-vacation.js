'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('request_vacations',
      'days', // new field name
     {
      type: Sequelize.INTEGER,
      default : 0
     },);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.removeColumn('request_vacations', 'days'),
    ]);
  }
};