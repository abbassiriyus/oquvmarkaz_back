
const express = require("express")
const app = express()
const cors = require("cors")
const fileUpload = require("express-fileupload")
const pool = require("./db")
const user=require('./routes/user.js')
const cours_types=require('./routes/cours_types.js')
const course=require('./routes/course.js')
const course_theme_task=require('./routes/course_theme_task.js')
const course_data_comment=require('./routes/course_data_comment')
const course_data_comment=require('./routes/course_data_theme')
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
 app.use("/api" , course)
 app.use("/api",course_theme_task)
 app.use("/api",course_data_comment)
 app.use("/api",course_data_theme)










app.listen(5000, () => {
    console.log("Localhost is Running");
})

