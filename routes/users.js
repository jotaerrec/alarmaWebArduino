var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login.ejs',{
    error: req.flash('errors')
  });
});
router.post('/log', async function (req, res, next){
        
  try {
    if (req.body.email == "javi.r49915@gmail.com") {
      if (req.body.password == "fedeputo") {
        console.log("llego")
        console.log(req.body)
        res.render('index.ejs', {
          message: "password correcto"
        })
      } else {
        req.flash('errors', 'Password invalido');
        res.redirect("/users/")
      }
    } else {
      req.flash('errors', 'Email invalido');
      res.redirect("/users/")
    }
  } catch (e) {
    console.log(e)
  }
})

module.exports = router;
