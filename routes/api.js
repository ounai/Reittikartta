const express = require('express');
const router = express.Router();

const routeService = require('../services/routes');

/* GET /api/getRoutes */
router.get('/getRoutes', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(routeService.getRoutes()));
});

module.exports = router;

