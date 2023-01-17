'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('applicants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      jobApplicationType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      idCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      congenitalDisease: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mobile: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      emergencyContact: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      refEmployee: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      portfolio: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      portfolioLink: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      military: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      talent: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      drivingAbility: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      motorcycle: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      thai: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      eng: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      iosSystem: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pcSystem: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      officeEquipment: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      workInOther: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      position: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      expectedSalary: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      expectedIncome: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      target: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      successPride: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      peopleDontKnow: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      interest: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      newsFrom: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      aboutYou: {
        type: Sequelize.STRING,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('applicants');
  }
};