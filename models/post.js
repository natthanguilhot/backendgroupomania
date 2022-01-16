'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Posts.belongsTo(models.Users, {
        foreignKey: 'creator',
      });
      Posts.hasMany(models.Likes, {
        foreignKey: 'post_id'
      });
      Posts.hasMany(models.Comments, {
        foreignKey: 'post_id'
      });
    }
  };
  Posts.init({
    creator: DataTypes.INTEGER,
    files: DataTypes.STRING,
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Posts',
  });
  return Posts;
};