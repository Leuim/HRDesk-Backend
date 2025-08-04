const mongoose = require('mongoose')
const User = require('./user')
const { ObjectId } = require('mongodb')

const leaveRequestSchema = mongoose.Schema({
    SubmittedBy:{
        type:ObjectId,ref:'User'
    },
    LeaveType:{
        type:String,enum:['annual','sick','paternity']
    },
    FromDate:{
        type:Date
    },
    ToDate:{type:Date

    },
    Reson:{
        type:String
    },
    Status:{
        type:String,enum:['pending','approved','rejected']
    },
    ReviewBy:{
        type:ObjectId,ref:'User'
    },
    RejectionReason:{
        type:String
    },
    CreateAt:{
        type:Date
    }

   
})

const LeaveRequest= mongoose.model('LeaveRequest',leaveRequestSchema )
module.exports = LeaveRequest