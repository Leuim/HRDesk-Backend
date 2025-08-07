const express = require('express');
const router = express.Router();
const User = require('../models/user');
const verifyToken = require('../middleware/verify-token');

router.get('/',verifyToken,  async (req, res) => {
  try {
    const users = await User.find({role:'employee'}, "name role");

    res.json(users);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get('/:userId', verifyToken, async (req, res) => {
  try {
    if (req.user._id !== req.params.userId){
      return res.status(403).json({ err: "Unauthorized"});
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ err: 'User not found.'});
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.put('/:userId', verifyToken, async (req,res)=>{
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      {new:true}
    )
    res.status(200).json(updatedUser)
  } catch (err) {
    res.status(500).json({err:err.message})
  }
})

router.delete('/:userId', verifyToken, async (req,res)=>{
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId)
    res.status(200).json(deletedUser)
  } catch (error) {
    res.status(500).json({err:err.message})
  }
})



module.exports = router;