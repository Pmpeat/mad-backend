'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('applicants',
      'avatar', // new field name
     {
      type: Sequelize.STRING,
      allowNull : true
     },);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.removeColumn('applicants', 'avatar'),
    ]);
  }
};