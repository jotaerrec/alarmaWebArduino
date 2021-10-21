let express = require("express");
let router = express.Router();
const functions = require("../controllers/functions");
const fs = require("fs");

router.get("/", async function (req, res, next) {
  let date = await functions.readWarnings();
  res.render("index.ejs", {
    date: date,
  });
});

module.exports = router;
