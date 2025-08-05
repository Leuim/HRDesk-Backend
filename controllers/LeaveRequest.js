const express = require('express');
const router = express.Router();
const User = require('../models/user');
const LeaveRequest = require('../models/Leave Request')


//Create Leave
router.post('/') = async (req, res) => {
    try {
        const newLeave = new LeaveRequest({
            ...req.body,
            submittedBy: req.user.id
        });
        const leave = await newLeave.save();
        res.status(201).json(leave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//Get all leves of user by UserId
router.get('/') = async (req, res) => {
    try {
        const leaves = await LeaveRequest.find({ submittedBy: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


//Get One Leave
router.get('user/:LeaveRequestId',async (req,res)=>{

  try {
        const leave = await LeaveRequest.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({ message: 'Leave Request not found' });
        }

        // Authorization check
        if (leave.submittedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to view this Leave' });
        }
        
        res.status(200).json(leave);
    } catch (error) {
        res.status(400).json({ message: 'Invalid ID' });
    }

})



//Update Leave
   router.put('user/:LeaveRequestId') = async (req, res) => {
    try {
        const leave = await LeaveRequest.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({ message: 'Leave Request not found' });
        }

        // Authorization check
        if (leave.submittedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to update this Leave' });
        }

        const updatedLeave = await LeaveRequest.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedLeave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



//Delete Leave
router.delete(`user/:LeaveRequestId`, async (req, res) => {
    try {
        const leave = await LeaveRequest.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({ message: 'Leave Request not found' });
        }
        
        if (leave.submittedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this Leave' });
        }

        await leave.findByIdAndDelete(req.params.id);
        
        res.status(200).json({ message: 'Leave Request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});



module.exports = router