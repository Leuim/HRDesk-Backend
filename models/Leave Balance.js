const mongoose = require('mongoose')
const User = require('./user')
const { ObjectId } = require('mongodb')

const leaveBalanceSchema = mongoose.Schema({
    Annual:{
        type:Number
    },
    Sick:{
        type:Number
    },
    Paternity:{
        type:Number
    },
    Employee:{type:ObjectId,ref:'User'

    }

   
})

const LeaveBalance = mongoose.model('LeaveBalance', leaveBalanceSchema)
module.exports = LeaveBalance