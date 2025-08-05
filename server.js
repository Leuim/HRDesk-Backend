const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const logger = require('morgan');

const app = express()
const cors = require('cors')

const hrdeskRouter = require('./controllers/auth.js');
app.use(cors({ origin: 'http://localhost:5173' }));


mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected',()=>{
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
})

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

const authRouter = require('./controllers/auth');
const userRouter = require('./controllers/users');

app.use('/auth', authRouter);
app.use('/user', userRouter);

app.use(express.json());
app.use(logger('dev'));

app.use('/auth', hrdeskRouter);

app.listen(3000,()=>{
    console.log(`Listening on port: ${3000}`);
})