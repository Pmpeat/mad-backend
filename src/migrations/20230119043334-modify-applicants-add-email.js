'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('applicants',
      'email', // new field name
     {
      type: Sequelize.STRING,
      allowNull : true
     },);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.removeColumn('applicants', 'email'),
    ]);
  }
};