var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("login.ejs", {
    error: req.flash("errors"),
  });
});
router.post("/log", async function (req, res, next) {
  try {
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
