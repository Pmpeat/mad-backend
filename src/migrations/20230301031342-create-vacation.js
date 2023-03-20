'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('vacations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      lineId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      vacationLeave: {
        type: Sequelize.FLOAT,
        default: 0.0,
        allowNull: true
      },
      sickLeave: {
        type: Sequelize.FLOAT,
        default: 0.0,
        allowNull: true
      },
      personalLeave: {
        type: Sequelize.FLOAT,
        default: 0.0,
        allowNull: true
      },
      leaveWithoutPayment: {
        type: Sequelize.FLOAT,
        default: 0.0,
        allowNull: true
      },
      createdByUserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('vacations');
  }
};
