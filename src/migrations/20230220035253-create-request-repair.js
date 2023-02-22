'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('request_repairs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      lineId: {
        type: Sequelize.STRING,
      },
      detail: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('request_repairs');
  }
};