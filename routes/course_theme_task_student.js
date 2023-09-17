
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
var { ensureToken }=require("../token/token.js")
var fs=require("fs")
router.get("/course_theme_task_student", (req, res) => {   
    pool.query("SELECT * FROM course_theme_task_student", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/course_theme_task_student/:id', (req, res) => {
    
    pool.query("SELECT * FROM course_theme_task_student where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/course_theme_task_student",ensureToken, (req, res) => {
    const body = req.body;
    var imgName="";
    if(req.files){
        const imgFile = req.files.image
         imgName = `https://${req.hostname}/`+Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
    }else{
        imgName=req.body.image
    }
        pool.query('INSERT INTO course_theme_task_student (content,course_theme,image,feedback,mark) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [body.content,body.course_theme,imgName,body.feedback,body.mark],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                if(req.files){
                    const imgFile = req.files.image
                    imgFile.mv(`${__dirname}/Images/${imgName}`)
                }
                res.status(201).send("Created");
            }
        });
});

router.delete("/course_theme_task_student/:id",ensureToken, (req, res) => {
    const id = req.params.id
    pool.query("SELECT * FROM course_theme_task_student where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
            if(result1.rows[0].image){
                 
            }
            pool.query('DELETE FROM course_theme_task_student WHERE id = $1', [id], (err, result) => {
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
router.put("/course_theme_task_student/:id",ensureToken, (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query("SELECT * FROM course_theme_task_student where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
            if(result1.rows[0].image){
                   
              }
              if(req.files){
                const imgFile = req.files.image
                 imgName = `https://${req.hostname}/`+Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
            }else{
                imgName=req.body.image
            }
    pool.query(
        'UPDATE course_theme_task_student SET content=$1,course_theme=$2,image=$3,feedback=$4,mark=$5 WHERE id=$6',
        [body.content,body.course_theme,imgName,body.feedback,body.mark,id ],
        (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
                if(req.files){
                    const imgFile = req.files.image
                    imgFile.mv(`${__dirname}/Images/${imgName}`)
                }
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