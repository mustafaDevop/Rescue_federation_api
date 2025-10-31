const Request = require("../models/Request");
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService } = require('../services');
const ApiError = require('../utils/ApiError');

// 1. Create a new request
const createRequest = catchAsync(async (req, res) => {
  const { name, serviceType, location, time } = req.body;
  const userId = req.user._id; 

  if (!name || !serviceType || !location || !time) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'All fields are required');
  }

  const request = await Request.create({
    userId,
    name,
    serviceType,
    location,
    time,
    status: 'pending'
  });

  res.status(201).send({
    status: 'success',
    data: {
      request
    }
  });
});

const getUserRequests = catchAsync(async (req, res) => {
  
  try {
    const userId = req.user._id;
    
    const requests = await Request.find({ userId })
      .select('name serviceType location time status createdAt') 
      .sort({ createdAt: -1 });

    
    res.status(200).send({
      status: 'success',
      results: requests.length,
      data: {
        requests
      }
    });
    
  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

const updateRequestStatus = catchAsync(async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'accept', 'processing', 'completed'];
  if (!validStatuses.includes(status)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid status');
  }

  const request = await Request.findOneAndUpdate(
    { _id: requestId },
    { 
      status,
    
    },
    { new: true, runValidators: true }
  ).populate('userId', 'name email')
   .populate('adminId', 'name email');

  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }

  res.status(200).send({
    status: 'success',
    data: {
      request
    }
  });
});

const getFilteredRequests = catchAsync(async (req, res) => {
  const { status, serviceType, startDate, endDate, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

  const filter = {};
  
  if (status && status !== 'all') {
    filter.status = status;
  }
  
  if (serviceType && serviceType !== 'all') {
    filter.serviceType = serviceType;
  }
  
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) {
      filter.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      filter.createdAt.$lte = new Date(endDate);
    }
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Get all requests without userId filter
  const requests = await Request.find(filter)
    .select('name serviceType location time status createdAt') 
    .sort(sort);

  res.status(200).send({
    status: 'success',
    results: requests.length,
    data: {
      requests
    }
  });
});

module.exports = {
  createRequest,
  updateRequestStatus,
  getUserRequests,
  getFilteredRequests,
};