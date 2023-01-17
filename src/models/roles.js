'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      roles.belongsToMany(models.users, {
        through: models.user_roles,
        foreignKey: 'roleId'
      });

    }
  }
  roles.init({
    name: DataTypes.STRING,
    createdByUserId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'roles',
  });
  return roles;
};