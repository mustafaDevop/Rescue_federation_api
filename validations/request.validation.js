const Joi = require('joi');

const createRequest = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    serviceType: Joi.string().valid('medical', 'appointment', 'checkup').required(),
    location: Joi.string().required(),
    time: Joi.string().required()
  })
};

const updateStatus = {
  body: Joi.object().keys({
    status: Joi.string().valid('pending', 'accept', 'processing', 'completed').required()
  }),
  params: Joi.object().keys({
    requestId: Joi.string().required()
  })
};

module.exports = {
  createRequest,
  updateStatus
};