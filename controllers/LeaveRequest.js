//LeaveRequestControllers
const router = require('express').Router()
const LeaveRequest = require('../models/Leave Request')
const verifyToken = require("../middleware/verify-token.js");
const User = require('../models/user.js');
const LeaveBalance = require('../models/Leave Balance.js');


//Create New Leave Request
router.post("/", verifyToken, async (req, res) => {
  try {

    const newleaveRequest = await LeaveRequest.create({
      ...req.body ,
      submittedBy: req.user._id
    });

    res.status(201).json(newleaveRequest);
  } catch (err) {
    console.error("Error creating leave request:", err);
    res.status(500).json({ err: err.message });
  }
});

//List All Leave of User
router.get('/', verifyToken, async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ submittedBy: req.user._id }).populate('submittedBy').sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
})

// get all leaverequest
router.get('/all-leaves', verifyToken, async (req, res) => {
  try {
    const leaves = await LeaveRequest.find().populate('submittedBy').populate('reviewBy').sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
})
//GET One Leave 
router.get('/:LeaveRequestId', async (req, res) => {

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
router.put('/:LeaveRequestId', async (req, res) => {
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
router.delete("/:LeaveRequestId", async (req, res) => {
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

router.put('/:leaveId/approve', verifyToken, async (req, res) => {
  try {
    console.log('Received body:', req.body);

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const { leaveType } = req.body;

    const leave = await LeaveRequest.findOne(
      { _id: req.params.leaveId, status: 'pending' },
      
    );

    if (!leave) {
      return res.status(400).json({ message: 'Leave request not found or already processed.' });
    }

    const leaveOwner = await User.findById(req.user._id);
    if (!leaveOwner) {
      return res.status(400).json({ message: 'Leave request owner not found.' });
    }

    const leaveBalance = await LeaveBalance.findById(leaveOwner.leavebalance);
    if (!leaveBalance) {
      return res.status(400).json({ message: 'Leave balance not found.' });
    }

    const balance = leaveBalance[leaveType];
    if (balance < leave.duration) {
      return res.status(400).json({ message: `Not enough ${leaveType} leave balance.` });
    }

    leaveBalance[leaveType] -= leave.duration;

    await leaveBalance.save();

    leave.status = 'approved'
    leave.reviewBy =req.user.name; 
    await leave.save()

    res.status(200).json({ leave, leaveduration:leave.duration });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});


// PUT reject
router.put('/:leaveid/reject', verifyToken, async (req, res) => {
  try {

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const leave = await LeaveRequest.findById(req.params.leaveid);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found.' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ message: 'Leave request already processed.' });
    }

    const { rejectionReason } = req.body;
    if (!rejectionReason) {
      return res.status(400).json({ message: 'Rejection reason is required.' });
    }

    leave.status = 'rejected';
    leave.reviewBy = req.user.name;
    leave.rejectionReason = rejectionReason;

    await leave.save();

    res.status(200).json({ leave });
  } catch (err) {
    res.status(500).json({ err: err.message });

  }
});



module.exports = router;