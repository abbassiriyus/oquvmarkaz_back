
const express = require("express")
const app = express()
const cors = require("cors")
const fileUpload = require("express-fileupload")
const pool = require("./db")
const user=require('./routes/user.js')


app.use(fileUpload())
app.use(cors())
app.use(express.static("Images"))

app.get('/doc',()=>{




})


app.use("/auth" , user )












app.listen(5000, () => {
    console.log("Localhost is Running");
})

