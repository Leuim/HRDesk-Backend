const router = require('express').Router()
const LeaveRequest = require('../models/Leave Request')
const verifyToken = require("../middleware/verify-token.js");


//Create New Leave Request
router.post("/", async (req, res) => {
  try {
    
    const newleaveRequest = await LeaveRequest.create({
      ...req.body,
      submittedBy: req.userId 
    });

    res.status(201).json(newleaveRequest); 
  } catch (err) {
    console.error("Error creating leave request:", err); 
    res.status(500).json({ err: err.message });
  }
})

//List All Leave of User
router.get('/' , async (req, res) => {
    try {
        const leaves = await LeaveRequest.find({ submittedBy: req.userId }).sort({ createdAt: -1 });
        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
})


//GET One Leave 
router.get('/:LeaveRequestId',  async (req,res)=>{

  try {
        const leave = await LeaveRequest.findById(req.params.LeaveRequestId);

        if (!leave) {
            return res.status(404).json({ message: 'Leave Request not found' });
        }

        res.status(200).json(leave);
    } catch (error) {
        res.status(400).json({ message: 'Invalid ID' });
    }

})

//UPDATE Leave
  router.put('/:LeaveRequestId',  async (req, res) => {
    try {
        const leave = await LeaveRequest.findById(req.params.LeaveRequestId);

        if (!leave) {
            return res.status(404).json({ message: 'Leave Request not found' });
        }

        const updatedLeave = await LeaveRequest.findByIdAndUpdate(
            req.params.LeaveRequestId,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedLeave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})


//DELETE Leave
router.delete("/:LeaveRequestId",  async (req, res) => {
    try {
        const leave = await LeaveRequest.findById(req.params.LeaveRequestId);
        if (!leave) {
            return res.status(404).json({ message: 'Leave Request not found' });
        }
        await LeaveRequest.findByIdAndDelete(req.params.LeaveRequestId);
        res.status(200).json({ message: 'Leave Request deleted successfully' });
    } catch (error) {
        console.error("Error deleting leave request:", error);
        res.status(500).json({ message: 'Server Error' });
    }
})


module.exports = router;