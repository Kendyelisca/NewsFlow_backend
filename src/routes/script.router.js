const {
  getAll,
  create,
  getOne,
  remove,
  update,
} = require("../controllers/script.controller");
const express = require("express");

const scriptRouter = express.Router();

scriptRouter.route("/").get(getAll).post(create);

scriptRouter.route("/:id").get(getOne).delete(remove).put(update);

module.exports = scriptRouter;
