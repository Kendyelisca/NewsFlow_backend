const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const Save = sequelize.define("save", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  publishedAt: {
    type: DataTypes.DATE, // Use DATE for date and time
    allowNull: false,
  },
  source: {
    type: DataTypes.JSONB, // Use JSONB for nested JSON data
    allowNull: false,
    defaultValue: { name: "News source", url: "no url" },
  },
});

module.exports = Save;
