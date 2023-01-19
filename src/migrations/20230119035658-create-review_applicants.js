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
      work_skill_rate: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      attitude_rate: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      professionalism_rate: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      leadership_rate: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      social_skill_rate: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      academic_score_rate: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      other_skill_rate: {
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
