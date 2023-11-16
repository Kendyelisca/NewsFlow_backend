const express = require("express");
const mailRouter = require("./mail.router");
const router = express.Router();

// colocar las rutas aquí
router.use("/mail", mailRouter);

module.exports = router;
