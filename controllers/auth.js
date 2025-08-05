const jwt = require('jsonwebtoken')
const User = require('../models/user')
const LeaveBalance = require('../models/Leave Balance')
const router = require('express').Router()
const bcrypt = require('bcrypt')

const saltRounds = 10

router.post('/sign-up', async (req, res) => {
    try {
        const userInDatabase = await User.findOne({ name: req.body.name })
        if (userInDatabase) {
            res.status(409).json({ err: 'Username already taken' })
        }

        const user = await User.create({
            name: req.body.name,
            password: bcrypt.hashSync(req.body.password, saltRounds),
            role:req.body.role
        })
        
        await LeaveBalance.create({
            employee:user._id
        })

        const payload = {
            _id: user._id,
            name: user.name,
            role: user.role
        }

        const token = jwt.sign({ payload }, process.env.JWT_SECRET)

        res.status(201).json({ token })
    } catch (err) {
        res.status(400).json({ err: err.message })
    }
})

router.post('/sign-in', async (req, res) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) {
      return res.status(401).json({ err: 'Invalid credentials.' });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password, user.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ err: 'Invalid credentials.' });
    }

    const payload = {
            _id: user._id,
            name: user.name,
            role: user.role
        }

    const token = jwt.sign({ payload }, process.env.JWT_SECRET);

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router