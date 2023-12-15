const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");
const User = require("./User");
const Story = require("./Story");

const Feedback = sequelize.define("feedback", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Feedback.belongsTo(User);
Feedback.belongsTo(Story);

module.exports = Feedback;
