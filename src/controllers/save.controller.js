const catchError = require("../utils/catchError");
const Save = require("../models/Save");

const getAll = catchError(async (req, res) => {
  const userId = req.user.id;
  const results = await Save.findAll({ where: { userId } });
  return res.json(results);
});

const create = catchError(async (req, res) => {
  const { title, description, url, source, image, content, publishedAt } =
    req.body;
  const result = await Save.create({
    userId: req.user.id,
    title,
    description,
    url,
    source,
    image,
    content,
    publishedAt,
  });
  return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await Save.findByPk(id);
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;

  // Decode the URL parameter
  const decodedId = decodeURIComponent(id);

  // Log the decoded URL for debugging
  console.log("Decoded URL:", decodedId);

  // Remove the Save with the decoded ID
  await Save.destroy({ where: { url: decodedId } });

  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await Save.update(req.body, {
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
