const { verify } = require("jsonwebtoken");
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const config = require('../config/auth');
const { dB } = require('../models');

let staticy;

verifyToken = async(req,res,next) => {
    let token = req.headers.authorization;
    if (!token) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please use a Token'));
    }
    token = token.split(" ")[1];


    verify(token, config.jwt.secret, async(err, decoded) => {
        if(err) {
            return next(new ApiError(httpStatus.UNAUTHORIZED, 'Error with authentication'));
        }
        staticy = decoded.sub;
        switch (staticy?.actor?.toString()) {
            case "customer":
                req.user = await dB.users.findOne( { _id : staticy?.id } );
                if(req.user) {
                    next();
                } else {
                    return next(new ApiError(httpStatus.NOT_FOUND, 'Please authenticate customer')); 
                }
                break;
            case "admin":
                req.user = await dB.admins.findOne( { _id : staticy?.id } );
                if(req.user) {
                    next();
                } else {
                    return next(new ApiError(httpStatus.NOT_FOUND, 'Please authenticate vendor')); 
                }
                break;
           
            
        
            default:
                return next(new ApiError(httpStatus.NOT_FOUND, 'Please authenticate unknown'));
                break;
        }
        // req.user = await dB.users.findOne( { _id : staticy } );
        // if(req.user) {
        //     next();
        // } else {
        //     return next(new ApiError(httpStatus.NOT_FOUND, 'Please authenticate')); 
        // }
    })
    
     
}

verifyQueryToken = async(req,res,next) => {
    let token = req.query.token;
    if (!token) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }

    verify(token, config.jwt.secret, async(err, decoded) => {
        if(err) {
            return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
        }
        staticy = decoded.sub;
        switch (staticy?.actor?.toString()) {
            case "customer":
                req.user = await dB.users.findOne( { _id : staticy?.id } );
                if(req.user) {
                    next();
                } else {
                    return next(new ApiError(httpStatus.NOT_FOUND, 'Please authenticate')); 
                }
                break;
            case "vendor":
                req.user = await dB.vendors.findOne( { _id : staticy?.id } );
                if(req.user) {
                    next();
                } else {
                    return next(new ApiError(httpStatus.NOT_FOUND, 'Please authenticate')); 
                }
                break;
            case "rider":
                req.user = await dB.riders.findOne( { _id : staticy?.id } );
                if(req.user) {
                    next();
                } else {
                    return next(new ApiError(httpStatus.NOT_FOUND, 'Please authenticate')); 
                }
                break;
                case "admin":
                    req.user = await dB.admins.findOne( { _id : staticy?.id } );
                    if(req.user) {
                        next();
                    } else {
                        return next(new ApiError(httpStatus.NOT_FOUND, 'Please authenticate admin'))
                    }
                    break;
        
            default:
                return next(new ApiError(httpStatus.NOT_FOUND, 'Please authenticate'));
                break;
        }
        // req.user = await dB.users.findOne( { id : staticy } );
        // next();
    })
    
     
}



const jwtAuth = {
    verifyToken,
    verifyQueryToken
}

module.exports = jwtAuth;