'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class request_vacations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  request_vacations.init({
    lineId: DataTypes.STRING,
    type: DataTypes.STRING,
    reason: DataTypes.STRING,
    from: DataTypes.DATE,
    to: DataTypes.DATE,
    status: DataTypes.STRING,
    days: DataTypes.INTEGER,
    approveStatus : DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'request_vacations',
  });
  return request_vacations;
};