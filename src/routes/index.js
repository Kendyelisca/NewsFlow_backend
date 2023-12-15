const express = require("express");
const mailRouter = require("./mail.router");
const storyRouter = require("./story.router");
const userRouter = require("./user.router");
const saveRouter = require("./save.route");
const feedbackRouter = require("./feedback.router");
const scriptRouter = require("./script.router");
const router = express.Router();

// colocar las rutas aquí
router.use("/mail", mailRouter);
router.use("/stories", storyRouter);
router.use("/users", userRouter);
router.use("/saves", saveRouter);
router.use("/scripts", scriptRouter);
router.use("/feedbacks", feedbackRouter);
module.exports = router;
