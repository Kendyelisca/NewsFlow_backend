const catchError = require("../utils/catchError");
const User = require("../models/User");
const Story = require("../models/Story");
const Feedback = require("../models/Feedback");

const getAll = catchError(async (req, res) => {
  const results = await Feedback.findAll({
    include: [
      { model: User, attributes: ["id", "name", "username", "email"] },
      { model: Story, attributes: ["id", "title"] }, // Include the story here
    ],
  });
  return res.json(results);
});

const create = catchError(async (req, res) => {
  const { text } = req.body;
  const userId = req.user.id;
  const result = await Feedback.create({
    userId: userId,
    text,
  });
  return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await Feedback.findByPk(id);
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  await Feedback.destroy({ where: { id } });
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await Feedback.update(req.body, {
    where: { id },
    returning: true,
  });
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});

module.exports = {
  getAll,
  create,
  getOne,
  remove,
  update,
};
