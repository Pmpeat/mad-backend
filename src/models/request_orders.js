'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class request_orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      request_orders.belongsTo(models.users, {
        as: 'line'
      });
    }
  }
  request_orders.init({
    lineId: DataTypes.STRING,
    detail: DataTypes.STRING,
    status: DataTypes.STRING,
    urgency: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'request_orders',
  });
  return request_orders;
};