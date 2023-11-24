const {
  getAll,
  create,
  getOne,
  remove,
  update,
  login,
} = require("../controllers/user.controller");
const express = require("express");
const verifyJWT = require("../utils/verifyJWT");

const userRouter = express.Router();

userRouter.route("/").get(verifyJWT, getAll).post(create);

userRouter
  .route("/:id")
  .get(verifyJWT, getOne)
  .delete(verifyJWT, remove)
  .put(verifyJWT, update);

userRouter.route("/login").post(login);

module.exports = userRouter;
