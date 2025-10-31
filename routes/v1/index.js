const express = require('express');
const authRoute = require('./auth.route');
const requestRoute = require('./request.route')
const httpStatus = require('http-status');
const cache = require('../../utils/cache');


const router = express.Router();

const defaultRoutes = [
  {
    path: '/request',
    route: requestRoute
  },
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/request',
    route: requestRoute
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* GET home page. */
router.get('/', cache, function(req, res, next) {
  res.status(httpStatus.OK).json({deployed: true});
});

module.exports = router;

