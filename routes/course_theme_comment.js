
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var fs =require("fs")
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
    
    pool.query("SELECT * FROM course_theme_comment where theme=$1", [req.params.id], (err, result1) => {
        if (!err) {
            
    pool.query("SELECT id,image,username FROM users", (err, result) => {
        if (!err) {
           var a=result1.rows
           var b=result.rows
               for(let i = 0; i < a.length; i++) {
                for (let j = 0; j < b.length; j++) {
                if(a[i].user_id==b[j].id){
                    a[i].oneuser=b[j]
                 }
                }}
                res.status(200).send(a)
                    }
                 })
          } else {
            res.status(400).send(err)
          }
    })
})


router.post("/course_theme_comment", (req, res) => {
    const body = req.body;
    var imgName="";
    if(req.files){
        const imgFile = req.files.image
         imgName = Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
    }else{
        imgName=req.body.image
    }
    pool.query('INSERT INTO course_theme_comment (theme,text,image,subcomment,user_id,task_commnet_id) VALUES ($1 ,$2 ,$3 ,$4 ,$5,$6 ) RETURNING *',
        [body.theme,body.text,imgName,body.subcomment,body.user_id,body.task_commnet_id],
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

router.delete("/course_theme_comment/:id", (req, res) => {
    const id = req.params.id
    pool.query("SELECT * FROM course_theme_comment where id=$1", [req.params.id], (err, result1) => {
        console.log(result1.rows);
     if (!err && result1.rows.length>0) {
            if(result1.rows[0] && result1.rows[0].image){
              fs.unlink(`./Images/${result1.rows[0].image}`,()=>{})   
            }
            pool.query('DELETE FROM course_theme_comment WHERE id = $1', [id], (err, result) => {
                if (err) {
                    res.status(400).send(
                        {err:err,message:"course_theme_comment id topilmadi "}
                    )
                } else {
                    res.status(200).send("Deleted")
                }
            })
        } else {
            res.status(400).send(err)
        }
    })

   


})
router.put("/course_theme_comment/:id",ensureToken, (req, res) => {
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
        'UPDATE course_theme_comment SET theme=$1,text=$2,image=$3,subcomment=$4,user_id=$5,task_commnet_id=$7 WHERE id = $6',
        [body.theme,body.text,imgName,body.subcomment,body.user_id,id,body.task_commnet_id ],
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