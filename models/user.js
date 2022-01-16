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
      Users.hasMany(models.Posts, {
        foreignKey: 'post_id'
      });
      Users.hasMany(models.Posts, {
        foreignKey: 'creator'
      });
      Users.hasMany(models.Comments, {
        foreignKey: 'id'
      });
    }
  };
  Users.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    lastname: DataTypes.STRING,
    job: DataTypes.STRING,
    account_type: DataTypes.BOOLEAN,
    profile_picture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};