const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService } = require('../services');
const ApiError = require('../utils/ApiError');

const registerAdmin = catchAsync(async (req, res) => {
    const user = await userService.createAdmin(req.body);
    if (!user) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create admin');
    
    const id = user._id.toString();
    const tokens = await tokenService.generateAuthTokens({ id, actor: "admin" });
    if (!tokens) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to generate tokens');
  
    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.__v;
  
    res.status(201).send({ user: safeUser, tokens });
});
  

const loginAdmin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginAdminWithEmailAndPassword(email, password);

  const id = user._id.toString();
  const tokens = await tokenService.generateAuthTokens({ id, actor: "admin" });

  const safeUser = user.toObject();
  delete safeUser.password;
  delete safeUser.__v;

  res.status(201).send({ user: safeUser, tokens });
});

module.exports = {
  registerAdmin,
  loginAdmin,
};
