const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");
const Story = require("./Story");

const Script = sequelize.define("script", {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Script.belongsTo(Story);

module.exports = Script;
