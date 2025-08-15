const router = require('express').Router()
const LeaveBalance = require('../models/leaveBalance')
const User = require('../models/user')
const verifyToken = require('../middleware/verify-token');


//show
router.get('/:userId', verifyToken, async (req,res)=>{
    try {
        const BalanceOwner = await User.findById(req.params.userId).populate('leavebalance')
        const {leavebalance} = BalanceOwner
        res.status(200).json(leavebalance)
    } catch (err) {
        res.status(500).json({err:err.message})
    }
})

// edit leave balance
router.put('/:leaveBalanceId', verifyToken,  async (req, res) => {
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
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;