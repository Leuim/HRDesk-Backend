//LeaveRequestControllers
const router = require('express').Router()
const LeaveRequest = require('../models/Leave Request')
const verifyToken = require("../middleware/verify-token.js");
const LeaveBalance=require('../models/Leave Balance.js')

//Create New Leave Request
// leaveRequestRouter.js
// leaveRequestRouter.js
router.post("/", async (req, res) => {
  try {
    // Destructure and validate all required fields
    const {
      leaveType,
      fromDate,
      toDate,
      reason,
      duration,
      submittedBy
    } = req.body;

    // Validate required fields
    if (!leaveType || !fromDate || !toDate || !reason || !duration || !submittedBy) {
      return res.status(400).json({ 
        err: "Missing required fields",
        required: ["leaveType", "fromDate", "toDate", "reason", "duration", "submittedBy"]
      });
    }

    // Create the request with all required fields
    const newRequest = await LeaveRequest.create({
      leaveType,
      fromDate: new Date(fromDate), // Ensure proper Date conversion
      toDate: new Date(toDate),
      reason,
      duration: Number(duration), // Ensure it's a number
      submittedBy,
      status: 'pending'
    });
    // Update balance
    const updatedBalance = await LeaveBalance.findOneAndUpdate(
      { employee: submittedBy },
      { $inc: { [leaveType]: -duration } },
      { new: true } // Return the updated document
    );

    res.status(201).json({
      ...newRequest.toObject(),
      updatedBalance // Include the new balance
    });

    // res.status(201).json(newRequest);
  } catch (err) {
    console.error("Creation error:", err);
    res.status(400).json({ 
      err: err.message,
      details: err.errors // Mongoose validation errors
    });
  }
});



//List All Leave of User
//List All Leave of User
router.get("/", async (req, res) => {
  try {
    console.log('Query parameters:', req.query); // Debug
    const { employee } = req.query;
    
    if (!employee) {
      console.error('No employee ID provided');
      return res.status(400).json({ err: "Employee ID required" });
    }

    const leaves = await LeaveRequest.find({ submittedBy: employee }) // Explicit field
      .sort({ createdAt: -1 })
      .lean(); // Convert to plain JS objects

    console.log('Found requests:', leaves.length); // Debug
    res.status(200).json(leaves);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ err: err.message });
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