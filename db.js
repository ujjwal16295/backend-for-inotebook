const mongoose=require('mongoose')
const url="mongodb+srv://ujjwal:ujjwal@cluster0.ttxeinc.mongodb.net/iuserDb"
// mongodb://localhost:27017/testingDb
const connectToMongo=()=>{
    mongoose.connect(url,{ useNewUrlParser: true })
}


module.exports={connectToMongo}
