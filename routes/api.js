const express = require('express');
const router = express.Router();

const routeModule = require('../modules/routes');

/* GET /api/getRoutes */
router.get('/getRoutes', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(routeModule.getRoutes()));
});

module.exports = router;

