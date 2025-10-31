const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService } = require('../services');




const register = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body);
    const id = user._id.toString();
    const tokens = await tokenService.generateAuthTokens({ id, actor: "customer" });

    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.__v;
    res.status(201).send({ user: safeUser, tokens });
});

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    
    let user = await authService.loginUserWithEmailAndPassword(email, password);

    const id = user._id.toString();
    const tokens = await tokenService.generateAuthTokens({ id, actor: "customer" });
    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.__v;

    res.status(201).send({ user: safeUser, tokens });
});

const logout = catchAsync(async (req, res) => {
    await authService.logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
    const tokens = await authService.refreshAuth(req.body.refreshToken, req.body.actor);
    res.send({ ...tokens });
});



module.exports = {
    register,
    login,
    logout,
    refreshTokens
}