'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('request_repairs',
      'status', // new field name
     {
      type: Sequelize.STRING,
      default : "รอการตรวจสอบ"
     },);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.removeColumn('request_repairs', 'status'),
    ]);
  }
};