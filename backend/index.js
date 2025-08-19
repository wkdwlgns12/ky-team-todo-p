const express = require("express")
const mongoose=require("mongoose")

const dotenv = require("dotenv")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
        .then(()=>console.log("mongodb 연결 성공"))
        .catch((err)=>console.log("연결 실패",err))



  
app.get('/',(req,res)=>{
    res.send("Hello Express!")
})

app.listen(PORT,()=>{
    console.log('Server is Running!')
})