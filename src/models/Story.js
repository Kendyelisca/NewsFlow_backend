const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");
const User = require("./User");

const Story = sequelize.define(
  "story",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    getterMethods: {
      getImage() {
        return this.image || "http://tinyurl.com/2czmzaf3";
      },
    },
  }
);

Story.belongsTo(User);

module.exports = Story;
