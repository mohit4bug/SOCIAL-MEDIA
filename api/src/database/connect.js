const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "social"
}).then(() => {
    console.log('DB : MongoDB')
}).catch(e => {
    console.log(e)
})