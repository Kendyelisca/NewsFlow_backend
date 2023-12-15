const {
  getAll,
  create,
  getOne,
  remove,
  update,
} = require("../controllers/feedback.controller");
const express = require("express");
const verifyJWT = require("../utils/verifyJWT");

const feedbackRouter = express.Router();

feedbackRouter.route("/").get(getAll).post(verifyJWT, create);

feedbackRouter
  .route("/:id")
  .get(getOne)
  .delete(verifyJWT, remove)
  .put(verifyJWT, update);

module.exports = feedbackRouter;
