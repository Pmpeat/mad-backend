'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('request_orders',
      'urgency', // new field name
     {
      type: Sequelize.STRING,
      default : "normal"
     },);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.removeColumn('request_orders', 'urgency'),
    ]);
  }
};