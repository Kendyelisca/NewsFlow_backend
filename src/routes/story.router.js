const {
  getAll,
  create,
  getOne,
  remove,
  update,
} = require("../controllers/story.controller");
const express = require("express");
const verifyJWT = require("../utils/verifyJWT");

const storyRouter = express.Router();

storyRouter.route("/").get(getAll).post(verifyJWT, create);

// Combine the /:id route with /likes route
storyRouter
  .route("/:id")
  .get(getOne)
  .delete(verifyJWT, remove)
  .put(verifyJWT, update);

module.exports = storyRouter;
