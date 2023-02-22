'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class request_repair extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  request_repair.init({
    lineId: DataTypes.STRING,
    detail: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'request_repair',
  });
  return request_repair;
};