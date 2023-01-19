'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Users.belongsToMany(models.roles, {
        through: models.user_roles,
        foreignKey: 'userId'
      });
    }
  }
  Users.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    createdByUserId: DataTypes.INTEGER,
    lastLogin: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'users',
  });
  return Users;
};