
const express = require('express')
const { connectToMongo } = require('./db')
const cors = require('cors')

const bodyParser=require('body-parser')

const app =express()
app.use(cors())

app.use(express.json())
connectToMongo()

app.use("/api/auth",require("./routes/auth"))
app.use("/api/notes",require("./routes/notes"))


app.get("/",(req,res)=>{
    res.send("hello")
})

app.listen(5000,function(){
     console.log("started")
})

