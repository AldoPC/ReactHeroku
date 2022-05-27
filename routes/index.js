var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Logout
router.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
