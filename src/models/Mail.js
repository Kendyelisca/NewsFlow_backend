const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const Mail = sequelize.define("mail", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Mail;
