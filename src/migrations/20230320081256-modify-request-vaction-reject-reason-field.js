'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('request_vacations',
      'rejectReason', // new field name
     {
      type: Sequelize.STRING,
      allowNull : true
     },);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.removeColumn('rejectReason', 'leaveType'),
    ]);
  }
};