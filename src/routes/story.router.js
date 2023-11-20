const {
  getAll,
  create,
  getOne,
  remove,
  update,
} = require("../controllers/story.controller");
const express = require("express");

const storyRouter = express.Router();

storyRouter.route("/").get(getAll).post(create);

storyRouter.route("/:id").get(getOne).delete(remove).put(update);

module.exports = storyRouter;
