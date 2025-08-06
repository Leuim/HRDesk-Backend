const router = require('express').Router()
const LeaveBalance = require('../models/Leave Balance')

//show
router.get('/:userId', async (req,res)=>{
    try {
        const leaveBalance = await LeaveBalance.find({ employee:req.params.userId})
        res.status(200).json(leaveBalance)
    } catch (err) {
        res.status(500).json({err:err.message})
    }
})

// edit leave balance
router.put('/:leaveBalanceId', async (req, res) => {
  try {
    const leaveBalance = await LeaveBalance.findByIdAndUpdate(
      req.params.leaveBalanceId,
      req.body,
      { new: true }
    );

    if (!leaveBalance) {
      return res.status(404).json({ error: 'Leave balance not found' });
    }

    res.status(200).json(leaveBalance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router