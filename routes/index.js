const express = require('express');
const router = express.Router();

/* GET / */
router.get('/', (req, res) => {
  res.redirect('/map');
});

/* GET /map */
router.get('/map', (req, res) => {
  res.render('map');
});

module.exports = router;

