const mongoose = require('mongoose')
const User = require('./user')

const leaveRequestSchema = new mongoose.Schema({
  duration:{
    type:Number,
    required:true,
    min:1
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  },
  leaveType: {
    type: String, 
    enum: ['annual', 'sick', 'others'],
    required: true
  },
  fromDate: {
    type: Date,
    required: true
  },
  toDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewBy: {
    type: String, ref: 'User'
  },
  rejectionReason: String
}, {
  timestamps: true
});


const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema)
module.exports = LeaveRequest