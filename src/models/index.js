const Save = require("./Save");
const Story = require("./Story");
const User = require("./User");
const Feedback = require("./Feedback");
const Script = require("./Script");

User.hasMany(Save);
Save.belongsTo(User);

User.hasMany(Story);
Story.belongsTo(User);

User.hasMany(Feedback);
Feedback.belongsTo(User);

Story.hasMany(Script);
Script.belongsTo(Story);
