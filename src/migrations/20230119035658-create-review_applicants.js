'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('review_applicants', {
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
      applicantId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'applicants',
          key: 'id',
        },
      },
      workSkillRate: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      attitudeRate: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      professionalismRate: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      leadershipRate: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      socialSkillRate: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      academicScoreRate: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      otherSkillRate: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      comment: {
        type: Sequelize.STRING,
        allowNull: true
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
    await queryInterface.dropTable('review_applicants');
  }
};
