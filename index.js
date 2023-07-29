
const express = require("express")
const app = express()
const cors = require("cors")
const fileUpload = require("express-fileupload")
const pool = require("./db")
const user=require('./routes/user.js')
const cours_types=require('./routes/cours_types.js')

const fs=require('fs')
const path = require('path'); 
app.use(fileUpload())
app.use(cors())
app.use(express.static("Images"))

app.get('/doc',(req,res)=>{
    const data = fs.readFileSync('./input.html',
    { encoding: 'utf8', flag: 'r' });

res.status(200).send(data)
})
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/input.html'));
  });
  
 app.use("/auth" , user )
 app.use("/api" , cours_types)












app.listen(5000, () => {
    console.log("Localhost is Running");
})

