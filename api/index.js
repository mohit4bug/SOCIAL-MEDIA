const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const verify = require('./src/middlewares/valid')
const path = require('path')

dotenv.config({
    path: './src/configs/config.env'
})
const app = express()



const port = process.env.PORT
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}))
app.use(cookieParser())
app.use(express.json())
app.use('/public/images', express.static('public/images'))


// Routes
app.use('/api/auth', require('./src/routes/auth'))
app.use("/api/post", verify, require('./src/routes/post'))
app.use("/api/user", verify, require('./src/routes/user'))





















// server and database
app.listen(port, () => {
    console.log(`PORT : ${port}`)
})
require('./src/database/connect')