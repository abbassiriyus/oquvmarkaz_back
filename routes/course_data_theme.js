
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")


router.get("/course_data_theme", (req, res) => {   
    pool.query("SELECT * FROM course_data_theme", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/course_data_theme/:id', (req, res) => { 
    pool.query("SELECT * FROM course_data_theme where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
 

router.post("/course_data_theme", (req, res) => {
    const body = req.body;
    var videoFile="" 
    var videoName=""
    var imgFile=""
    var imgName=""
   if(req.files && req.files.video){
    videoFile = req.files.video 
    videoName = req.protocol+"://"+req.hostname+"/"+imgName+Date.now()+videoFile.name.slice(videoFile.name.lastIndexOf('.'))   
   }else{
if(body.video){
    console.log(body.video);
    if (body.video.includes('https://www.youtube.com/watch?v=')) {
  
   videoName='https://www.youtube.com/embed/'+body.video.slice(-11)
    }
   if(body.video.includes("https://youtu.be/")){
  videoName=body.video.repliceAll("https://youtu.be/","https://www.youtube.com/embed/")
  videoName='https://www.youtube.com/embed/'+body.video.slice(-11)
   }
  
}else{
    videoName=null
}
}
if(req.files && req.files.image){
     imgFile = req.files.image
     imgName = req.protocol+"://"+req.hostname+"/"+imgName+Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
 }else{
    imgName=body.image   
 }
pool.query('INSERT INTO course_data_theme (name,content,image,video,extra_data,category) VALUES ($1,$2,$3,$4,$5, $6) RETURNING *',
[body.name,body.content,imgName,videoName,body.extra_data,body.category],(err, result) => {
    if (err) {
                res.status(400).send(err);
        } else {  
        if(req.files && req.files.video){
                    videoFile = req.files.video 
                  videoFile.mv(`${__dirname}/Images/${videoName.slice(videoName.lastIndexOf('/'))}`)
                  console.log("asd");
                  }   
             if(req.files && req.files.image){
                imgFile = req.files.image
                imgFile.mv(`${__dirname}/Images/${imgName.slice(imgName.lastIndexOf('/'))}`)
                console.log("asd2");
            } 
                res.status(201).send("Created");
            }
        });
});

router.delete("/course_data_theme/:id", (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM course_data_theme WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/course_data_theme/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    var videoFile="" 
    var videoName=""
    var imgFile=""
    var imgName=""

if(req.files && req.files.video){
    videoFile = req.files.video 
    videoName =result1.rows[0].video
}else{
if(body.video){
videoName=body.video.repliceAll("https://www.youtube.com/watch?v=","https://www.youtube.com/embed/")
videoName=body.video.repliceAll("https://youtu.be/","https://www.youtube.com/embed/")
}else{
    videoName=null
}
}
if(req.files && req.files.image){
     imgFile = req.files.image
     imgName =result1.rows[0].image
 }else{
    imgName=body.image   
 }

    pool.query(
        'UPDATE course_data_theme SET name=$1,content=$2,image=$3,video=$4,extra_data=$5,category=$6 WHERE id = $7',
        [body.name,body.content,imgName,videoName,body.extra_data,body.category,id ],
        (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
            if(req.files && req.files.video){
                    videoFile = req.files.video 
                    videoFile.mv(`${__dirname}/Images/${videoName.slice(videoName.lastIndexOf('/'))}`)
             }   
             if(req.files && req.files.image){
                imgFile = req.files.image
                imgFile.mv(`${__dirname}/Images/${imgName.slice(imgName.lastIndexOf('/'))}`)
             } 
                res.status(200).send("Updated")
            }
        }
    )
})

module.exports = router;