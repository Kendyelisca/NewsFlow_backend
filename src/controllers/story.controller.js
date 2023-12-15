const catchError = require("../utils/catchError");
const Story = require("../models/Story");
const User = require("../models/User");
//const Script = require("../models/Script");

const getAll = catchError(async (req, res) => {
  try {
    const results = await Story.findAll({
      include: [
        { model: User, attributes: ["id", "name", "username", "email"] },
        //{ model: Script, attributes: ["id", "text"] },
      ],
    });

    console.log("Results:", results);

    return res.json(results);
  } catch (error) {
    console.error("Error fetching stories:", error);

    // Log additional information for debugging
    if (error.name === "SequelizeEagerLoadingError") {
      console.error("Eager loading error details:", error.original); // Log the original error
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const create = catchError(async (req, res) => {
  const { title, image, url, description } = req.body;
  const userId = req.user.id;
  const result = await Story.create({
    userId: userId,
    title,
    image,
    url,
    description,
  });
  return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await Story.findByPk(id);
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  await Story.destroy({ where: { id } });
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  const [rowsAffected, updatedRows] = await Story.update(req.body, {
    where: { id },
    returning: true,
  });

  if (rowsAffected === 0) {
    return res.sendStatus(404);
  }

  // Assuming that `updatedRows` is an array
  return res.json(updatedRows[0]);
});

module.exports = {
  getAll,
  create,
  getOne,
  remove,
  update,
};
