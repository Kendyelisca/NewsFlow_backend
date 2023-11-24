const express = require("express");
const mailRouter = require("./mail.router");
const storyRouter = require("./story.router");
const userRouter = require("./user.router");
const router = express.Router();

// colocar las rutas aquí
router.use("/mail", mailRouter);
router.use("/stories", storyRouter);
router.use("/users", userRouter);
module.exports = router;
