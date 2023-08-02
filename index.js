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
const course_data_theme=require('./routes/course_data_theme')
const course_data_category=require('./routes/course_data_category')
const base_theme=require('./routes/base_theme')
const knowladge=require('./routes/knowladge')
const api_root=require('./routes/api_root')
const registerCourse=require('./routes/registerCourse')

const fs=require('fs')
// const socket=require("./routes/socket.js")
const bodyParser = require('body-parser');
const path = require('path'); 
app.use(fileUpload())
app.use(cors())
app.use(express.static('./routes/Images'))
app.use(bodyParser.json());
app.get('/doc',(req,res)=>{
    const data = fs.readFileSync('./input.html',
    { encoding: 'utf8', flag: 'r' });
res.status(200).send(data)
})
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/input.html'));
  });
 app.use("/api", registerCourse )
 app.use("/auth", user )
 app.use("/api" ,cours_types)
 app.use("/api" ,course)
 app.use("/api",course_theme_task)
 app.use("/api",course_data_category)
 app.use("/api",course_data_comment)
 app.use("/api",course_data_theme)
 app.use("/api",base_theme)
 app.use("/api",knowladge)
 app.use("/api",api_root)
//  app.use("/message",socket)
app.listen(5000, () => {
    console.log("Localhost is Running");
})

