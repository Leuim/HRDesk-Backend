const mongoose = require('mongoose')
const User = require('./user')

const leaveRequestSchema = mongoose.Schema({
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    leaveType: {
        type: String, 
        enum: ['annual', 'sick', 'Others'],
        required:true
    },
    fromDate: {
        type: Date,
        required:true
    },
    toDate: {
        type: Date,
        required:true
    },
    reason: {
        type: String,
        required:true
    },
    status: {
        type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending'
    },
    reviewBy: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    rejectionReason: {
        type: String
    },
    timestamps: true
})

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema)
module.exports = LeaveRequest