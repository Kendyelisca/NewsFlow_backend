const catchError = require("../utils/catchError");
const Script = require("../models/Script");
const Story = require("../models/Story");

const getAll = catchError(async (req, res) => {
  const results = await Script.findAll({
    include: [{ model: Story, attributes: ["id", "title"] }],
  });
  return res.json(results);
});

const create = catchError(async (req, res) => {
  const result = await Script.create(req.body);
  return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await Script.findByPk(id);
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  await Script.destroy({ where: { id } });
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await Script.update(req.body, {
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
