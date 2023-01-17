'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Applicants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Applicants.init({
    jobApplicationType: DataTypes.STRING,
    gender: DataTypes.STRING,
    name: DataTypes.STRING,
    idCode: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE,
    status: DataTypes.STRING,
    address: DataTypes.STRING,
    congenitalDisease: DataTypes.STRING,
    mobile: DataTypes.STRING,
    emergencyContact: DataTypes.STRING,
    refEmployee: DataTypes.STRING,
    portfolio: DataTypes.STRING,
    portfolioLink: DataTypes.STRING,
    military: DataTypes.STRING,
    talent: DataTypes.STRING,
    drivingAbility: DataTypes.STRING,
    motorcycle: DataTypes.STRING,
    thai: DataTypes.STRING,
    eng: DataTypes.STRING,
    iosSystem: DataTypes.STRING,
    pcSystem: DataTypes.STRING,
    officeEquipment: DataTypes.STRING,
    workInOther: DataTypes.STRING,
    position: DataTypes.STRING,
    expectedSalary: DataTypes.STRING,
    expectedIncome: DataTypes.STRING,
    target: DataTypes.STRING,
    successPride: DataTypes.STRING,
    peopleDontKnow: DataTypes.STRING,
    interest: DataTypes.STRING,
    newsFrom: DataTypes.STRING,
    aboutYou: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'applicants',
  });
  return Applicants;
};