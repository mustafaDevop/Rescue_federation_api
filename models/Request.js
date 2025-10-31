const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  },
  name: {
    type: String,
    required: true,
  },
  serviceType: {
    type: String,
    enum: ['medical', 'appointment', 'checkup'],
    default: 'medical'
    },
    location: {
      type: String,
      required: true,
    },
    time:{

    },
  status: {
    type: String,
    enum: ['pending', 'accept', 'processing', 'completed'],
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Request", requestSchema);
