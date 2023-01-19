'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('applicants',
      'avgRate', // new field name
     {
      type: Sequelize.INTEGER,
      allowNull : true
     },);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.removeColumn('applicants', 'avgRate'),
    ]);
  }
};