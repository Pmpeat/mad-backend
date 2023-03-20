'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('request_vacations',
      'leaveType', // new field name
     {
      type: Sequelize.STRING,
      allowNull : true
     },);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.removeColumn('request_vacations', 'leaveType'),
    ]);
  }
};