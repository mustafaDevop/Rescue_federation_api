const httpStatus = require('http-status');
const moment = require('moment');
const tokenService = require('./token.service');
const userService = require('./user.service');
const { dB } = require('../models');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);

  if (!user || !(await userService.isPasswordMatch(password, user))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  // update last login
  user.lastLogin = moment();
  await user.save(); 

  return user; 
};


/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginAdminWithEmailAndPassword = async (email, password) => {
  const user = await userService.getAdminByEmail(email);

  if (!user || !(await userService.isPasswordMatch(password, user))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  user.lastLogin = moment();
  await user.save();
  
  return user;
};




/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await dB.tokens.findOne( { token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false } );
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.delete();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken, actor = "customer") => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );

    let user;
    if (actor === "customer") {
      user = await userService.getUserById(refreshTokenDoc.user?.id);
    } else if (actor === "admin") {
      user = await userService.getAdminById(refreshTokenDoc.user?.id);
    } 
    

    if (!user) {
      throw new Error();
    }

    await refreshTokenDoc.delete();

    return tokenService.generateAuthTokens({ id: user._id, actor });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};





module.exports = {
  loginUserWithEmailAndPassword,
  loginAdminWithEmailAndPassword,
  logout,
  refreshAuth,
};
