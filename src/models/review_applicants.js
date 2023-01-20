'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class review_applicants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      review_applicants.belongsTo(models.users, {
        foreignKey: 'userId'
      });

      review_applicants.belongsTo(models.applicants, {
        foreignKey: 'applicantId'
      });
    }
  }
  review_applicants.init({
    userId: DataTypes.INTEGER,
    applicantId: DataTypes.INTEGER,
    workSkillRate: DataTypes.INTEGER,
    attitudeRate: DataTypes.INTEGER,
    professionalismRate: DataTypes.INTEGER,
    leadershipRate: DataTypes.INTEGER,
    socialSkillRate: DataTypes.INTEGER,
    academicScoreRate: DataTypes.INTEGER,
    otherSkillRate: DataTypes.INTEGER,
    comment: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'review_applicants',
  });
  return review_applicants;
};