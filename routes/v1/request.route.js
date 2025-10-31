// routes/v1/request.route.js
const express = require('express');
const validate = require('../../middlewares/validate');
const requestValidation = require('../../validations/request.validation');
const requestController = require('../../controllers/request.controller');
const { allowedMethod } = require('../../middlewares/headers');
const { unAllowedMethod } = require('../../middlewares/method');
const auth = require('../../middlewares/auth');
const {verifyToken} = require('../../middlewares/verify')
const router = express.Router();

router.use(allowedMethod);


router.route('/')
  .post(allowedMethod, verifyToken, validate(requestValidation.createRequest), requestController.createRequest)
  .get(allowedMethod, verifyToken, requestController.getUserRequests)
  .all(unAllowedMethod);

router.route('/filter')
  .get(allowedMethod, verifyToken, requestController.getFilteredRequests)
  .all(unAllowedMethod);

router.route('/:requestId/status')
  .patch(allowedMethod, validate(requestValidation.updateStatus), requestController.updateRequestStatus)
  .all(unAllowedMethod);



module.exports = router;