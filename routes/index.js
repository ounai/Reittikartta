var express = require('express');
var router = express.Router();

/* GET / */
router.get('/', (req, res, next) => {
  res.redirect('/map');
});

/* GET /map */
router.get('/map', (req, res, next) => {
  res.render('map');
});

module.exports = router;

