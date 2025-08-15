const express = require('express');
const router = express.Router();
const User = require('../models/user');
const LeaveBalance = require('../models/leaveBalance')
const verifyToken = require('../middleware/verify-token');
const LeaveRequest = require('../models/leaveRequest')

router.get('/', verifyToken, async (req, res) => {
  try {
    const users = await User.find().populate('leavebalance');
    if (users.length === 0) {
      res.status(404)
      return res.status(200).json([]);
    }
    res.status(200).json(users);
  } catch (err) {
    if (res.statusCode === 404) {
      res.json({ err: err.message })
    } else {
      res.status(500).json({ err: err.message });
    }
  }
});

router.get('/:userId', verifyToken, async (req, res) => {
  try {
    if (req.user._id !== req.params.userId) {
      return res.status(403).json({ err: "Unauthorized" });
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ err: 'User not found.' });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.put('/:userId', verifyToken, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true }
    ).populate('leavebalance')
    res.status(200).json(updatedUser)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})

router.delete('/:userId', verifyToken, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId)
    await LeaveRequest.delateMany({submittedBy:req.userId})
    if (!deletedUser) {
      return res.status(404).json({ err: 'User not found' })
    }

    if (deletedUser.leavebalance) {
      await LeaveBalance.findByIdAndDelete(deletedUser.leavebalance)
    }

    res.status(200).json(deletedUser)
  } catch (error) {
    res.status(500).json({ err: error.message })
  }
})



module.exports = router;