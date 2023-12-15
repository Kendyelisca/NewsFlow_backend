const {
  getAll,
  create,
  getOne,
  remove,
  update,
} = require("../controllers/save.controller");
const express = require("express");
const verifyJWT = require("../utils/verifyJWT");

const saveRouter = express.Router();

// Apply the verifyJWT middleware to protect all routes
saveRouter.use(verifyJWT);

// Protected routes
saveRouter.route("/").get(getAll).post(create);

saveRouter.route("/:id").get(getOne).delete(remove).put(update);

module.exports = saveRouter;
