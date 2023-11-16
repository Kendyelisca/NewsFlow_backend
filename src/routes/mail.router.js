const {
  getAll,
  create,
  getOne,
  remove,
  update,
} = require("../controllers/mail.controller");
const express = require("express");

const mailRouter = express.Router();

mailRouter.route("/").get(getAll).post(create);

mailRouter.route("/:id").get(getOne).delete(remove).put(update);

module.exports = mailRouter;
