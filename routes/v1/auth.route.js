const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const adminController = require('../../controllers/admin.controller')
const { authLimiter } = require('../../middlewares/rateLimiter');
const { allowedMethod } = require('../../middlewares/headers');
const config = require('../../config/auth');
const { unAllowedMethod } = require('../../middlewares/method');
const cache = require('../../utils/cache');

const router = express.Router();


if (config.env == 'production') {
    router.use(authLimiter)
}
router.use(allowedMethod)

router.route('/register/customer')
    .post(allowedMethod, validate(authValidation.register), authController.register)
    .all(unAllowedMethod)

router.route('/register/admin')
    .post(allowedMethod, validate(authValidation.registerAdmin), adminController.registerAdmin)
    .all(unAllowedMethod)

router.route('/login/customer')
    .post(allowedMethod, validate(authValidation.login), authController.login)
    .all(unAllowedMethod)
router.route('/login/admin')
    .post(allowedMethod, validate(authValidation.login), adminController.loginAdmin)
    .all(unAllowedMethod)


router.route('/logout')
    .post(cache, allowedMethod, validate(authValidation.logout), authController.logout)
    .all(unAllowedMethod)
router.route('/refresh-tokens')
    .post(allowedMethod, validate(authValidation.refreshTokens), authController.refreshTokens)
    .all(unAllowedMethod)

module.exports = router;
