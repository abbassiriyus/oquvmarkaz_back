
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
var {ensureToken,ensureToken,ensureTokenTeacher,superTeacher }=require("../token/token.js")

 router.get("/course_theme_comment", (req, res) => {   
     pool.query("SELECT * FROM course_theme_comment", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
     })
   })

router.get('/course_theme_comment/:id', (req, res) => {
    
    pool.query("SELECT * FROM course_theme_comment where theme=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/course_theme_comment", (req, res) => {
    console.log("hello");
    const body = req.body;
    var imgName="";
    if(req.files){
        const imgFile = req.files.image
         imgName = Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
    }else{
        imgName=req.body.image
    }
    pool.query('INSERT INTO course_theme_comment (theme,text,image,subcomment,user_id) VALUES ($1 ,$2 ,$3 ,$4 ,$5 ) RETURNING *',
        [body.theme,body.text,imgName,body.subcomment,body.user_id],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                console.log("hello");
                if(req.files){
                    const imgFile = req.files.image
                    imgName = Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
                    imgFile.mv(`${__dirname}/Images/${imgName}`)
                }
                res.status(201).send("Created");
            }
        });
});

router.delete("/course_theme_comment/:id",ensureToken, (req, res) => {
    const id = req.params.id
    pool.query("SELECT * FROM course_theme_comment where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
            if(result1[0].image){
              fs.unlink(`./Images/${result1[0].image}`,()=>{})   
            }
            pool.query('DELETE FROM course_theme_comment WHERE id = $1', [id], (err, result) => {
                if (err) {
                    res.status(400).send(err)
                } else {
                    res.status(200).send("Deleted")
                }
            })
        } else {
            res.status(400).send(err)
        }
    })

   


})
router.put("/api_root/:id",ensureToken, (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query("SELECT * FROM course_theme_comment where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
            if(result1[0].image){
                fs.unlink(`./Images/${result1[0].image}`,()=>{})   
              }
              if(req.files){
                const imgFile = req.files.image
                 imgName = Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
            }else{
                imgName=req.body.image
            }
    pool.query(
        'UPDATE api_root SET theme=$1,text=$2,image=$3,subcomment=$4,user=$5, WHERE id = $6',
        [body.theme,body.text,imgName,body.subcomment,body.user,id ],
        (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
                res.status(200).send("Updated")
            }
        }
    )
} else {
    res.status(400).send(err)
}
    })
})

module.exports = router;