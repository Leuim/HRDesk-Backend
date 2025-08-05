const mongoose = require('mongoose')
const User = require('./user')

const leaveBalanceSchema = mongoose.Schema({
    annual:{
        type:Number,
        default:30,
        min:0
    },
    sick:{
        type:Number,
        default:30,
        min:0
    },
    others:{
        type:Number,
        default:100,
        min:0
    },
    employee:{
        type:mongoose.Schema.Types.ObjectId,ref:'User'
    }
})

const LeaveBalance = mongoose.model('LeaveBalance', leaveBalanceSchema)
module.exports = LeaveBalance