const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')

const PORT = process.env.PORT

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected',()=>{
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
})

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

const authRouter = require('./controllers/auth');
const userRouter = require('./controllers/users');
const leaveBalanceRouter = require('./controllers/leaveBalance.js')

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/leaveBalance', leaveBalanceRouter)

app.listen(PORT,()=>{
    console.log(`Listening on port: ${PORT}`);
})