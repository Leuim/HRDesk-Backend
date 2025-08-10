const mongoose = require('mongoose')
const User = require('./user')

const leaveBalanceSchema = mongoose.Schema({
    annual:{
        type:Number,
        default:60,
        min:0
    },
    sick:{
        type:Number,
        default:20,
        min:0
    }, 
    others:{
        type:Number,
        default:20,
        min:0
    },
    
   
    
})

const LeaveBalance = mongoose.model('LeaveBalance', leaveBalanceSchema)
module.exports = LeaveBalance