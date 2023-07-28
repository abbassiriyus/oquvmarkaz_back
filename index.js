
const express = require("express")
const app = express()
const cors = require("cors")
const fileUpload = require("express-fileupload")
const pool = require("./db")
const user=require('./routes/user.js')
const fs=require('fs')

app.use(fileUpload())
app.use(cors())
app.use(express.static("Images"))

app.get('/doc',(req,res)=>{
    const data = fs.readFileSync('./input.txt',
    { encoding: 'utf8', flag: 'r' });

res.status(200).send(data)
})


 app.use("/auth" , user )












app.listen(5000, () => {
    console.log("Localhost is Running");
})

