const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    fullname: Joi.string().required(),
    email: Joi.string().required().email(),
    phoneNumber: Joi.string().optional(),
    password: Joi.string().required().custom(password),
    confirmPassword: Joi.string().required().valid(Joi.ref('password'))
      .messages({ 'any.only': 'Passwords do not match' }),

  }),
};

const registerAdmin = {
  body: Joi.object().keys({
    fullname: Joi.string().required(),
    email: Joi.string().required().email(),
    phoneNumber: Joi.string().optional(),
    password: Joi.string().required().custom(password),
    confirmPassword: Joi.string().required().valid(Joi.ref('password'))
      .messages({ 'any.only': 'Passwords do not match' }),
  }),
};


const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};




  





module.exports = {
  register,
  registerAdmin,
  login,
  logout,
  refreshTokens,
  

};
